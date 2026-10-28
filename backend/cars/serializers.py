from django.forms import fields
from rest_framework import serializers
from cars.models import Car, CarImage

class CarImageserializer(serializers.ModelSerializer):
    class Meta:
        model=CarImage
        fields ='__all__'

class Carserializer(serializers.ModelSerializer):
    carsimages = CarImageserializer(read_only=True,many=True)
    images = serializers.ListField(child =serializers.ImageField(),write_only=True,required=False)
    keep_images_ids = serializers.ListField(child=serializers.IntegerField(),required=False,
        write_only=True)
    class Meta:
        model=Car
        fields = '__all__'
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        car = Car.objects.create(**validated_data)
        for image_data in images_data:
            CarImage.objects.create(car=car, images=image_data)
        return car
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images',None)
        keep_images_ids = validated_data.pop('keep_images_ids', None)
        
        for attr,value in validated_data.items():
            setattr(instance,attr,value)
        instance.save()
        if keep_images_ids is not None:
            CarImage.objects.filter(car=instance).exclude(
                id__in=keep_images_ids
            ).delete()

        if images_data:
            for image in images_data:
                CarImage.objects.create(
                    car=instance,
                    images=image
                )
        return instance
        