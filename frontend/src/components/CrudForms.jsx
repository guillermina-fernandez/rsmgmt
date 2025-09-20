import validateCuit from '../myScripts/myMainScript';
import { useFormHandler } from '../myScripts/useFormHandler';

function FormOwner({ formRef, initialData }) {
    const { register, onSubmit, errors } = useFormHandler(initialData);
    
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


function FormRsType({ formRef, initialData }) {
    const { register, onSubmit } = useFormHandler(initialData);

    return (
        <form ref={formRef} onSubmit={onSubmit}>
            <div className="w-100">
                <label htmlFor='rs_type'>TIPO DE PROPIEDAD</label>
                <input className="form-control form-control-sm" id="rs_type" name="rs_type" {...register('rs_type')} required/>
            </div>
        </form>
    )
}


function FormRealState({ formRef, initialData }) {
    const { register, onSubmit } = useFormHandler(initialData);

    return (
        <form ref={formRef} onSubmit={onSubmit}>
            {/* 
            
            TODO: 
            * componente tablita -> <- tablita para agregar/sacar propietarios y usufructuarios con un fetch de cada modelo
            * componente select para tipo de propiedad con un fetch del modelo
            
            */}
        </form>
    )
}

export { FormOwner, FormRsType, FormRealState};
