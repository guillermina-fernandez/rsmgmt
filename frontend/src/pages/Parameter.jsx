import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useObjContext } from "../context/ParametersContext";


const columns_names = {
    propietario: ["COD", "APELLIDO", "NOMBRE", "CUIT", "", ""]
}


function Parameter() {
    
    const { obj, objData } = useObjContext();
    
    const [showModalSave, setShowModalSave] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const openModalSave = () => setShowModalSave(true);
    const closeModalSave = () => setShowModalSave(false);
    const openModalEdit = () => setShowModalEdit(true);
    const closeModalEdit = () => setShowModalEdit(false);

    const modalTitle = String(obj[0]).toUpperCase() + String(obj).slice(1);

    return (
        <div>
            <SearchBar obj={obj} onOpenModal={openModalSave}/>
            <Table objData={objData} cols={columns_names[obj]} onOpenModal={openModalEdit} />
            {showModalSave && <Modal onClose={closeModalSave} modalTitle={`Nuevo ${modalTitle}`} />}
            {showModalEdit && <Modal onClose={closeModalEdit} modalTitle={`Editar ${modalTitle}`} />}
        </div>
    )
}

export default Parameter;