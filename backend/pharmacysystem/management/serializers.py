from rest_framework import serializers
from .models import LoginActivity, Payment, Sales, Store


class StoreSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Store
        fields = ["id", "name", "location", "owner", "owner_username", "approved"]


class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales
        fields = ["id", "store", "medicine", "quantity", "price", "total", "date", "approved"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "sale", "amount", "method", "date", "approved"]


class LoginActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginActivity
        fields = "__all__"
