
import { useObjContext } from "../context/CrudContext";

function TableRealStates() {

    const { objData, foundObjs } = useObjContext();

    let showData = objData;
    if (foundObjs) {
        showData = foundObjs;
    }


    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>COD</th>
                        <th>PROPIEDAD</th>
                        <th>TIPO</th>
                        <th>COCHERA</th>
                        <th>PROPIETARIO/S</th>
                        <th>USUFRUCTO</th>
                        <th>OBS</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {showData.map((dataItem) =>
                        <tr key={dataItem.id} className="text-start">
                            {Object.keys(dataItem).map((key, index) => (
                                <td key={index} style={{ verticalAlign: "middle" }}>{ dataItem[key] }</td>
                            ))}
                            <td style={{ width: "10px" }}>
                                <a href={`/propiedad/${dataItem.id}/`}><button className="btn btn-sm btn-success" type="button"><i className="bi bi-pencil-square"></i></button></a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default TableRealStates;
