from xml.etree.ElementInclude import include
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet
from .views import StoreViewSet
from .views import SalesViewSet


router = DefaultRouter()
router.register('login', LoginViewSet)
router.register('store', StoreViewSet)
router.register('sales', SalesViewSet)

urlpatterns =  router.urls
    
    #path('login/', login),
   # path('store/', Store),
  #  path('sales/', Sales),
#]
