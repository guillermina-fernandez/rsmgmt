from rest_framework.decorators import api_view
# from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import ProtectedError, RestrictedError

from common.validators import normalize_form_data

from .serializers import get_serializer_class, RealStateCustomSerializer

from parameters.models import Owner, Tenant, RealStateType
from realstate.models import RealState

models_dic = {
    'propietario': Owner,
    'inquilino': Tenant,
    'tipo_de_propiedad': RealStateType,
    'propiedad': RealState
}


@api_view(('GET', ))
def fetch_objects(request, model_name):
    if model_name == 'propiedad':
        serializer = RealStateCustomSerializer(RealState.objects.all(), many=True)
    else:
        serializer_class = get_serializer_class(
            models_dic[model_name], '__all__', 0
        )
        serializer = serializer_class(models_dic[model_name].objects.all(), many=True)

    return Response([serializer.data])


@api_view(('GET', ))
def fetch_object(request, model_name, obj_id):
    if not model_name:
        return Response({'error': 'No se ha determinado un modelo.'}, status=status.HTTP_400_BAD_REQUEST)
    if not obj_id:
        return Response({'error': 'No se ha determinado un id.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer_class = get_serializer_class(
        models_dic[model_name], '__all__', 1
    )

    try:
        obj = models_dic[model_name].objects.get(id=int(obj_id))
        serializer = serializer_class(instance=obj)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except models_dic[model_name].DoesNotExist:
        return Response({'error': f'No se encontró el objeto del modelo {model_name} con id {obj_id}.'}, status=status.HTTP_404_NOT_FOUND)
    except LookupError:
        return Response({'error': f'Nombre de modelo inválido ({model_name}).'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(('POST', ))
def create_object(request, model_name):
    form_data = request.data

    if not form_data:
        return Response({'error': 'No se ha enviado la información.'}, status=status.HTTP_400_BAD_REQUEST)
    if not model_name:
        return Response({'error': 'No se ha determinado un modelo.'}, status=status.HTTP_400_BAD_REQUEST)

    form_data = normalize_form_data(models_dic[model_name], form_data)
    print(form_data)

    serializer_class = get_serializer_class(models_dic[model_name], '__all__', 0)
    serializer = serializer_class(data=form_data)
    if serializer.is_valid():
        print('serializer IS valid')
        try:
            instance = serializer.save()
            if model_name == 'propiedad':
                serializer = RealStateCustomSerializer(instance=instance)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': {'__all__': [str(e)]}}, status=status.HTTP_400_BAD_REQUEST)
    else:
        print('serializer is NOT valid')
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




"""

class PersonFlatSerializer(serializers.ModelSerializer):
    dog_name = serializers.CharField(source='dog.dog_name')
    dog_country = serializers.CharField(source='dog.nationality.country')

    class Meta:
        model = Person
        fields = ['person_name', 'dog_name', 'dog_country']
Result in React:

json
Copiar código
{
  "person_name": "Alice",
  "dog_name": "Rex",
  "dog_country": "Germany"
}

"""