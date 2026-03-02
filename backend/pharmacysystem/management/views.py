from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import LoginActivity, Payment, Sales, Store
from .serializers import LoginActivitySerializer, PaymentSerializer, SalesSerializer, StoreSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        username = (request.data.get("username") or request.data.get("name") or "").strip()
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password") or request.data.get("confirmPassword")

        if not password:
            return Response(
                {"error": "password is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Allow frontend that sends email without username by deriving a username.
        if not username and email:
            base_username = email.split("@", 1)[0][:150] or "user"
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                candidate = f"{base_username}{suffix}"
                username = candidate[:150]
                suffix += 1

        if not email or not username:
            return Response(
                {"error": "email and username are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if confirm_password and password != confirm_password:
            return Response(
                {"error": "Password and confirmation do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
            )
            return Response(
                {
                    "message": "User registered successfully",
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        email = (request.data.get("email") or "").strip()
        password = request.data.get("password")

        if not password or (not username and not email):
            return Response(
                {"error": "username/email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login_username = username
        if not login_username and email:
            user_by_email = User.objects.filter(email__iexact=email).first()
            if user_by_email:
                login_username = user_by_email.username

        user = authenticate(request, username=login_username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        LoginActivity.objects.create(user=user, username=user.username)

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh_token = str(refresh)
        is_admin = bool(user.is_staff or user.is_superuser or user.username.lower() == "admin")

        return Response(
            {
                "access": access,
                "refresh": refresh_token,
                # Compatibility aliases for different frontend key names.
                "access_token": access,
                "refresh_token": refresh_token,
                "token": access,
                "username": user.username,
                "email": user.email,
                "is_admin": is_admin,
            },
            status=status.HTTP_200_OK,
        )


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.select_related("owner").all().order_by("-id")
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]


class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sales.objects.select_related("store").all().order_by("-id")
    serializer_class = SalesSerializer
    permission_classes = [permissions.IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("sale").all().order_by("-date", "-id")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


class LoginActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoginActivity.objects.select_related("user").all().order_by("-logged_in_at", "-id")
    serializer_class = LoginActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
