const baseUrl = 'http://localhost:3000';


export const post = async <T>(path: string, data: any): Promise<T> => {
    const response = await fetch(baseUrl + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result: T = await response.json();
    return result;
}