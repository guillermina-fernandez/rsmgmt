from django.db import models
from common.validators import validate_cuit

# Create your models here.


class Owner(models.Model):
    last_name = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    cuit = models.CharField(max_length=13, validators=[validate_cuit], unique=True)

    class Meta:
        ordering = ('last_name', 'first_name')

    def __str__(self):
        return f'{self.last_name} {self.first_name}'

