from django.db import models

class MockBankLoan(models.Model):
    bank_no = models.CharField(max_length=20)
    applicant_name = models.CharField(max_length=100)
    has_active_loan = models.BooleanField(default=False)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    loan_status = models.CharField(max_length=20, default="N/A")
    balance_remaining = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_payment_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.applicant_name

    class Meta:
        app_label = 'bank_app'

