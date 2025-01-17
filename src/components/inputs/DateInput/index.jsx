import { useEffect, useState } from "react"

export function DateInput({ date, setDate }) {

    const [ dateValue, setDateValue ] = useState("")

    useEffect(() => {
        let parts = date.toLocaleString().slice(0, 10).split("/")
        setDateValue(parts[2] + "-" + parts[1] + "-" + parts[0])
    }, [])

    useEffect(() => {
        setDate(new Date(dateValue + " 23:59:59"))
    }, [ dateValue ])

    return (
        <input type="date" value={dateValue} onClick={e => e.target.click()} onChange={e => setDateValue(e.target.value)} />
    )
}