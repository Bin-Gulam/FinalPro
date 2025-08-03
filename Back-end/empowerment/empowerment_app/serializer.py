from decimal import Decimal
from rest_framework import serializers
from .models import *
from .models import CustomUser
from django.contrib.gis.geos import Point
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
        fields = '__all__'  
        read_only_fields = ['user','sheha'] 

        extra_kwargs = {
            'sheha': {'required': False, 'allow_null': True},
            'passport_photo': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

# class BusinessSerializer(serializers.ModelSerializer):
#     applicant_name = serializers.CharField(source='applicant.name', read_only=True)

#     class Meta:
#         model = Business
       
#         exclude = ['applicant']

#     def create(self, validated_data):
#         user = self.context['request'].user
#         applicant = Applicant.objects.filter(user=user).first()
#         if not applicant:
#             raise serializers.ValidationError("No applicant related to the current user.")
#         validated_data['applicant'] = applicant
#         return super().create(validated_data)

#     def validate_bank_no(self, value):
#         user = self.context['request'].user
#         applicant = Applicant.objects.filter(user=user).first()
#         if not applicant:
#             raise serializers.ValidationError("Applicant profile not found.")

#         # Check uniqueness per applicant
#         if self.instance is None or self.instance.bank_no != value:
#             if Business.objects.filter(applicant=applicant, bank_no=value).exists():
#                 raise serializers.ValidationError("You have already registered a business with this bank number.")
#         return value

from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry, Point
from .models import Business, Applicant

class BusinessSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.name', read_only=True)

    # Allow frontend to send latitude/longitude or a POINT string
    latitude = serializers.FloatField(write_only=True, required=False)
    longitude = serializers.FloatField(write_only=True, required=False)
    location = serializers.CharField(required=False)

    class Meta:
        model = Business
        exclude = ['applicant']
        extra_kwargs = {
            'location': {'read_only': True},  # prevent direct overwrite unless processed
        }

    def validate(self, data):
        lat = data.pop('latitude', None)
        lng = data.pop('longitude', None)
        point_str = data.get('location', None)

        # Handle location via lat/lng
        if lat is not None and lng is not None:
            data['location'] = Point(lng, lat)
        elif point_str and isinstance(point_str, str) and point_str.startswith("POINT"):
            try:
                data['location'] = GEOSGeometry(point_str)
            except Exception:
                raise serializers.ValidationError({"location": "Invalid POINT format."})
        else:
            raise serializers.ValidationError({
                "location": "You must provide either latitude & longitude or a valid POINT string."
            })

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        applicant = Applicant.objects.filter(user=user).first()
        if not applicant:
            raise serializers.ValidationError("No applicant profile linked to current user.")
        validated_data['applicant'] = applicant
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Allow updates to location
        if 'latitude' in self.initial_data and 'longitude' in self.initial_data:
            try:
                lat = float(self.initial_data.get('latitude'))
                lng = float(self.initial_data.get('longitude'))
                validated_data['location'] = Point(lng, lat)
            except Exception:
                raise serializers.ValidationError({"location": "Invalid lat/lng values."})
        elif 'location' in self.initial_data and self.initial_data['location'].startswith("POINT"):
            try:
                validated_data['location'] = GEOSGeometry(self.initial_data['location'])
            except Exception:
                raise serializers.ValidationError({"location": "Invalid POINT format."})
        return super().update(instance, validated_data)

    def validate_bank_no(self, value):
        user = self.context['request'].user
        applicant = Applicant.objects.filter(user=user).first()
        if not applicant:
            raise serializers.ValidationError("Applicant profile not found.")

        if self.instance is None or self.instance.bank_no != value:
            if Business.objects.filter(applicant=applicant, bank_no=value).exists():
                raise serializers.ValidationError("You have already registered a business with this bank number.")
        return value


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
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = LoanOfficer
        fields = ['id', 'name', 'gender', 'age', 'office', 'phone',
                  'username', 'password', 'email']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email')

        # Create user
        user = User.objects.create_user(username=username, password=password, email=email)

        # Create LoanOfficer linked to the user
        loan_officer = LoanOfficer.objects.create(user=user, **validated_data)

        return loan_officer

    def update(self, instance, validated_data):
        # If updating LoanOfficer info, update related user too
        user = instance.user
        user.email = validated_data.pop('email', user.email)
        user.username = validated_data.pop('username', user.username)
        password = validated_data.pop('password', None)
        if password:
            user.set_password(password)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

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




# =====LOANS===========

class LoanTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanType
        fields = ['id', 'name', 'description', 'max_amount']


class LoanExpenseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanExpenseItem
        exclude = ['loan_application'] 

class LoanApplicationSerializer(serializers.ModelSerializer):
    expenses = LoanExpenseItemSerializer(many=True)

    applicant = ApplicantSerializer(read_only=True)
    business = BusinessSerializer(read_only=True)
    loan_type_name = serializers.CharField(source='loan_type.name', read_only=True)
    ward = serializers.CharField(source='applicant.ward', read_only=True)
    sheha_name = serializers.CharField(source='applicant.sheha.name', read_only=True)
    applicant_name = serializers.CharField(source='applicant.name', read_only=True)
    business_name = serializers.CharField(source='business.business_name', read_only=True)

    class Meta:
        model = LoanApplication
        fields = '__all__'
        read_only_fields = ['applicant']

    def validate(self, data):
        business = data.get('business')
        requested = data.get('amount_requested')

        if business and requested:
            max_allowed = business.anual_income * Decimal('0.7')
            if requested > max_allowed:
                raise serializers.ValidationError({
                    'amount_requested': f"Requested amount exceeds 70% of business income ({max_allowed})."
                })
        return data
    def create(self, validated_data):
        request = self.context['request']
        user = request.user
        
        # 🔍 Find the applicant for the current user
        applicant = Applicant.objects.filter(user=user).first()
        if not applicant:
            raise serializers.ValidationError("Hakuna profaili ya mwombaji inayohusishwa na mtumiaji huyu.")
        
        # 🔍 Find the business for this applicant
        business = Business.objects.filter(applicant=applicant).first()
        if not business:
            raise serializers.ValidationError("Hakuna biashara iliyosajiliwa kwa mwombaji huyu.")
        validated_data['applicant'] = applicant
        validated_data['business'] = business
        
        expenses_data = validated_data.pop('expenses', [])
        application = LoanApplication.objects.create(**validated_data)
        for exp in expenses_data:
            LoanExpenseItem.objects.create(loan_application=application, **exp)
            return application
