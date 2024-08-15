export const transformShortUrl = (url: string) => {
    return `${process.env.MY_BASE_URL ||`http://localhost:3001`}/redirect/${url}`;
}