import { useEffect, useState } from 'react';
import {validateCuit} from '../myScripts/myMainScript';
import { useFormHandler } from '../myScripts/useFormHandler';
import { fetchObjsData } from '../services/api_crud';
import { useObjContext } from '../context/CrudContext';
import TableChecks from './TableChecks';

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


function FormRealState({ formRef }) {
    const { register, onSubmit, setValue} = useFormHandler(null);
    const { setError, setLoading } = useObjContext()
    
    const [rsTypes, setRsTypes] = useState(null);
    const [ownersData, setOwnersData] = useState(null);
    const [selectedOwners, setSelectedOwners] = useState([]);
    const [selectedUsufructs, setSelectedUsufructs] = useState([]);

    useEffect(() => {
        setValue('owner', selectedOwners);
        setValue('usufruct', selectedUsufructs);
    }, [selectedOwners, selectedUsufructs, setValue])

    useEffect(() => {
        const loadTypes = async () => {
            try {
                const fetchedData = await fetchObjsData('tipo_de_propiedad', "0");
                const flatData = Array.isArray(fetchedData) ? fetchedData.flat() : [];
                setRsTypes(flatData)
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const loadOwners = async () => {
            try {
                const fetchedData = await fetchObjsData('propietario', "0");
                const flatData = Array.isArray(fetchedData) ? fetchedData.flat() : [];
                setOwnersData(flatData)
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        loadTypes();
        loadOwners();

        return () => { }
        
    }, []);

    return (
        <form ref={formRef} onSubmit={onSubmit}>
            <div className='w-100'>
                <label htmlFor="rs_type">TIPO</label>
                <select className="form-select form-select-sm" id="rs_type" name="rs_type" {...register('rs_type')} defaultValue="" required>
                    <option key="0" value="" disabled></option>
                    {rsTypes && rsTypes.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.rs_type}</option>
                    ))}
                </select>
            </div>
            <div className="w-100 mt-3">
                <label htmlFor='address'>DIRECCION</label>
                <input className="form-control form-control-sm" id="address" name="address" {...register('address')} required/>
            </div>
            <div className="hstack w-100 mt-3">
                <div className='w-100'>
                    <label htmlFor='floor'>PISO</label>
                    <input className="form-control form-control-sm" id="floor" name="floor" {...register('floor')} type="number" step="1"/>
                </div>
                <div className='w-100 ms-2'>
                    <label htmlFor='unit'>UNIDAD</label>
                    <input className="form-control form-control-sm" id="unit" name="unit" {...register('unit')} type="number" step="1" min="0"/>
                </div>
                <div className='w-100 ms-2'>
                    <label htmlFor='has_garage'>CON COCHERA</label>
                    <select className="form-select form-select-sm" id="has_garage" name="has_garage" {...register('has_garage')}>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                    </select>
                </div>
            </div>
            <hr></hr>
            <div className="w-100 mt-3">
                <label className='mb-2'>PROPIETARIO/S</label>
                <TableChecks objs={ownersData} onSelectionChange={setSelectedOwners}/>
            </div>
            <div className="w-100 mt-3">
                <label className='mb-2'>USUFRUCTO</label>
                <TableChecks objs={ownersData} onSelectionChange={setSelectedUsufructs}/>
            </div>
            <hr></hr>
            <div className="hstack w-100 mt-3">
                <div className='w-100'>
                    <label htmlFor='buy_date'>FECHA COMPRA</label>
                    <input className="form-control form-control-sm" id="buy_date" name="buy_date" type="date" {...register('buy_date')} />
                </div>
                <div className='w-100 ms-2'>
                    <label htmlFor='buy_value'>VALOR COMPRA</label>
                    <input className="form-control form-control-sm" id='buy_value' name='buy_value' {...register('buy_value')} />
                </div>
            </div>
            <div className='w-100 mt-3'>
                <label htmlFor='observations'>OBSERVACIONES</label>
                <textarea className="form-control form-control-sm" id="observations" name="observations" {...register('observations')}></textarea>
            </div>
        </form>
    )
}


function FormTax({ rs_id, formRef, initialData }) {
    const [taxTypes, setTaxTypes] = useState()
    const [hide, setHide] = useState(true)
    const { setError, setLoading } = useObjContext()
    const { register, onSubmit, setValue } = useFormHandler(initialData);
    
    useEffect(() => {
        const loadTypes = async () => {
            try {
                const fetchedData = await fetchObjsData('tipo_de_impuesto', "0");
                const flatData = Array.isArray(fetchedData) ? fetchedData.flat() : [];
                setTaxTypes(flatData)
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTypes();

        return () => { }
    }, [])
    
    useEffect(() => {
        hide && setValue('tax_other', '');
    }, [hide, setValue]);

    useEffect(() => {
        if (!taxTypes || taxTypes.length === 0) return;
        
        if (initialData?.tax_type) {
            setValue('tax_type', initialData.tax_type.id);
            setValue('tax_other', initialData.tax_other);
            handleChange(initialData.tax_type.id);
        } else {
            setValue('tax_type', '')
        }
    }, [taxTypes]);

    const handleChange = (optValue) => {
        [1, "1"].includes(optValue) ? setHide(false) : setHide(true)
    }

    return (
        <form ref={formRef} onSubmit={onSubmit}>
            <div>
                {!initialData?.real_state &&
                    <input type="number" id="real_state" name="real_state" value={parseInt(rs_id)} {...register('real_state')} hidden readOnly/>
                }
            </div>
            <div className="w-100">
                <label htmlFor='tax_type'>TIPO</label>
                <select className='form-select form-select-sm' id='tax_type' name='tax_type' {...register("tax_type", {onChange: (e) => handleChange(e.target.value)})} required>
                    <option value="" disabled></option>
                    {taxTypes && taxTypes.map(item => (
                        <option key={item.id} value={item.id}>{item.tax_type}</option>
                    ))}
                </select>
            </div>
            <div className="w-100" hidden={hide}>
                <label htmlFor='tax_other'>NOMBRE</label>
                <input className="form-control form-control-sm" id="tax_other" name="tax_other" placeholder='Nombre/Entidad...' {...register('tax_other')} required={!hide} />
            </div>
            <div className='hstack mt-3'>
                <div className='w-100'>
                    <label htmlFor='tax_nbr1'>NÚMERO</label>
                    <input className="form-control form-control-sm" id='tax_nbr1' name='tax_nbr1' {...register('tax_nbr1')} required/>
                </div>
                <div className='w-100 ms-2'>
                    <label htmlFor='tax_nbr2'>NÚMERO SEC</label>
                    <input className="form-control form-control-sm" id='tax_nbr2' name='tax_nbr2' {...register('tax_nbr2')}/>
                </div>
            </div>
            <div className='w-100 mt-3'>
                <label htmlFor="taxed_person">TITULAR</label>
                <input className="form-control form-control-sm" id='taxed_person' name='taxed_person'{...register('taxed_person')} />
            </div>
            <div className='w-100 mt-3'>
                <label htmlFor='observations'>OBSERVACIONES</label>
                <input className="form-control form-control-sm" id='observations' name='observations' {...register('observations')} />
            </div>
        </form>
    )
}


function FormTaxType({ formRef, initialData }) {
    const { register, onSubmit } = useFormHandler(initialData);

    return (
        <form ref={formRef} onSubmit={onSubmit}>
            <div className="w-100">
                <label htmlFor='tax_type'>TIPO DE IMPUESTO</label>
                <input className='form-control form-control-sm' id='tax_type' name='tax_type' {...register('tax_type')} required/>
            </div>
        </form>
    )
}

export { FormOwner, FormRsType, FormRealState, FormTax, FormTaxType};
