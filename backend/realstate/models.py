from django.db import models
from parameters.models import RealStateType, Owner

# Create your models here.


class RealState(models.Model):
    address = models.CharField(max_length=50)
    floor = models.IntegerField(blank=True, null=True)
    unit = models.IntegerField(blank=True, null=True)
    rs_type = models.ForeignKey(RealStateType, related_name='rs_rs_type', on_delete=models.RESTRICT)
    has_garage = models.CharField(max_length=2, default='NO')
    owner = models.ManyToManyField(Owner, related_name='rs_owner')
    usufruct = models.ManyToManyField(Owner, related_name='rs_usufruct', blank=True)
    buy_date = models.DateField(blank=True, null=True)
    buy_value = models.CharField(max_length=100, blank=True, null=True)
    observations = models.CharField(max_length=500, blank=True, null=True)

    @property
    def rs_name(self):
        rs_name = self.address
        if self.floor:
            rs_name += f' - Piso: {self.floor}'
        if self.unit:
            rs_name += f' - Unidad: {self.unit}'
        return rs_name

    class Meta:
        unique_together = ('address', 'floor', 'unit', )
        ordering = ('address', 'floor', 'unit', )