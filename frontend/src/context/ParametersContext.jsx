import { createContext, useState, useContext, useEffect } from "react";
import { fetchObjData, postObjData, deleteObj } from "../services/parameters_api";

const ObjContext = createContext();

export const useObjContext = () => useContext(ObjContext);

export const ObjProvider = ({ obj, children }) => {
    const [objData, setObjData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchObj, setSearchObj] = useState("");
    const [foundObjs, setFoundObjs] = useState(objData);

    // Load initial data on page load
    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchObjData(obj);
                const flatData = Array.isArray(fetchedData) ? fetchedData.flat() : [];
                setObjData(flatData);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
   
    // Alert error (if any)
    useEffect(() => {
        if (error) {
            alert(error);
        }
    }, [error]);

    // Render loading .gif or something
    useEffect(() => {
        if (loading) {
            console.log('Show loading.gif');
        } else {
            console.log('Hide loading.gif');
        }
    }, [loading])

    // Search object:
    useEffect(() => {
        if (!searchObj) {
            setFoundObjs(objData);
            return;
        }

        const lower = searchObj.toLowerCase();
        const results = objData.filter(
            (item) =>
                item.last_name?.toLowerCase().includes(lower) ||
                item.first_name?.toLowerCase().includes(lower) ||
                item.cuit?.includes(lower)
        );

        setFoundObjs(results);
    }, [searchObj, objData])

    const handleSearch = (inputValue) => {
        setSearchObj(inputValue);
    }

    // Delete obj:
    const handleDelete = async (obj_id) => {        
        const objToDelete = objData.find(delObj => delObj.id === obj_id);
        let message = 'ATENCIÓN!\nSe eliminará el registro:\n';
        Object.values(objToDelete).forEach(value => {
            message += value + ' - ';
        })
        
        const accepted = confirm(message.slice(0, -3));
        
        if (accepted) {
            setLoading(true);
            try {
                await deleteObj(obj, obj_id);
                setObjData(prev => prev.filter(delObj => delObj.id !== obj_id));
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Submit form:
    const submitForm = async (data, onSuccess) => {
        setLoading(true);
        setError(null);
        try {
            const postedData = await postObjData(obj, data);
            const newData = Array.isArray(postedData) ? postedData[0] : postedData;
            updateObjData(newData);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Update data (sorted for table)
    const updateObjData = (newData) => {
        setObjData(prev => {
            const updated = [...prev, newData].flat();
            return updated.sort((a, b) => {
                const lastCompare = (a?.last_name ?? "").localeCompare(b?.last_name ?? "");
                if (lastCompare !== 0) return lastCompare;
                return (a?.first_name ?? "").localeCompare(b?.first_name ?? "");
            });
        });
    };

    // Context values passed to children
    const value = {
        obj,
        objData,
        updateObjData,
        setLoading,
        setError,
        submitForm,
        searchObj,
        handleSearch,
        foundObjs,
        handleDelete
    }

    return <ObjContext.Provider value={value}>
        {children}
    </ObjContext.Provider>;
}

