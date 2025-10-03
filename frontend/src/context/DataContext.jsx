import { createContext, useState, useContext, useEffect } from "react";
import { fetchModelObjects, fetchRelatedModelObjects, createObjDataAPI, updateObjDataAPI, deleteObjAPI } from "../services/api_crud";

const modelConfig = {
    propietario: {
        columns: ["COD", "APELLIDO", "NOMBRE", "CUIT"],
        searchBy: ["last_name", "first_name", "cuit"],
        sortBy: ["last_name", "first_name"]
    },
    inquilino: {
        columns: ["COD", "APELLIDO", "NOMBRE", "CUIT"],
        searchBy: ["last_name", "first_name", "cuit"],
        sortBy: ["last_name", "first_name"],
    },
    tipo_de_propiedad: {
        columns: ["COD", "TIPO DE PROPIEDAD"],
        searchBy: ["rs_type"],
        sortBy: ["rs_type"],
    },
    propiedad: {
        columns: ["COD", "PROPIEDAD", "TIPO", "COCHERA", "PROPIETARIO/S", "USUFRUCTO", "OBS"],
        searchBy: ["rs_name", "owners", "usufructs"],
        sortBy: ["rs_name"],
    },
    tipo_de_impuesto: {
        columns: ["COD", 'TIPO DE IMPUESTO'],
        searchBy: ["tax_type"],
        sortBy: ["tax_type"]
    },
    impuesto: {
        columns: ["IMPUESTO", 'NRO', 'NRO SEC', 'TITULAR', 'OBS'],
        searchBy: [''],
        sortBy: ['tax_type', 'tax_other', 'tax_nbr1', 'tax_nbr2']
    }
}

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ modelName, modelDepth, modelId, relatedModel, relatedModelDepth, relatedFieldName, children }) => {
    
    const [modelData, setModelData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchObj, setSearchObj] = useState("");
    const [foundObjs, setFoundObjs] = useState(modelData);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [editObj, setEditObj] = useState(null);

    // Load initial data on page load
    useEffect(() => {
        const loadData = async () => {
            try {
                let fetchedData = [];
                if (relatedModel) {
                    fetchedData = await fetchRelatedModelObjects(relatedModel, relatedModelDepth, relatedFieldName, modelId)
                } else {
                    fetchedData = await fetchModelObjects(modelName, modelDepth)
                }
                const flatData = Array.isArray(fetchedData) ? fetchedData.flat() : [];
                setModelData(flatData);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();

        return () => { }
        
    }, [modelName]);
   
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
            setFoundObjs(modelData);
            return;
        }

        const lower = searchObj.toLowerCase();
        const { searchBy } = modelConfig[modelName] || { searchBy: [] };
        const results = modelData.filter((item) =>
            searchBy.some(
                (field) => item[field]?.toString().toLowerCase().includes(lower)
            )
        );

        setFoundObjs(results);
    }, [searchObj, modelData])

    const handleSearch = (inputValue) => {
        setSearchObj(inputValue);
    }

    // Handle modal:
    const openModal = (newModalTitle) => {
        setShowModal(true);
        setModalTitle(newModalTitle)
        setEditObj(null);
    };
    
    const closeModal = () => {
        setShowModal(false);
        setEditObj(null);
    };

    // Delete obj:
    const handleDelete = async (deleteId) => {        
        const objToDelete = modelData.find(deleteObj => deleteObj.id === deleteId);
        let message = 'ATENCIÓN!\nSe eliminará el registro:\n';
        Object.values(objToDelete).forEach(value => {
            message += value + ' - ';
        })
        
        const accepted = confirm(message.slice(0, -3));
        
        if (accepted) {
            setLoading(true);
            try {
                await deleteObjAPI(modelName, deleteId);
                setModelData(prev => prev.filter(deleteObj => deleteObj.id !== deleteId));
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Submit form:
    const submitForm = async (submitData, submitMode) => {
        setLoading(true);
        setError(null);
        try {
            let responseData;
            if (submitMode === 'create') {
                responseData = await createObjDataAPI(modelName, submitData);
            } else {
                responseData = await updateObjDataAPI(modelName, submitData.id, submitData);
            }

            const newData = Array.isArray(responseData) ? responseData[0] : responseData;

            if (submitMode === 'create') {
                addObjData(newData);
            } else {
                updateObjData(newData);
            }
            setShowModal(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Update objData with new record:
    const addObjData = (newData) => {
        setModelData(prev => {
            const updated = [...prev, newData];
            return sortData(updated);
        });
    }

    // Update objData with edited record:
    const updateObjData = (newData) => {
        setModelData(prev => {
            const updated = prev.map(item =>
                item.id === newData.id ? newData : item
            ); 
            return sortData(updated);
        });
    }

    const sortData = (sortedData) => {
    const sortByFields = modelConfig[modelName]?.sortBy || [];
    if (!sortByFields.length) return sortedData;
        return [...sortedData].sort((a, b) => {
            for (const field of sortByFields) {
                const aVal = a?.[field] ?? "";
                const bVal = b?.[field] ?? "";
                const compare = aVal.toString().localeCompare(bVal.toString());
                if (compare !== 0) return compare;
            }
            return 0;
        });
    };


    // Context values passed to children
    const value = {
        modelName,
        modelData,
        modelConfig,
        updateObjData,
        setLoading,
        setError,
        showModal, 
        openModal,
        modalTitle,
        closeModal,
        editObj,
        setEditObj,
        submitForm,
        searchObj,
        handleSearch,
        foundObjs,
        handleDelete
    }

    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>;
}

