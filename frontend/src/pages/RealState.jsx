import { useRsContext } from "../context/RsContext";
import { spanishDate } from "../myScripts/myMainScript";

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
        <table className="custom-fix-table">
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

function RealState() {
    const { objData } = useRsContext();

    const rs_name = objData ? get_name(objData.address, objData.floor, objData.unit) : "";
    
    return (
        <>
            <h1>{rs_name}</h1>
            <div className="mt-5 border" style={{width: "50%"}}>
                {objData && <RsTable objData={objData} />}
            </div>
        </>
    )
}

export default RealState;