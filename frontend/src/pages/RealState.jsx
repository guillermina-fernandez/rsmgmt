import { useRsContext } from "../context/RsContext";
import { spanishDate } from "../myScripts/myMainScript";
import Modal from "../components/Modal";
import { useDataContext } from "../context/DataContext";
import { DataProvider } from "../context/DataContext";
import { useEffect, useState } from "react";


function get_persons(personsString) {
    let persons = personsString.replace(/, /g, ",\n");

    return persons
}


function RsTable({ rsData }) {
    let rs_type = rsData.rs_type_name;
    const has_garage = rsData.has_garage;
    if (has_garage === 'SI') {
        rs_type += " CON COCHERA"
    }

    let buy_date = rsData.buy_date || null
    if (buy_date) {
        buy_date = spanishDate(buy_date)
    }

    const owners = rsData.owners ? get_persons(rsData.owners) : '';
    const usufructs = rsData.usufructs ? get_persons(rsData.usufructs) : '';

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
                    <td>{rsData.buy_value}</td>
                </tr>
                <tr>
                    <th>Observaciones</th>
                    <td>{rsData.observations}</td>
                </tr>
            </tbody>
        </table>
    )
}


function Taxes({rs_id}) {
    const { modelName, modelData, openModal, showModal, handleDelete, setEditObj, modelConfig } = useDataContext();

    const cols = modelConfig[modelName]['columns'];

    const handleEdit = (editObj) => {
        openModal('edit');
        setEditObj(editObj)
    }

    // Cannot use the <Table /> component since real_state and tax_type return objects, not strings...
    return (
        <>
            {showModal && <Modal rs_id={rs_id} />}
            <div className="hstack">
                <h4>IMPUESTOS</h4>
                <button type="button" className="btn btn-primary btn-sm ms-3" onClick={() => openModal('new')}>+</button>
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


function Rent({rs_id}) {
    const { modelData, openModal, showModal, handleDelete, setEditObj } = useDataContext();
    const [lastRent, setLastRent] = useState({});
    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        console.log(modelData)
        console.log(modelData[0])
        
    }, [modelData])


    const handleEdit = (editObj) => {
        openModal('edit');
        setEditObj(editObj)
    }

    return (
        <>
            {showModal && <Modal rs_id={rs_id} />}
            <div className="hstack">
                <h4>ALQUILERES</h4>
                <button type="button" className="btn btn-primary btn-sm ms-3" onClick={() => openModal('new')}>+</button>
            </div>
            <table className="custom-table border">
                {/*<tbody>
                    <tr>
                        <th>FECHA INICIO</th>
                        <td>{spanishDate(lastRent.date_from)}</td>
                    </tr>
                    <tr>
                        <th>FECHA FIN</th>
                        <td>{spanishDate(lastRent.date_to)}</td>
                    </tr>
                    <tr>
                        <th>ACTUALIZACION</th>
                        <td>{lastRent.actualization}</td>
                    </tr>
                    <tr>
                        <th>INQUILINO/S</th>
                        <th></th>
                    </tr>
                </tbody>*/}
            </table>
        </>
    )
}


function RealState() {
    const { rsData } = useRsContext();

    return (
        <>
            {rsData &&
                <div>
                    <h1>{rsData.rs_name}</h1>
                    <div className="w-100 mt-5">
                        <div className="hstack w-100">
                            <div style={{ width: "40%", minHeight: "300px" }}>
                                <h4 className="text-start">DATOS</h4>
                                <RsTable rsData={rsData} />
                            </div>
                            <div className="ms-5" style={{ width: "60%", minHeight: "300px" }}>
                                <DataProvider modelName='impuesto' modelDepth='0' relatedModel='impuesto' relatedModelDepth='1' relatedFieldName='real_state' modelId={rsData.id}>
                                    <Taxes rs_id={rsData.id} />
                                </DataProvider>
                            </div>
                        </div>
                        <div className="hstack w-100 mt-3">
                            <div>
                                <DataProvider modelName='alquiler' modelDepth='0' relatedModel='alquiler' relatedModelDepth='0' relatedFieldName='real_state' modelId={rsData.id}>
                                    <Rent rs_id={rsData.id} />
                                </DataProvider>
                            </div>
                        </div> 
                    </div>
                </div>}
        </>
    )
}

export default RealState;