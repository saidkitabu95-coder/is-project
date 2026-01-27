from django.contrib import admin

# Register your models here.
from .models import Login, Store, Sales
admin.site.register(Login)
admin.site.register(Store)
admin.site.register(Sales)