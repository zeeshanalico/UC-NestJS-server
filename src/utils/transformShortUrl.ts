export const transformShortUrl = (url: string): string => {
    return `${process.env.MY_BASE_URL || `http://localhost:3001`}/redirect/${url}`;
}

//Primitive types in JavaScript include number, string, boolean, null, undefined, symbol, and bigint. When you pass a primitive type to a function, you are passing a copy of the value. 
// The existing 'logo_path' variable is reassigned with a new value
//in js strings are immutable so it will create new string
export const transformLogoPath = (logo_path: string): string => {
    logo_path = logo_path.split('logos')[1].replace(/\\/g, '/')
    return `${process.env.MY_BASE_URL || `http://localhost:3001`}${logo_path}`
}