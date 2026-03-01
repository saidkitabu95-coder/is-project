from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone


class Store(models.Model):
    name = models.CharField(
        max_length=100,
        help_text="Name of the pharmacy store"
    )
    location = models.CharField(
        max_length=255,
        help_text="Physical location/address of the store"
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="stores",
        null=True,
        blank=True,
    )
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Store"
        verbose_name_plural = "Stores"
        ordering = ['-id']


class Sales(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="sales")
    medicine = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    date = models.DateTimeField(default=timezone.now, help_text="Date when the sale was created")
    approved = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.total = (Decimal(self.quantity) * self.price).quantize(Decimal("0.01"))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Sales {self.id}"

    class Meta:
        verbose_name = "Sale"
        verbose_name_plural = "Sales"
        ordering = ['-date']


class Payment(models.Model):
    METHOD_CHOICES = (
        ("cash", "Cash"),
        ("card", "Card"),
        ("transfer", "Transfer"),
    )

    sale = models.ForeignKey(Sales, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50, choices=METHOD_CHOICES, default="cash")
    date = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment {self.id}"


class LoginActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    username = models.CharField(max_length=150)
    logged_in_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.logged_in_at}"
