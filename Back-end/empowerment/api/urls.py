from django.urls import path
from empowerment_app.views import forgot_password, login_view, logout_view, RegisterView, reset_password


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/', reset_password, name='reset-password'),
]