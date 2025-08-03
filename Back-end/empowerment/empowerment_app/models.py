from django.db import models
from django.contrib.auth.models import *
from django.core.validators import RegexValidator
from women_youth_empowerment import settings
from django.contrib.gis.db import models as geomodels

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
    email = models.EmailField(unique=False) 

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
    passport_size = models.ImageField(upload_to='passport_photos/')
    passport_size = models.ImageField(upload_to='passport_photos/', blank=True, null=True)
    sheha = models.ForeignKey(Sheha, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_verified_by_sheha = models.BooleanField(default=False)
    is_verified_by_bank = models.BooleanField(default=False)
    bank_status = models.CharField(default='pending', max_length=20)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Business(models.Model):
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    location = geomodels.PointField(geography=True, null=True, blank=True)
    type = models.CharField(max_length=50)
    anual_income = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    bank_no = models.CharField(max_length=20, )


    class Meta:
        unique_together = ('applicant', 'bank_no')
    def __str__(self):
        return self.name

class LoanOfficer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
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


    # =======LOANS=========
class LoanType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2) 
    

    def __str__(self):
        return f"{self.name} (Max: {self.max_amount})"

class LoanApplication(models.Model):
    loan_type = models.ForeignKey(LoanType, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    purpose = models.TextField()
    repayment_period = models.PositiveIntegerField()
    who_are_your_customers = models.CharField(max_length=255, null=True, blank=True)
    current_customers = models.PositiveIntegerField(null=True, blank=True)
    new_customers_per_month = models.PositiveIntegerField(null=True, blank=True)
    monthly_sales = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    monthly_expenses = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    plan_attachment = models.FileField(upload_to='plans/', blank=True, null=True)
    
    # Review fields
    score = models.IntegerField(default=0, blank=True)
    decision = models.CharField(max_length=20, choices=[
        ('approved', 'Approved'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected')
    ], default='pending')
    system_comment = models.TextField(blank=True, null=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL,null=True,blank=True,on_delete=models.SET_NULL,related_name='reviewed_loans')
    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

class LoanExpenseItem(models.Model):
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='expenses')
    item = models.CharField(max_length=100)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
