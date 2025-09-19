import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useObjContext } from "../context/ParametersContext";


const columns_names = {
    propietario: ["COD", "APELLIDO", "NOMBRE", "CUIT"],
    inquilino: ["COD", "APELLIDO", "NOMBRE", "CUIT"],
    tipo_de_propiedad: ["COD", "TIPO DE PROPIEDAD"]
}


function Parameter() {
    const { obj, objData, showModal } = useObjContext();

    return (
        <div>
            <NavBar/>
            <SearchBar obj={obj} />
            <Table objData={objData} cols={columns_names[obj]} />
            {showModal && <Modal />}
        </div>
    )
}

export default Parameter;