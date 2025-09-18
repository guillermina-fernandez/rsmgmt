import { useForm } from 'react-hook-form';
import validateCuit from '../myScripts/myMainScript';
import { useObjContext } from '../context/ParametersContext';

function FormOwner({ formRef, onClose}) {
    const { submitForm } = useObjContext();
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = handleSubmit((data) => {
        submitForm(data, onClose);
    })
    
    return (
        <form ref={formRef} onSubmit={onSubmit}>
            <div className="hstack">
                <div className="w-100">
                    <label htmlFor="lastName">APELLIDO</label>
                    <input className="form-control form-control-sm" id="lastName" name="lastName" {...register('last_name')} required/>
                </div>
                <div className="w-100 ms-2">
                    <label htmlFor="firstName">NOMBRE</label>
                    <input className="form-control form-control-sm" id="firstName" name="firstName" {...register('first_name')} required/>
                </div>
            </div>
            <div className="mt-3" style={{width: "50%"}}>
                <label htmlFor="cuit">CUIT</label>
                <input className="form-control form-control-sm centered-placeholder" id="cuit" name="cuit" placeholder="xx-xxxxxxxx-x" {...register('cuit', { validate: validateCuit })} required />
                {errors.cuit && <span className="text-danger">{errors.cuit.message}</span>}
            </div>
        </form>
    );
}

export default FormOwner;
