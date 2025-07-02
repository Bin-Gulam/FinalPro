from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import MockBankLoan
from .serializers import MockBankLoanSerializer

class MockBankLoanViewSet(viewsets.ModelViewSet):
    queryset = MockBankLoan.objects.all()
    serializer_class = MockBankLoanSerializer
    permission_classes = [IsAuthenticated]