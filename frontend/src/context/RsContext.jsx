import { createContext, useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchObjData } from "../services/api_crud";

const ObjContext = createContext();

export const useRsContext = () => useContext(ObjContext);

export const RsProvider = ({ children }) => {
    const [objData, setObjData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rs_id = String(useParams().rs_id);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchObjData('propiedad', rs_id);
                setObjData(fetchedData.data);
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

    const value = {
        objData,
        loading
    }
    
    return <ObjContext.Provider value={value}>
        {children}
    </ObjContext.Provider>;
}