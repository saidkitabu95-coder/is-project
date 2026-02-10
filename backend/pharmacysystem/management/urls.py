from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import RegisterView
from .views import  LoginAPIView
from .views import StoreViewSet
from .views import SaleViewSet
from .views import PaymentViewSet



router = DefaultRouter()
router.register("store", StoreViewSet, basename="store")
router.register("sale", SaleViewSet, basename="sales")
router.register("payment", PaymentViewSet, basename="payment")






urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("api/store/", StoreViewSet.as_view({"get": "list"}), name="store-list"),
    path("api/sale/", SaleViewSet.as_view({"get": "list"}), name="sales-list"),
    path("api/payment/", PaymentViewSet.as_view({"get": "list"}), name="payment-list"),
] + router.urls




    
    #path('login/', login),
   # path('store/', Store),
  #  path('sales/', Sales),
#]
