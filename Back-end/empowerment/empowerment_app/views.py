from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from empowerment_app.serializer import RegisterSerializer, UserSerializer

#  forgot
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ====================================
#  Login, Log out and resert password
# ====================================

#  Login

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({'message': 'Login successful', 'user': serializer.data})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#  Log out

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

#  Resert Password

@api_view(['POST'])
def reset_password(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    password = request.data.get('password')
    try:
        user = User.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({'message': 'Password reset successfully'})
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
    

#  Forgot Password

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # For now, just return a dummy response to test
    return Response({'message': 'Reset link sent if email exists'})