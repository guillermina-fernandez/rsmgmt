import { useRef } from 'react';
import { useObjContext } from '../context/CrudContext';
import {FormOwner, FormRealState, FormRsType, FormTax} from './CrudForms';


function Modal(props) {
    
    const { obj, closeModal, editObj, modalTitle } = useObjContext();

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
                        {obj === 'propietario' && <FormOwner formRef={formRef} initialData={editObj}></FormOwner>}
                        {obj === 'inquilino' && <FormOwner formRef={formRef} initialData={editObj}></FormOwner>}
                        {obj === "tipo_de_propiedad" && <FormRsType formRef={formRef} initialData={editObj}></FormRsType>}
                        {obj === 'propiedad' && <FormRealState formRef={formRef}></FormRealState>}
                        {obj === "impuesto" && <FormTax formRef={formRef} initialData={editObj} rs_id={props.rs_id}></FormTax>}
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