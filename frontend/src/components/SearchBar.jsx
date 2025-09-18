import { useObjContext } from "../context/ParametersContext";

function SearchBar({ onOpenModal }) {
    const { obj } = useObjContext();
    const obj_name = obj.toUpperCase();

    return (
        <div className="hstack w-100 mb-5">
            <input className="form-control w-100" type="text" />
            <button className="btn btn-primary w-auto text-nowrap ms-3" type="button" onClick={onOpenModal}>
                {`+ ${obj_name}`}
            </button>
        </div>
    );
}

export default SearchBar;