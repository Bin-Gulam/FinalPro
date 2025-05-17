from empowerment_app.models import *
from empowerment_app.serializer import *
from .models import *
from rest_framework.decorators import action
from empowerment_app.filters import ApplicantFilter
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .filters import ApplicantFilter  

# =====================
# CRUD functions
# =====================

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    filterset_class = ApplicantFilter  
    permission_classes = [IsAuthenticated] 
  

    def create(self, request, *args, **kwargs):
        print("User:", request.user) 
        print("Auth:", request.auth) 
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        applicant = self.get_object()
        applicant.is_verified = True
        applicant.save()
        return Response({'status': 'Applicant verified'})
        
class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated] 

class ShehaViewSet(viewsets.ModelViewSet):
    queryset = Sheha.objects.all()
    serializer_class = ShehaSerializer 

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class LoanOfficerViewSet(viewsets.ModelViewSet):
    queryset = LoanOfficer.objects.all()
    serializer_class = LoanOfficerSerializer

class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer
