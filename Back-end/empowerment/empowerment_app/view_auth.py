from empowerment_app.serializer import *
from empowerment_app.models import CustomUser, Applicant, Sheha, LoanOfficer

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate


# ✅ User Registration View
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserCreateSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = CustomUser.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=request.data.get('password'),
            name=serializer.validated_data.get('name', ''),
        )

        # Explicitly set is_staff and is_superuser to False to avoid accidental admin role
        user.is_staff = False
        user.is_superuser = False
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'User registered successfully',
            'user': CustomUserCreateSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


# ✅ Logout View
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        refresh_token = request.data.get('refresh')
        print("Received refresh token:", refresh_token)
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Logout error:", e)
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

def get_user_role(user):
    if Sheha.objects.filter(user=user).exists():
        return 'sheha'
    elif LoanOfficer.objects.filter(user=user).exists():
        return 'loan_officer'
    elif user.is_staff or user.is_superuser:
        return 'admin'
    else:
        return 'user'

class CustomLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        role = get_user_role(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'name': user.name,
                'email': user.email,
                'role': role,
            }
        }, status=status.HTTP_200_OK)