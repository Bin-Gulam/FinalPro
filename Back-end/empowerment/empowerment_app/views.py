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


# =====================
# CRUD functions
# =====================


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    filterset_class = ApplicantFilter
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user = self.request.user

        # Step 1: Save applicant with user
        applicant = serializer.save(user=user)

        # Step 2: Assign sheha automatically based on ward
        try:
            sheha = Sheha.objects.get(ward=applicant.ward)
            applicant.sheha = sheha
            applicant.save()
        except Sheha.DoesNotExist:
            sheha = None

        # Step 3: Create Notification if sheha assigned
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
                    message=(
                        f'Dear {applicant.sheha.user.username},\n\n'
                        f'A new applicant from {applicant.village} has registered. '
                        f'Please review their information in your dashboard.\n\nThank you.'
                    ),
                    from_email='noreply@yourdomain.com',
                    recipient_list=[applicant.sheha.email],
                    fail_silently=True,
                )
class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated] 

    
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff


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

# =================
# Notification viws
# =================
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        print(f"User: {user}, ID: {user.id}")
        qs = Notification.objects.filter(sheha__user=user).order_by('-created_at')
        print(f"Notifications found: {qs.count()}")
        return qs


    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        notification = self.get_object()

        # Mark the notification and applicant as verified
        notification.is_read = True
        notification.is_verified_by_sheha = True
        notification.save()

        applicant = notification.applicant
        applicant.is_verified = True
        applicant.save()

        # Send notification email if applicant has an email
        if applicant.user.email:
            send_mail(
                subject='Application Verified',
                message=f'Dear {applicant.name}, your application has been approved by the Sheha.',
                from_email='noreply@yourdomain.com',
                recipient_list=[applicant.user.email],
                fail_silently=True,
            )

        return Response({'status': 'Notification verified and applicant updated.'})


# =========
# BankMock
# =========
class MockBankLoanViewSet(viewsets.ModelViewSet):
    queryset = MockBankLoan.objects.all() 
    serializer_class = MockBankLoanSerializer
    permission_classes = [IsAuthenticated]