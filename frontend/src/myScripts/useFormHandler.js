import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useObjContext } from '../context/CrudContext';

export const useFormHandler = (initialData) => {
    const { submitForm } = useObjContext();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = handleSubmit((data) => {
        if (initialData?.id) {
            submitForm({ ...initialData, ...data }, 'update');
        } else {
            submitForm(data, 'create');
        }
    });

    return { register, onSubmit, errors, setValue };
}