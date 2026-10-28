from django.db import models
import uuid
from cars.models import Car
from accounts.models import Users, __str__
# Create your models here.
class Booking(models.Model):
    class Action(models.TextChoices):
        BOOKING = 'Booking','booking'
        INQUIRY = 'INQUIRY','Inquiry'
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ]
    
    
        

    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    carid = models.ForeignKey(Car,related_name='carfields',on_delete=models.CASCADE , 
                              null=True,blank=True)
    userid = models.ForeignKey(Users , related_name='usersfields', on_delete=models.CASCADE,null=True,blank=True)
    customername = models.CharField(max_length=50)
    customeremail = models.EmailField()
    contactno= models.IntegerField()
    location = models.CharField(max_length=25,blank=True)
    Actions = models.CharField(max_length=25,choices=Action.choices , default=Action.INQUIRY)
    status = models.CharField(max_length=45,choices=STATUS_CHOICES,default='pending')
    price_at_request = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)
    created_At =models.DateTimeField(auto_now_add=True)
    updated_At = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.customername



class Notification(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name='notificationsuser'
        ,null=True,blank=True
    )

    requests = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='notifications',null=True,blank=True
    )

    message = models.TextField()
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

