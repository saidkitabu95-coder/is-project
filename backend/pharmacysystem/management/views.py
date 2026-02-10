from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Sale, Store
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .models import Store,Payment,Sale
from .serializers import StoreSerializer,SaleSerializer,PaymentSerializer



#from rest_framework.decorators import *
#from rest_framework.response import Response
#from django.contrib.auth import authenticate, login
#from .models import Store,Sales,login
#from .serializers import StoreSerializer,SaleSerializer
#from rest_framework import viewsets
#from .serializers import loginSerializer



# Login API
#@api_view(['POST'])
#def login(request):
 #   username = request.data.get("username")
  #  password = request.data.get("password")
   # user = authenticate(username=username, password=password)
    #if user:
     #   login(request, user)
      #  return Response({"status": "success", "message": "Login successful", "username": user.username})
    #else:
     #   return Response({"status": "error", "message": "Invalid credentials"}, status=401)

# Store API
#@api_view(['GET'])
#def Store(request):
 #   stores = Store.objects.all()
  #  serializer = StoreSerializer(stores, many=True)
   # return Response(serializer.data)


# Sales API
#@api_view(['GET'])
#def Sales(request):
 #   sales = Sales.objects.all()
  #  serializer = SaleSerializer(sales, many=True)
   # return Response(serializer.data)

# Create your views here.
#class LoginViewSet(viewsets.ModelViewSet):
 #   queryset = Login.objects.all()
  #  serializer_class = LoginSerializer
  
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        User.objects.create_user(username=username, password=password)

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        User = authenticate(username=username, password=password)

        if not User:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        
        refresh = RefreshToken.for_user(User)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": User.username
        })



class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

class SaleViewSet(ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        store = serializer.validated_data["store"]
        quantity = serializer.validated_data["quantity"]

        if store.quantity < quantity:
            raise ValidationError("Not enough stock available")

        
        store.quantity -= quantity
        store.save()

        total_price = store.price * quantity

        serializer.save(
            sold_by=self.request.user,
            total_price=total_price
        )


class PaymentViewSet(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        sale = serializer.validated_data["sale"]

        if Payment.objects.filter(sale=sale).exists():
            raise ValidationError("This sale is already paid")

        serializer.save(received_by=self.request.user)
