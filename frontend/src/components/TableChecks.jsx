import { useState, useEffect } from "react";

function TableChecks({ searchObj, objs, onSelectionChange }) {
    
    const [itemsChecked, setItemsChecked] = useState([]);

    useEffect(() => {
        onSelectionChange(itemsChecked);
    }, [itemsChecked, onSelectionChange])

    const handleClick = (item) => {
        const int_item = Number(item);
        setItemsChecked((prev) => {
            let newSelection;
            if (prev.includes(int_item)) {
                newSelection = prev.filter((item_id) => item_id != int_item);
            } else {
                newSelection = [...prev, int_item];
            }
            return newSelection
        });
    };
    
    return (
        <div className="w-100 border border-secondary p-2" style={{ height: '150px', overflowY: 'scroll', display: 'block' }}>
            <table className="custom-table mt-3">
                <tbody>
                    {objs && objs.map(item => (
                        <tr key={item.id}>
                            <td><input type="checkbox" value={item.id} checked={itemsChecked.includes(item.id)} onChange={() => {handleClick(item.id)}} /></td>
                            <td>{item.id}</td>
                            <td className="text-start">{item.last_name} {item.first_name} ({item.cuit})</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableChecks;