import re
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q



def validate_cuit(value):
    if not re.match(r'^\d{2}-?\d{8}-?\d{1}$', value):
        raise ValidationError('CUIT must have the following format: XX-XXXXXXXX-X')

    cuit = re.sub(r'[^\d]', '', value)

    if len(cuit) != 11:
        raise ValidationError('CUIT must have 11 digits (without "-"s)')

    mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    aux = 0
    for i in range(10):
        aux += int(cuit[i]) * mult[i]
    verificador = 11 - (aux % 11)
    if verificador == 11:
        verificador = 0
    elif verificador == 10:
        verificador = 9

    if verificador != int(cuit[10]):
        raise ValidationError('CUIT not valid')


class UniqueTogetherWithNullAsEmpty:
    def __init__(self, queryset, fields, model=None, message=None):
        self.queryset = queryset
        self.fields = fields
        self.model = model
        self.message = message or (
            f"Combination of {fields} must be unique (treating null/empty as empty)"
            f"{' in ' + model.__name__ if model else ''}."
        )

    def normalize(self, value):
        if value is None:
            return ''
        if isinstance(value, (int, float)):
            return str(value)
        return str(value).strip()

    def __call__(self, attrs, serializer=None):
        # safely get underlying instance (handles wrapped serializers)
        instance_obj = getattr(serializer, 'instance', None) if serializer else None
        if instance_obj and hasattr(instance_obj, 'instance'):
            instance_obj = instance_obj.instance
        instance_pk = getattr(instance_obj, instance_obj._meta.pk.name, None) if instance_obj else None

        # build compare dict: prefer incoming attrs, fallback to instance values
        compare = {}
        for f in self.fields:
            if serializer and isinstance(attrs, dict) and f in attrs:
                raw = attrs.get(f)
            elif instance_obj is not None:
                raw = getattr(instance_obj, f, None)
            else:
                raw = None
            compare[f] = self.normalize(raw)

        # build a Q that treats '' and NULL as equivalent
        q = Q()
        for f, val in compare.items():
            if val == '':
                q &= (Q(**{f"{f}__isnull": True}) | Q(**{f: ''}))
            else:
                q &= Q(**{f: val})

        qs = self.queryset.filter(q)
        if instance_pk is not None:
            qs = qs.exclude(pk=instance_pk)

        if qs.exists():
            raise ValidationError(self.message)


def normalize_form_data(model_obj, form_data):
    def to_int_or_keep(value):
        if value in (None, ''):
            return None
        try:
            return int(value)
        except (TypeError, ValueError):
            return value

    def to_float_or_keep(value):
        if value in (None, ""):
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return value

    def to_date_or_none(value):
        if value in (None, ""):
            return None
        return value

    normalized = {}

    # Handle normal fields
    for field in model_obj._meta.fields:
        name = field.name
        if name not in form_data:
            continue

        value = form_data[name]

        if isinstance(field, (models.CharField, models.TextField)) and isinstance(value, str):
            normalized[name] = value.strip().upper()
        elif isinstance(field, models.IntegerField):
            normalized[name] = to_int_or_keep(value)
        elif isinstance(field, (models.FloatField, models.DecimalField)):
            normalized[name] = to_float_or_keep(value)
        elif isinstance(field, (models.ForeignKey, models.OneToOneField)):
            normalized[name] = to_int_or_keep(value)
        elif isinstance(field, models.DateField):
            normalized[name] = to_date_or_none(value)
        else:
            normalized[name] = value

    # Handle ManyToMany fields (like owner, rs_use, etc.)
    for field in model_obj._meta.many_to_many:
        name = field.name
        if name not in form_data:
            continue

        value = form_data[name]
        if value:
            if isinstance(value, (list, tuple)):
                normalized[name] = [to_int_or_keep(v) for v in value if v is not None]
            else:
                normalized[name] = [to_int_or_keep(value)]
        else:
            normalized[name] = []

    return normalized

