from rest_framework import serializers
from rest_framework.decorators import api_view
# from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import ProtectedError, RestrictedError

from common.validators import UniqueTogetherWithNullAsEmpty, normalize_form_data

from parameters.models import Owner, Tenant

models_dic = {
    'propietario': Owner,
    'inquilino': Tenant,
}


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

    return CustomSerializer


@api_view(('GET', ))
def fetch_objects(request, model_name):
    serializer_class = get_serializer_class(
        models_dic[model_name], '__all__', 0
    )
    serializer = serializer_class(models_dic[model_name].objects.all(), many=True)
    return Response([serializer.data])


@api_view(('POST', ))
def create_object(request, model_name):
    form_data = request.data
    if not form_data:
        return Response({'error': 'No se ha enviado la información.'}, status=status.HTTP_400_BAD_REQUEST)

    if not model_name:
        return Response({'error': 'No se ha determinado un modelo.'}, status=status.HTTP_400_BAD_REQUEST)

    form_data = normalize_form_data(models_dic[model_name], form_data)
    serializer_class = get_serializer_class(models_dic[model_name], '__all__', 0)
    serializer = serializer_class(data=form_data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': {'__all__': [str(e)]}}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_object(request, model_name, obj_id):
    form_data = request.data

    if not form_data:
        return Response({'error': 'No se ha enviado la información.'}, status=status.HTTP_400_BAD_REQUEST)

    if not model_name:
        return Response({'error': 'No se ha determinado un modelo.'}, status=status.HTTP_400_BAD_REQUEST)
    if not obj_id:
        return Response({'error': 'No se ha determinado un id.'}, status=status.HTTP_400_BAD_REQUEST)

    form_data = normalize_form_data(models_dic[model_name], form_data)
    serializer_class = get_serializer_class(models_dic[model_name], '__all__', 0)
    try:
        object_instance = models_dic[model_name].objects.get(id=int(obj_id))
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except models_dic[model_name].DoesNotExist:
        return Response({'error': f'No se encontró el objeto del modelo {model_name} con id {obj_id}.'}, status=status.HTTP_404_NOT_FOUND)
    except LookupError:
        return Response({'error': f'Nombre de modelo inválido ({model_name}).'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = serializer_class(instance=object_instance, data=form_data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_object(request, model_name, obj_id):
    if not model_name:
        return Response({'error': 'No se ha determinado un modelo.'}, status=status.HTTP_400_BAD_REQUEST)
    if not obj_id:
        return Response({'error': 'No se ha determinado un id.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            obj = models_dic[model_name].objects.get(id=int(obj_id))
            print('obj', obj)
            obj.delete()
            return Response({'success': True}, status=status.HTTP_200_OK)
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except models_dic[model_name].DoesNotExist:
        return Response({'error': f'No se encontró el objeto del modelo {model_name} con id {obj_id}.'}, status=status.HTTP_404_NOT_FOUND)
    except ProtectedError as e:
        return Response({'error': f'No se puede eliminar porque está referenciado por otros objetos: {list(e.protected_objects)}'}, status=status.HTTP_400_BAD_REQUEST)
    except RestrictedError as e:
        return Response({'error': f'No se puede eliminar debido a restricción de integridad: {list(e.restricted_objects)}'}, status=status.HTTP_400_BAD_REQUEST)
    except LookupError:
        return Response({'error': f'Nombre de modelo inválido ({model_name}).'}, status=status.HTTP_400_BAD_REQUEST)

