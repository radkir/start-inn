from app.models import Registr
from rest_framework import serializers

class RegistrSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registr
        fields = ('id', 'fam', 'im', 'otch', 'city', 'street')