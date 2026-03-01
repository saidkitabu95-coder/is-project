from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("management", "0008_alter_sales_options_alter_store_options_sales_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="store",
            name="approved",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="sales",
            name="approved",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="payment",
            name="approved",
            field=models.BooleanField(default=False),
        ),
    ]
