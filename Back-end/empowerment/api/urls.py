from django.urls import path, include
from rest_framework.routers import DefaultRouter
from empowerment_app.views import *
from empowerment_app.views import NotificationViewSet
from empowerment_app.view_auth import *
from empowerment_app.view_auth import UserViewSet  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'applicants', ApplicantViewSet)
router.register(r'businesses', BusinessViewSet)
router.register(r'shehas', ShehaViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'loan-officers', LoanOfficerViewSet)
router.register(r'repayments', RepaymentViewSet)
router.register(r'users', UserViewSet)  
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),  

    # Auth endpoints (login/register)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('register/', RegisterView.as_view(), name='register'),
    
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
