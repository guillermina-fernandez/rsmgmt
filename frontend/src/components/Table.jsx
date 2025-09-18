
import { useObjContext } from "../context/ParametersContext";

function Table({ cols }) {

    const { obj, objData, foundObjs, handleDelete, openModal, setEditObj } = useObjContext();

    let showData = objData;
    if (foundObjs) {
        showData = foundObjs;
    }

    const handleEdit = (editObj) => {
        const newModalTitle = `Editar ${String(obj[0]).toUpperCase() + String(obj).slice(1)}`
        openModal(newModalTitle);
        setEditObj(editObj)
    }

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        {cols.map((col, index) => <th key={`col${index}`} className="text-start">{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {showData.map((obj) =>
                        <tr key={obj.id} className="text-start">
                            <td style={{ verticalAlign: "middle" }}>{obj.id}</td>
                            <td style={{ verticalAlign: "middle" }}>{obj.last_name}</td>
                            <td style={{ verticalAlign: "middle" }}>{obj.first_name}</td>
                            <td style={{ verticalAlign: "middle" }}>{obj.cuit}</td>
                            <td style={{ width: "10px" }}>
                                <button className="btn btn-sm btn-danger" type="button" onClick={() => handleDelete(obj.id)}><i className="bi bi-trash3"></i></button>
                            </td>
                            <td style={{ width: "10px" }}>
                                <button className="btn btn-sm btn-success" type="button" onClick={() => handleEdit(obj)}><i className="bi bi-pencil-square"></i></button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table;
