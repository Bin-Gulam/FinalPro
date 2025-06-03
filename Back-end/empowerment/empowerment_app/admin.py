from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from empowerment_app.models import *
from empowerment_app.models import CustomUser as User
from .models import Applicant, Loan
from django.utils.html import format_html

# Register custom user and other models
admin.site.register(CustomUser, UserAdmin)

class ShehaAdminForm(forms.ModelForm):
    username = forms.CharField(label="Username")
    email = forms.EmailField(label="Email")
    password = forms.CharField(label="Password", widget=forms.PasswordInput)

    class Meta:
        model = Sheha
        fields = ['name', 'age', 'gender', 'phone', 'ward', 'username', 'email', 'password']

    def save(self, commit=True):
        # Create user object
        user = CustomUser(
            username=self.cleaned_data['username'],
            email=self.cleaned_data['email'],
        )
        user.set_password(self.cleaned_data['password'])
        user.save()

        # Create Sheha instance
        sheha = super().save(commit=False)
        sheha.user = user
        if commit:
            sheha.save()
        return sheha

@admin.register(Sheha)
class ShehaAdmin(admin.ModelAdmin):
    form = ShehaAdminForm
    list_display = ('id', 'name', 'ward', 'phone', 'gender', 'get_username', 'get_email')
    search_fields = ('name', 'ward', 'phone', 'user__username')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'name', 'age', 'gender', 'marital_status',
        'phone', 'region', 'district', 'ward', 'village'
    )
    search_fields = ('name', 'region', 'district', 'phone')
    list_filter = ('gender', 'marital_status', 'region', 'district')

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    autocomplete_fields = ('applicant',) 
    list_display = ('id', 'name', 'bank_no', 'location', 'type', 'applicant')
    search_fields = ('name', 'bank_no', 'location')
    list_filter = ('type',)

@admin.register(LoanOfficer)
class LoanOfficerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'gender', 'age', 'office', 'email', 'phone')
    search_fields = ('name', 'office', 'email', 'phone')

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('id', 'amount', 'duration', 'status', 'application_date', 'approval_date', 'business', 'loan_officer')
    search_fields = ('status',)
    list_filter = ('status', 'application_date', 'approval_date')

@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'amount', 'time', 'day', 'date', 'business')
    search_fields = ('day',)
    list_filter = ('date', 'day')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('name', 'village', 'sheha', 'applicant', 'is_read', 'is_verified_by_sheha', 'created_at', 'image_tag')
    list_filter = ('is_read', 'is_verified_by_sheha', 'sheha__ward')  # Filtering options
    search_fields = ('name', 'village', 'sheha__user__username', 'applicant__name')  # Searchable fields
    readonly_fields = ('image_tag', 'created_at')

    def image_tag(self, obj):
        if obj.passport_size:
            return format_html('<img src="{}" width="100" height="100" style="object-fit:cover;" />', obj.passport_size.url)
        return "-"
    image_tag.short_description = 'Passport Photo'
