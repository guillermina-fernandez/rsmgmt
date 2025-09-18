import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useObjContext } from "../context/ParametersContext";


const columns_names = {
    propietario: ["COD", "APELLIDO", "NOMBRE", "CUIT", "", ""]
}


function Parameter() {
    const { obj, objData, showModal } = useObjContext();

    const modalTitle = String(obj[0]).toUpperCase() + String(obj).slice(1);

    return (
        <div>
            <SearchBar obj={obj} />
            <Table objData={objData} cols={columns_names[obj]} />
            {showModal && <Modal modalTitle={`Nuevo ${modalTitle}`} />}
            {showModal && <Modal modalTitle={`Editar ${modalTitle}`} />}
        </div>
    )
}

export default Parameter;