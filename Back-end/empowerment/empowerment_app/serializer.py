from rest_framework import serializers
from .models import *
from .models import CustomUser
from empowerment_app.models import CustomUser as User

# ================
# User serializer
# ================

class CustomUserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


# class ApplicantSerializer(serializers.ModelSerializer):
#     user = serializers.SlugRelatedField(slug_field='username',queryset=CustomUser.objects.all())
#     class Meta:
#         model =Applicant
#         fields = '__all__'


class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = '__all__'  # or list fields explicitly except 'user'
        read_only_fields = ['user', 'sheha'] 

        extra_kwargs = {
            'sheha': {'required': False, 'allow_null': True},
            'passport_photo': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)



class BusinessSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.name', read_only=True)

    class Meta:
        model = Business
        fields = '__all__'
        extra_kwargs = {
            'applicant': {'required': False}
        }

    def create(self, validated_data):
        applicant = self.context['request'].user.applicant_set.first()
        if not applicant:
            raise serializers.ValidationError("No applicant related to user.")
        validated_data['applicant'] = applicant
        return super().create(validated_data)



class ShehaCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Sheha
        fields = ['id', 'name', 'age', 'gender', 'phone', 'ward', 'username', 'email', 'password']

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = CustomUser.objects.create_user(username=username, email=email, password=password)
        sheha = Sheha.objects.create(user=user, **validated_data)
        return sheha

    def update(self, instance, validated_data):
        # Update user fields if provided
        user = instance.user
        username = validated_data.pop('username', None)
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)

        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        # Update Sheha model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class LoanOfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanOfficer
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)
    loan_officer_name = serializers.CharField(source='loan_officer.name', read_only=True)

    class Meta:
        model = Loan
        fields = '__all__'

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

class RepaymentSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = Repayment
        fields = '__all__'


# ===================
# Sheha Notification
# ===================

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'sheha', 'applicant', 'name', 'village', 'passport_size', 'is_read', 'is_verified_by_sheha', 'created_at']

# =========
# BankMock
# =========
class MockBankLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockBankLoan
        fields = '__all__'
