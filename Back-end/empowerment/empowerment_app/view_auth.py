from empowerment_app.serializer import *
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken



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


# class ForgotPasswordView(generics.GenericAPIView):
#     serializer_class = ForgotPasswordSerializer
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         # handle forgot password
#         pass