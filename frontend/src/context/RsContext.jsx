import { createContext, useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchObjDataAPI } from "../services/api_crud";

const DataContext = createContext();

export const useRsContext = () => useContext(DataContext);

export const RsProvider = ({ children }) => {
    const [rsData, setRsData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rs_id = String(useParams().rs_id);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchObjDataAPI('propiedad', rs_id, 0);
                setRsData(fetchedData.data);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();

        return () => { }
        
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



    const value = {
        rsData,
        loading,
    }
    
    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>;
}