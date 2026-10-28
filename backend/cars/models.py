from django.db import models

# Create your models here.
class Car(models.Model):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    year = models.IntegerField()
    tag = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    power = models.CharField(max_length=50)
    accel = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=50)
    owner_name = models.CharField(max_length=100)
    owner_contact = models.CharField(max_length=20)
    description = models.TextField()
    is_sold = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class CarImage(models.Model):
    car = models.ForeignKey(Car , on_delete=models.CASCADE , related_name='carsimages' , blank=True,null=True)
    images = models.ImageField(upload_to='cars/',blank=True,null=True)
