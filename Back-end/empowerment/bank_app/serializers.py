from rest_framework import serializers
from .models import MockBankLoan

class MockBankLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockBankLoan
        fields = '__all__'
