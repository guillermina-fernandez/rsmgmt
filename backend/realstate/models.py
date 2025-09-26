from django.db import models
from django.core.exceptions import ValidationError
from parameters.models import RealStateType, Owner, TaxType

# Create your models here.


class RealState(models.Model):
    address = models.CharField(max_length=50)
    floor = models.IntegerField(blank=True, null=True)
    unit = models.IntegerField(blank=True, null=True)
    rs_type = models.ForeignKey(RealStateType, related_name='rs_rs_type', on_delete=models.RESTRICT)
    has_garage = models.CharField(max_length=2, default='NO')
    owner = models.ManyToManyField(Owner, related_name='rs_owner', blank=True)
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


class Tax(models.Model):
    real_state = models.ForeignKey(RealState, related_name='tax_rs', on_delete=models.CASCADE)
    tax_type = models.ForeignKey(TaxType, related_name='tax_tax_type', on_delete=models.RESTRICT)
    tax_other = models.CharField(max_length=50, blank=True, null=True)
    tax_nbr1 = models.CharField(max_length=50)
    tax_nbr2 = models.CharField(max_length=50, blank=True, null=True)
    taxed_person = models.CharField(max_length=60, blank=True, null=True)
    observations = models.CharField(max_length=500, blank=True, null=True)

    def clean(self):
        if self.tax_type.tax_type == 'OTRO' and not self.tax_other:
            raise ValidationError('Detalle un nombre para el impuesto.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('tax_type', 'tax_nbr1', 'tax_nbr2', )
        ordering = ('tax_type', 'tax_other', 'tax_nbr1', 'tax_nbr2', )

