export function getDate(dateString) {
    return (new Date(dateString)).toLocaleString().slice(0, 10).replace(/\//g, "-")
}