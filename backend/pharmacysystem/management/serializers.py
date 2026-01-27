from rest_framework import serializers
from .models import Login, Store, Sales

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields =  '__all__'
class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields =  '__all__'
        
class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales
        fields = '__all__'