from django.db import models
from django.contrib.auth.models import *
from django.core.validators import RegexValidator
from women_youth_empowerment import settings



# Custom user model extending AbstractUser
class CustomUser(AbstractUser):
    name = models.CharField(max_length=100)  
    email = models.EmailField(unique=False)  

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.username  



# Phone validator
phone_validator = RegexValidator(regex=r'^\+?\d{10,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

class Sheha(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(validators=[phone_validator], max_length=15)
    ward = models.CharField(max_length=100, unique=True)
    email = models.EmailField() 

    def __str__(self):
        return self.name


class Applicant(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    marital_status = models.CharField(max_length=20)
    region = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    village = models.CharField(max_length=100)
    phone = models.CharField(validators=[phone_validator], max_length=15)
    passport_size = models.ImageField(upload_to='passport_photos/', blank=True, null=True)
    sheha = models.ForeignKey(Sheha, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return self.name


class Business(models.Model):
    name = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    income = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    bank_no = models.CharField(max_length=50)
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    declaration_accepted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    @property
    def applicant_declaration(self):
        return f"""
        Mimi, {self.applicant.name}, ninathibitisha kwamba maelezo niliyotoa hapo juu ni sahihi na kamili.
        Iwapo itagundulika kwamba nimetoa taarifa za uongo kwa makusudi, niko tayari kuondolewa kwenye mchakato 
        wa kupata mkopo huu na kuchukuliwa hatua za kisheria ikihitajika.
        """

class LoanOfficer(models.Model):
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    age = models.PositiveIntegerField()
    office = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(validators=[phone_validator], max_length=15)

    def __str__(self):
        return self.name


class Loan(models.Model):
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    duration = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    application_date = models.DateField()
    approval_date = models.DateField()
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    loan_officer = models.ForeignKey(LoanOfficer, on_delete=models.CASCADE)

    def __str__(self):
        return f"Loan {self.Loan_ID} - {self.status}"


class Repayment(models.Model):
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    time = models.CharField(max_length=50)
    day = models.CharField(max_length=20)
    date = models.DateField()
    business = models.ForeignKey(Business, on_delete=models.CASCADE)

    def __str__(self):
        return f"Repayment {self.Repayment_ID}"
    
# ==================
# Sheha Notification
# ==================
class Notification(models.Model):
     STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
     sheha = models.ForeignKey(Sheha, on_delete=models.CASCADE)
     applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
     name = models.CharField(max_length=100)
     village = models.CharField(max_length=100)
     passport_size = models.ImageField(upload_to='notification_passports/')
     is_read = models.BooleanField(default=False)
     is_verified_by_sheha = models.BooleanField(default=False)
     created_at = models.DateTimeField(auto_now_add=True)
    

# ==============
# BankMockLoan
# ==============
class MockBankLoan(models.Model):
    bank_account_no = models.CharField(max_length=20, unique=True)
    applicant_name = models.CharField(max_length=100)
    has_loan = models.BooleanField(default=False)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    loan_status = models.CharField(max_length=20, default="N/A")  # e.g., Active, Defaulted
    balance_remaining = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_payment_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.applicant_name


   
    
    
    


   



