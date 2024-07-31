
export const bodyInspector = (body) => {
    let condition = {
        emptiness: true,
        definition: true
    };
    let keys = [];
    for (let key in body) {
        condition.emptiness = false;
        if (body[key] === undefined || body[key] === '' || body[key] === null) {
            condition.definition = false;
            keys.push(key);
        }
    }

    if (condition.emptiness) {
        return { condition: true, keys: "Body is Empty" };
    }

    if (!condition.definition) {
        return { condition: true, keys: keys };
    }

    return { condition: false };

}