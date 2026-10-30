from rest_framework.fields import Field
from django.forms import fields
from rest_framework import serializers
from accounts.models import Users
class Usersserializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model=Users
        fields = '__all__'
    def create(self, validated_data):
        return Users.objects.create_user(**validated_data)
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class forgotpasswordserializer(serializers.Serializer):
    email = serializers.EmailField()


class Resetpassworfserializer(serializers.Serializer):
    newpassword = serializers.CharField(min_length=4 ,write_only =True)
    uid64 = serializers.CharField(max_length=150,write_only=True)
    token = serializers.CharField(max_length=150 ,write_only=True )
