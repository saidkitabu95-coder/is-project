from django.db import models



# Create your models here.


class Store(models.Model):
    name = models.CharField(max_length=100)
    store_id = models.IntegerField()
    

    def __str__(self):
        return self.name



    



class Sale(models.Model):
    store_item = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity_sold = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    sold_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale {self.id}"   





class Payment(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id}"






