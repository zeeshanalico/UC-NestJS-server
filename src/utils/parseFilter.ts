// ?page=1&limit=5&
// filter=pregenerated:true;logo=null&sort_by=asc

export function parseFilters(filterString: string) {
    const filters: any = {};

    if (filterString) {
        const filterPairs = filterString.split(';');
        filterPairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            if (value === 'null') {
                filters[key] = null;
            } else if (value === 'true' || value === 'false') {
                filters[key] = value === 'true';
            } else {
                filters[key] = value;
            }
        });
    }
    return filters;
}