from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MockBankLoanViewSet

router = DefaultRouter()
router.register('bank-loans', MockBankLoanViewSet)

urlpatterns = [
    path('', include(router.urls)),

]
