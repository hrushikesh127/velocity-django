from rest_framework.fields import Field
from django.forms import fields
from rest_framework import serializers
from accounts.models import Users
class Usersserializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model=Users
        fields = '__all__'
    def create(self, validated_data):
        return Users.objects.create_user(**validated_data)