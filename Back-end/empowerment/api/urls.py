from django.urls import path, include
from rest_framework.routers import DefaultRouter
from empowerment_app.views import *
from empowerment_app.view_auth import *
from empowerment_app.view_auth import UserViewSet  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'applicants', ApplicantViewSet, basename='applicant')
router.register(r'businesses', BusinessViewSet)
router.register(r'shehas', ShehaViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'loan-officers', LoanOfficerViewSet)
router.register(r'repayments', RepaymentViewSet) 
router.register(r'notifications', NotificationViewSet, basename='notications')
router.register(r'users', UserViewSet, basename='user')
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'loan-applications', LoanApplicationViewSet, basename='loan-application')
router.register(r'loan-types', LoanTypeViewSet, basename='loan-type')

urlpatterns = [
    path('', include(router.urls)),  

    # Auth endpoints (login/register)
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('register/', RegisterView.as_view(), name='register'),
    
    
] 
