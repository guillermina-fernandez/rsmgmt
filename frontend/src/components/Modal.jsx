import { useRef } from 'react';
import { useDataContext } from '../context/DataContext';
import {FormOwner, FormRealState, FormRsType, FormTax, FormTaxType} from './CrudForms';


function Modal(props) {
    const { modelName, closeModal, editObj, modalTitle } = useDataContext();

    const formRef = useRef(null);

    function handleClick() {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }
    
    return (
        <div className="modal fade show d-block pg-show-modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content px-3 py-3">
                    <div className="modal-header">
                        <h4 className="modal-title">{modalTitle}</h4>
                        <button className="btn-close" type="button" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                        {modelName === 'propietario' && <FormOwner formRef={formRef} initialData={editObj}></FormOwner>}
                        {modelName === 'inquilino' && <FormOwner formRef={formRef} initialData={editObj}></FormOwner>}
                        {modelName === "tipo_de_propiedad" && <FormRsType formRef={formRef} initialData={editObj}></FormRsType>}
                        {modelName === 'tipo_de_impuesto' && <FormTaxType formRef={formRef} initialData={editObj}></FormTaxType>}
                        {modelName === 'propiedad' && <FormRealState formRef={formRef} initialData={editObj}></FormRealState>}
                        {modelName === "impuesto" && <FormTax formRef={formRef} initialData={editObj} rs_id={props.rs_id}></FormTax>}
                    </div>
                    <hr/>
                    <div className="hstack">
                        <div className="w-100">
                        </div>
                        <div className="hstack">
                            <button className="btn btn-default" type="button" onClick={closeModal}>Cancelar</button>
                            <button className="btn btn-primary ms-3" onClick={handleClick}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;