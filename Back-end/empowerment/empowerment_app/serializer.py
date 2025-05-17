from rest_framework import serializers
from .models import *


# ================
# User serializer
# ================

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name']  

# class ApplicantSerializer(serializers.ModelSerializer):
#     user = serializers.SlugRelatedField(slug_field='username',queryset=CustomUser.objects.all())
#     class Meta:
#         model =Applicant
#         fields = '__all__'


class ApplicantSerializer(serializers.ModelSerializer):
    sheha = serializers.SlugRelatedField(slug_field='name',queryset=Sheha.objects.all())
    class Meta:
        model = Applicant
        fields = '__all__'

class BusinessSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.name', read_only=True)

    class Meta:
        model = Business
        fields = '__all__'

class ShehaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sheha
        fields = '__all__'

class LoanOfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanOfficer
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)
    loan_officer_name = serializers.CharField(source='loan_officer.name', read_only=True)

    class Meta:
        model = Loan
        fields = ['Loan_ID', 'amount', 'duration', 'status', 'application_date', 'approval_date', 'business', 'business_name', 'loan_officer', 'loan_officer_name']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

class RepaymentSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = Repayment
        fields = ['Repayment_ID', 'amount', 'time', 'day', 'date', 'business', 'business_name']