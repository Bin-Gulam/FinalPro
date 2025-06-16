# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Applicant, Business, MockBankLoan

# @receiver(post_save, sender=Applicant)
# def auto_verify_bank_when_sheha_verified(sender, instance, **kwargs):
#     if instance.is_verified_by_sheha and not instance.is_verified_by_bank:
#         try:
#             business = Business.objects.get(applicant=instance)
#             bank_no = business.bank_no

#             # Angalia kama bank_no ipo kwenye mock bank na haina mkopo
#             if MockBankLoan.objects.filter(bank_no=bank_no, has_active_loan=False).exists():
#                 instance.is_verified_by_bank = True
#                 instance.bank_status = 'verified'
#                 instance.save(update_fields=['is_verified_by_bank', 'bank_status'])
#         except Business.DoesNotExist:
#             # Hakuna business iliyosajiliwa kwa applicant huyu
#             pass
