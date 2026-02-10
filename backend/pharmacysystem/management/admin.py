from django.contrib import admin

# Register your models here.
from .models import  Store, Sale, Payment

admin.site.register(Store)
admin.site.register(Sale)
admin.site.register(Payment)








