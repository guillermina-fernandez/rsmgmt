export const fetchObjData = async (obj) => {
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


export const postObjData = async (obj, data) => {
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