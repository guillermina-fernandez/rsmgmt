import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useObjContext } from "../context/RealStateContext";


const columns_names = {
    propiedad: ["COD", "PROPIEDAD", "TIPO", "COCHERA", "PROPIETARIO/S", "USUFRUCTO"]
}


function RealStates() {
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

export default RealStates;