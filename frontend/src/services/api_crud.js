// Fetch all objects
export const fetchObjsData = async (obj) => {
    const response = await fetch(`http://127.0.0.1:8000/api/${obj}/`);

    if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
            const result = await response.json();
            message = result.error || JSON.stringify(result);
        } catch {
            
        }
        throw new Error(message);
    }
    
    return await response.json();
};


// Fetch one object
export const fetchObjData = async (obj, obj_id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/${obj}/${obj_id}/`);

    if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
            const result = await response.json();
            message = result.error || JSON.stringify(result);
        } catch {
            
        }
        throw new Error(message);
    }
    
    return await response.json();
};


// Create new record
export const createObjDataAPI = async (obj, data) => {
    console.log(obj, data)
    const response = await fetch(`http://127.0.0.1:8000/api/create/${obj}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let result;
    try {
        result = await response.json();
    } catch {
        result = await response.text();
    }

    if (!response.ok) {
        throw new Error(
            result.error
                ? JSON.stringify(result.error, null, 2)
                : `Error ${response.status}`
        );
    }

    return result.data;
};

// Update record:
export const updateObjDataAPI = async (obj, id, data) => {
    const response = await fetch(`http://127.0.0.1:8000/api/update/${obj}/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    let result;
    try {
        result = await response.json();
    } catch {
        result = await response.text();
    }

    if (!response.ok) {
        throw new Error(
            result.error
                ? JSON.stringify(result.error, null, 2)
                : `Error ${response.status}`
        );
    }

    return result.data;
};

// Delete record:
export const deleteObjAPI = async (obj, objId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/delete/${obj}/${objId}/`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let result;
        try {
            result = await response.json();
        } catch {
            result = await response.text();
        }

        const message = result?.error ? JSON.stringify(result.error, null, 2) : `Error ${response.status}`;
        throw new Error(message);
    }
};