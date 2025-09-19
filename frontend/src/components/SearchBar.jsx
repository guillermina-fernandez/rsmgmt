import { useObjContext } from "../context/CrudContext";

function SearchBar() {
    const { obj, searchObj, handleSearch, openModal } = useObjContext();
    const obj_name = obj.toUpperCase().replaceAll('_', ' ');
    const obj_name_title = String(obj[0]).toUpperCase() + String(obj).slice(1)
    const newModalTitle = `Agregar ${obj_name_title.replaceAll('_', ' ')}`
    const placeholder = `Buscar ${obj_name_title.replaceAll('_', ' ')}...`

    return (
        <div className="hstack w-100 mb-5">
            <input className="form-control w-100" type="text" placeholder={ placeholder } value={searchObj} onChange={(e) => handleSearch(e.target.value)}/>
            <button className="btn btn-primary w-auto text-nowrap ms-3" type="button" onClick={() => openModal(newModalTitle)}>
                {`+ ${obj_name}`}
            </button>
        </div>
    );
}

export default SearchBar;