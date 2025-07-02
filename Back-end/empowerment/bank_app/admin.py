from django.contrib import admin
from .models import MockBankLoan

class MockBankLoanAdmin(admin.ModelAdmin):
    list_display = ['bank_no', 'applicant_name', 'loan_amount', 'has_active_loan']

    def get_queryset(self, request):
        # Force the admin to use the 'bankdb' database for this model
        return super().get_queryset(request).using('bankdb')

    def save_model(self, request, obj, form, change):
        obj.save(using='bankdb')

    def delete_model(self, request, obj):
        obj.delete(using='bankdb')

admin.site.register(MockBankLoan, MockBankLoanAdmin)
