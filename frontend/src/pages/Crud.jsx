import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import TableRealStates from "../components/TableRealStates";
import Modal from "../components/Modal";
import { useObjContext } from "../context/CrudContext";


function Crud() {
    const { obj, modelConfig, showModal } = useObjContext();

    return (
        <div>
            <NavBar/>
            <SearchBar obj={obj} />
            {obj == 'propiedad' ? <TableRealStates /> : <Table cols={modelConfig[obj]["columns"]} />}
            {showModal && <Modal />}
        </div>
    )
}

export default Crud;