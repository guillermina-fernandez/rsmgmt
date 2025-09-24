from rest_framework import serializers
from common.validators import UniqueTogetherWithNullAsEmpty

from realstate.models import RealState


def get_serializer_class(model_obj, field_names, depth_nbr):
    meta_validators = []

    if hasattr(model_obj._meta, 'unique_together'):
        for fields in model_obj._meta.unique_together:
            meta_validators.append(
                UniqueTogetherWithNullAsEmpty(
                    queryset=model_obj.objects.all(),
                    fields=fields,
                    model=model_obj
                )
            )

    if hasattr(model_obj._meta, 'constraints'):
        for constraint in model_obj._meta.constraints:
            constraint_fields = getattr(constraint, 'fields', None)
            if constraint_fields:
                meta_validators.append(
                    UniqueTogetherWithNullAsEmpty(
                        queryset=model_obj.objects.all(),
                        fields=constraint_fields,
                        model=model_obj
                    )
                )

    class CustomSerializer(serializers.ModelSerializer):
        class Meta:
            model = model_obj
            fields = '__all__' if field_names == '__all__' else tuple(field_names)
            depth = depth_nbr
            validators = meta_validators

    return CustomSerializer


class RealStateCustomSerializer(serializers.ModelSerializer):
    rs_type_name = serializers.CharField(source="rs_type.rs_type", read_only=True)
    owners = serializers.SerializerMethodField()
    usufructs = serializers.SerializerMethodField()
    rs_name = serializers.ReadOnlyField()

    class Meta:
        model = RealState
        fields = [
            "id",
            "rs_name",
            "rs_type_name",
            "has_garage",
            "owners",
            "usufructs",
            "observations",
        ]

        validators = []

    @classmethod
    def attach_validators(cls):
        validators = []
        if hasattr(RealState._meta, 'unique_together'):
            for fields in RealState._meta.unique_together:
                validators.append(
                    UniqueTogetherWithNullAsEmpty(
                        queryset=RealState.objects.all(),
                        fields=fields,
                        model=RealState
                    )
                )
        if hasattr(RealState._meta, 'constraints'):
            for constraint in RealState._meta.constraints:
                constraint_fields = getattr(constraint, 'fields', None)
                if constraint_fields:
                    validators.append(
                        UniqueTogetherWithNullAsEmpty(
                            queryset=RealState.objects.all(),
                            fields=constraint_fields,
                            model=RealState
                        )
                    )
        cls.Meta.validators = validators

    def get_owners(self, obj):
        return ", ".join(f"{o.last_name} {o.first_name}" for o in obj.owner.all())

    def get_usufructs(self, obj):
        return ", ".join(f"{u.last_name} {u.first_name}" for u in obj.usufruct.all())


RealStateCustomSerializer.attach_validators()
