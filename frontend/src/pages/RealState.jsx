import { useRsContext } from "../context/RsContext";
import { spanishDate } from "../myScripts/myMainScript";
import Modal from "../components/Modal";
import { useObjContext } from "../context/CrudContext";
import { ObjProvider } from "../context/CrudContext";


function get_name(address, floor, unit) {
    let rs_name = address || ""
    if (floor) {
        rs_name += ` - Piso: ${floor}`
    }
    if (unit) {
        rs_name += ` - Unidad: ${unit}`
    }
    return rs_name
}


function get_persons(personsArray) {
    let persons = ''
    personsArray.forEach(person => {
        if (persons) {
            persons += '\n';
        }
        const person_info = `${person.last_name} ${person.first_name} (${person.cuit}), `;
        persons += person_info
    })

    persons = persons.substring(0, persons.length - 2)
    return persons
}


function RsTable({objData}) {
    let rs_type = objData.rs_type.rs_type;
    const has_garage = objData.has_garage;
    if (has_garage === 'SI') {
        rs_type += " CON COCHERA"
    }

    let buy_date = objData.buy_date || null
    if (buy_date) {
        buy_date = spanishDate(buy_date)
    }

    const owners = get_persons(objData.owner)
    const usufructuaries = get_persons(objData.usufruct)

    return (
        <table className="custom-fix-table border">
            <tbody>
                <tr>
                    <th>Tipo:</th>
                    <td>{rs_type}</td>
                </tr>
                <tr>
                    <th>Dueños:</th>
                    <td style={{ whiteSpace: 'pre-line' }}>{owners}</td>
                </tr>
                <tr>
                    <th>Usufructo:</th>
                    <td style={{ whiteSpace: 'pre-line' }}>{usufructuaries}</td>
                </tr>
                <tr>
                    <th>Fecha Compra:</th>
                    <td>{buy_date}</td>
                </tr>
                <tr>
                    <th>Valor Compra:</th>
                    <td>{objData.buy_value}</td>
                </tr>
                <tr>
                    <th>Observaciones</th>
                    <td>{objData.observations}</td>
                </tr>
            </tbody>
        </table>
    )
}


function Taxes({rs_id}) {
    const { obj, objData, openModal, showModal, handleDelete, setEditObj} = useObjContext();
    const obj_name_title = String(obj[0]).toUpperCase() + String(obj).slice(1)
    const newModalTitle = `Agregar ${obj_name_title.replaceAll('_', ' ')}`

    const handleEdit = (editObj) => {
        const objTitle = String(obj[0]).toUpperCase() + String(obj).slice(1)
        const newModalTitle = `Editar ${objTitle.replaceAll('_', ' ')}`
        openModal(newModalTitle);
        setEditObj(editObj)
    }

    return (
        <>
            {showModal && <Modal rs_id={rs_id} />}
            <div className="hstack">
                <h4>IMPUESTOS</h4>
                <button type="button" className="btn btn-primary btn-sm ms-3" onClick={() => openModal(newModalTitle)}>+</button>
            </div>
            <table className="custom-table border">
                <thead>
                    <tr>
                        <th>NOMBRE</th>
                        <th>NRO</th>
                        <th>NRO SEC</th>
                        <th>TITULAR</th>
                        <th>OBS</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {objData.map(tax => (
                        tax.real_state == rs_id &&
                        <tr key={tax.id}>
                            <td>{tax.tax}</td>
                            <td>{tax.tax_nbr1}</td>
                            <td>{tax.tax_nbr2}</td>
                            <td>{tax.taxed_person}</td>
                            <td>{tax.observations}</td>
                            <td style={{ width: "10px" }}>
                                <button className="btn btn-sm btn-danger" type="button" onClick={() => handleDelete(tax.id)}><i className="bi bi-trash3"></i></button>
                            </td>
                            <td style={{ width: "10px" }}>
                                <button className="btn btn-sm btn-success" type="button" onClick={() => handleEdit(tax)}><i className="bi bi-pencil-square"></i></button>
                            </td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}


function RealState() {
    const { objData } = useRsContext();

    const rs_name = objData ? get_name(objData.address, objData.floor, objData.unit) : "";
    
    return (
        <>
            <h1>{rs_name}</h1>
            <div className="w-100 mt-5">
                <div className="hstack w-100">
                    <div style={{ width: "40%", minHeight: "300px" }}>
                        <h4 className="text-start">DATOS</h4>
                        {objData && <RsTable objData={objData} />}
                    </div>
                    <div className="ms-5" style={{ width: "60%", minHeight: "300px" }}>
                        <ObjProvider obj="impuesto">
                            {objData && <Taxes rs_id={objData.id} />}
                        </ObjProvider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RealState;