import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useObjContext } from "../context/CrudContext";


function Crud() {
    const { obj, modelConfig, objData, showModal } = useObjContext();

    return (
        <div>
            <NavBar/>
            <SearchBar obj={obj} />
            <Table objData={objData} cols={modelConfig[obj]["columns"]} />
            {showModal && <Modal />}
        </div>
    )
}

export default Crud;