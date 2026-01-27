from django.shortcuts import render

from rest_framework import viewsets
from .models import Store,Sales,Login
from .serializers import LoginSerializer,StoreSerializer,SaleSerializer
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
class LoginViewSet(viewsets.ModelViewSet):
    queryset = Login.objects.all()
    serializer_class = LoginSerializer

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sales.objects.all()
    serializer_class = SaleSerializer
       
