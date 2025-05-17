from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from empowerment_app.models import *
from .models import Applicant, Loan

# Register custom user and other models
admin.site.register(CustomUser, UserAdmin)
@admin.register(Sheha)
class ShehaAdmin(admin.ModelAdmin):
    list_display = ('Sheha_ID', 'name', 'age', 'gender', 'phone', 'ward')
    search_fields = ('name', 'ward', 'phone')

@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    list_display = (
        'Applicant_ID', 'name', 'age', 'gender', 'marital_status',
        'phone', 'region', 'district', 'ward', 'village'
    )
    search_fields = ('name', 'region', 'district', 'phone')
    list_filter = ('gender', 'marital_status', 'region', 'district')

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    autocomplete_fields = ('applicant',) 
    list_display = ('Business_ID', 'name', 'bank_no', 'location', 'type', 'applicant')
    search_fields = ('name', 'bank_no', 'location')
    list_filter = ('type',)

@admin.register(LoanOfficer)
class LoanOfficerAdmin(admin.ModelAdmin):
    list_display = ('L_Officer_ID', 'name', 'gender', 'age', 'office', 'email', 'phone')
    search_fields = ('name', 'office', 'email', 'phone')

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('Loan_ID', 'amount', 'duration', 'status', 'application_date', 'approval_date', 'business', 'loan_officer')
    search_fields = ('status',)
    list_filter = ('status', 'application_date', 'approval_date')

@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = ('Repayment_ID', 'amount', 'time', 'day', 'date', 'business')
    search_fields = ('day',)
    list_filter = ('date', 'day')
