from bank_app.models import MockBankLoan
from empowerment_app.models import Business

def perform_bank_verification(applicant):
    try:
        business = Business.objects.get(applicant=applicant)
        bank_no = business.bank_no

        loan = MockBankLoan.objects.using('bankdb').filter(
            bank_no=bank_no,
            has_active_loan=True
        ).first()

        if loan:
            applicant.is_verified_by_bank = False
            applicant.bank_status = 'rejected'
        else:
            applicant.is_verified_by_bank = True
            applicant.bank_status = 'verified'

    except Business.DoesNotExist:
        applicant.is_verified_by_bank = False
        applicant.bank_status = 'no business found'

    applicant.save(update_fields=["is_verified_by_bank", "bank_status"])
    return applicant.bank_status
