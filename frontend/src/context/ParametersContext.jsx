import { createContext, useState, useContext, useEffect } from "react";
import { fetchObjData, postObjData } from "../services/parameters_api";

const ObjContext = createContext();

export const useObjContext = () => useContext(ObjContext);

export const ObjProvider = ({ obj, children }) => {
    const [objData, setObjData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        submitForm
    }

    return <ObjContext.Provider value={value}>
        {children}
    </ObjContext.Provider>;
}

