from django.contrib import admin

# Register your models here.
from .models import Payment, Sales, Store

admin.site.register(Store)
admin.site.register(Sales)
admin.site.register(Payment)








