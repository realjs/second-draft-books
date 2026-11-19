export function json(response, status, value) {
    response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(value));
}

export async function body(request) {
    let size = 0;
    let text = '';
    for await (const chunk of request) {
        size += chunk.length;
        if (size > 32768) throw new Error('Request body too large');
        text += chunk.toString();
    }
    const result = JSON.parse(text);
    if (result === null || typeof result !== 'object' || Array.isArray(result)) {
        throw new Error('Expected a JSON object');
    }
    return result;
}
