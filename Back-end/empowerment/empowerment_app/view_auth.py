from empowerment_app.serializer import *
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action





class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserCreateSerializer

    def get_permissions(self):
        if self.action == 'create':
            # Allow anyone to register
            return [permissions.AllowAny()]
        else:
            # Only admin can list, update, or delete users
            return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        # Validate the data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create user with the validated data
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=request.data.get('password'),  # Password is taken from the raw request
            name=serializer.validated_data.get('name', '')  # Optional name field
        )

        # Generate JWT tokens (refresh and access)
        refresh = RefreshToken.for_user(user)

        # Return a response with user data and tokens
        return Response({
            'message': 'User registered successfully',
            'user': CustomUserCreateSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        refresh_token = request.data.get('refresh')
        print("Received refresh token:", refresh_token)  # DEBUG
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # blacklist the refresh token
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Logout error:", e)
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

# class ForgotPasswordView(generics.GenericAPIView):
#     serializer_class = ForgotPasswordSerializer
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         # handle forgot password
#         pass