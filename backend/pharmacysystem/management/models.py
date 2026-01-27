from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Login(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.username
    
class Store(models.Model):
    store_id = models.IntegerField()
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Sales(models.Model):
    sales_id = models.IntegerField()
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    date = models.DateField()
    total_amount = models.IntegerField()
    payment_method = models.CharField(max_length=50)
    def __str__(self):
        return str(self.sales_id)
