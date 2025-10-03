import { useRsContext } from "../context/RsContext";
import { spanishDate } from "../myScripts/myMainScript";
import Modal from "../components/Modal";
import { useDataContext } from "../context/DataContext";
import { DataProvider } from "../context/DataContext";


function get_persons(personsString) {
    let persons = personsString.replace(/, /g, ",\n");
    
    return persons
}


function RsTable({objData}) {
    let rs_type = objData.rs_type_name;
    const has_garage = objData.has_garage;
    if (has_garage === 'SI') {
        rs_type += " CON COCHERA"
    }

    let buy_date = objData.buy_date || null
    if (buy_date) {
        buy_date = spanishDate(buy_date)
    }

    const owners = get_persons(objData.owners)
    const usufructs = get_persons(objData.usufructs)

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
                    <td style={{ whiteSpace: 'pre-line' }}>{usufructs}</td>
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


function Taxes() {    
    const { modelName, modelId, modelData, openModal, showModal, handleDelete, setEditObj, modelConfig } = useDataContext();
    const obj_name_title = String(modelName[0]).toUpperCase() + String(modelName).slice(1);
    const newModalTitle = `Agregar ${obj_name_title.replaceAll('_', ' ')}`

    const cols = modelConfig[modelName]['columns'];

    const handleEdit = (editObj) => {
        const objTitle = String(modelName[0]).toUpperCase() + String(modelName).slice(1)
        const newModalTitle = `Editar ${objTitle.replaceAll('_', ' ')}`
        openModal(newModalTitle);
        setEditObj(editObj)
    }

    return (
        <>
            {showModal && <Modal rs_id={modelId} />}
            <div className="hstack">
                <h4>IMPUESTOS</h4>
                <button type="button" className="btn btn-primary btn-sm ms-3" onClick={() => openModal(newModalTitle)}>+</button>
            </div>
            <table className="custom-table border">
                <thead>
                    <tr>
                        {cols.map((col, index) => <th key={`col${index}`} className="text-start">{col}</th>)}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {modelData.map(tax => (
                        <tr key={tax.id}>
                            <td>{tax.tax_type.tax_type === 'OTRO' ? tax.tax_other : tax.tax_type.tax_type}</td>
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
    
    return (
        <>
            {objData &&
            <div>
                <h1>{objData.rs_name}</h1>
                <div className="w-100 mt-5">
                    <div className="hstack w-100">
                        <div style={{ width: "40%", minHeight: "300px" }}>
                            <h4 className="text-start">DATOS</h4>
                            <RsTable objData={objData} />
                        </div>
                        <div className="ms-5" style={{ width: "60%", minHeight: "300px" }}>
                            <DataProvider modelName='impuesto' modelDepth='0' relatedModel='impuesto' relatedModelDepth='1' relatedFieldName='real_state' modelId={objData.id}>
                                <Taxes />
                            </DataProvider>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default RealState;