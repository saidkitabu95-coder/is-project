from rest_framework import serializers
from .models import  Store, Sale, Payment



class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields =  '__all__'
        
from rest_framework import serializers
from .models import Sale

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = "__all__"
        read_only_fields = ["total_price", "sold_by"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ["received_by"]
