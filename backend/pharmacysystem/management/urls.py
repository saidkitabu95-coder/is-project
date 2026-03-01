from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginAPIView, LoginActivityViewSet, PaymentViewSet, RegisterView, SalesViewSet, StoreViewSet


router = DefaultRouter()
router.register("store", StoreViewSet, basename="store")
router.register("sales", SalesViewSet, basename="sales")
router.register("sale", SalesViewSet, basename="sale")
router.register("payment", PaymentViewSet, basename="payment")
router.register("login-activity", LoginActivityViewSet, basename="login-activity")


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
] + router.urls
