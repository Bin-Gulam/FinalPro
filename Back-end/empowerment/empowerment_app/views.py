from django.forms import ValidationError
from bank_app.models import MockBankLoan
from empowerment_app.models import *
from empowerment_app.serializer import *
from .models import *
from empowerment_app.models import CustomUser as User
from rest_framework.response import Response
from rest_framework.decorators import action
from empowerment_app.filters import ApplicantFilter
from rest_framework import viewsets,permissions
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission
from .filters import ApplicantFilter  
from django.core.mail import send_mail
from rest_framework import status



# === Utility Function: Shared Bank Verification ===
def perform_bank_verification(applicant):
    try:
        business = Business.objects.get(applicant=applicant)
        bank_no = business.bank_no
        existing_loan = MockBankLoan.objects.filter(bank_no=bank_no, has_active_loan=True).first()

        if existing_loan:
            applicant.is_verified_by_bank = False
            applicant.bank_status = 'rejected'
        else:
            applicant.is_verified_by_bank = True
            applicant.bank_status = 'verified'

    except Business.DoesNotExist:
        applicant.is_verified_by_bank = False
        applicant.bank_status = 'no business found'

    applicant.save(update_fields=["is_verified_by_bank", "bank_status"])
    return applicant.bank_status

# === Applicant View ===
class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    filterset_class = ApplicantFilter
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user = self.request.user
        applicant = serializer.save(user=user)
        try:
            sheha = Sheha.objects.get(ward=applicant.ward)
            applicant.sheha = sheha
            applicant.save()
        except Sheha.DoesNotExist:
            pass

        if applicant.sheha:
            Notification.objects.create(
                sheha=applicant.sheha,
                applicant=applicant,
                name=applicant.name,
                village=applicant.village,
                passport_size=applicant.passport_size
            )
            if applicant.sheha.email:
                send_mail(
                    subject='New Applicant Notification',
                    message=f'Dear {applicant.sheha.user.username},\n\nA new applicant from {applicant.village} has registered. Please review their info.\n\nThank you.',
                    from_email='noreply@yourdomain.com',
                    recipient_list=[applicant.sheha.email],
                    fail_silently=True,
                )

    @action(detail=False, methods=['get'], url_path='me')
    def get_current_applicant(self, request):
        try:
            applicant = Applicant.objects.get(user=request.user)
            serializer = self.get_serializer(applicant)
            return Response(serializer.data)
        except Applicant.DoesNotExist:
            return Response({"detail": "Applicant not found."}, status=404)

# === Business View ===

class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Let serializer handle applicant assignment
        business = serializer.save()

        applicant = business.applicant
        if applicant.is_verified_by_sheha:
            perform_bank_verification(applicant)


class ShehaViewSet(viewsets.ModelViewSet):
    queryset = Sheha.objects.all()
    serializer_class = ShehaCreateSerializer
    permission_classes = [permissions.IsAdminUser] 
   
class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

class LoanOfficerViewSet(viewsets.ModelViewSet):
    queryset = LoanOfficer.objects.all()
    serializer_class = LoanOfficerSerializer
    permission_classes = [permissions.IsAdminUser]

class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer
    permission_classes = [IsAuthenticated]

# === Notification View ===
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            sheha__user=self.request.user,
            is_verified_by_sheha=False
        ).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.is_verified_by_sheha = True
        notification.save()

        applicant = notification.applicant
        applicant.is_verified_by_sheha = True
        applicant.is_verified = True
        applicant.save(update_fields=["is_verified_by_sheha", "is_verified"])

        # Trigger centralized bank verification
        bank_status = perform_bank_verification(applicant)

        # Send email update
        if applicant.user.email:
            status_map = {
                'verified': 'approved',
                'rejected': 'rejected due to existing loan',
                'no business found': 'rejected (no business info)'
            }
            msg = status_map.get(bank_status, 'status unknown')

            send_mail(
                subject='Application Status',
                message=f'Dear {applicant.name}, your application was approved by the Sheha. Bank verification: {msg}.',
                from_email='noreply@yourdomain.com', 
                recipient_list=[applicant.user.email],
                fail_silently=True,
            )

        return Response({
            'status': 'Sheha verification complete.',
            'bank_status': bank_status,
        }, status=status.HTTP_200_OK)

# === Admin/Read-Only Permission ===
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff
    
# =======LOANS=========
class LoanTypeViewSet(viewsets.ReadOnlyModelViewSet): 
    queryset = LoanType.objects.all()
    serializer_class = LoanTypeSerializer
    permission_classes = [IsAuthenticated]
    

class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all()
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()  # Save with default 'pending' status
        return Response(self.get_serializer(application).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        application = self.get_object()
        application.decision = 'approved'
        application.system_comment = request.data.get('comment', 'Approved by loan officer')
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.save()
        return Response({'status': 'approved', 'application_id': application.id})

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        application = self.get_object()
        application.decision = 'rejected'
        application.system_comment = request.data.get('comment', 'Rejected by loan officer')
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.save()
        return Response({'status': 'rejected', 'application_id': application.id})