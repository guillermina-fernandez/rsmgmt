import { useObjContext } from "../context/ParametersContext";

function SearchBar() {
    const { obj, searchObj, handleSearch, openModal } = useObjContext();
    const obj_name = obj.toUpperCase();
    
    const newModalTitle = `Agregar ${String(obj[0]).toUpperCase() + String(obj).slice(1)}`

    return (
        <div className="hstack w-100 mb-5">
            <input className="form-control w-100" type="text" placeholder="Buscar Propietario..." value={searchObj} onChange={(e) => handleSearch(e.target.value)}/>
            <button className="btn btn-primary w-auto text-nowrap ms-3" type="button" onClick={() => openModal(newModalTitle)}>
                {`+ ${obj_name}`}
            </button>
        </div>
    );
}

export default SearchBar;