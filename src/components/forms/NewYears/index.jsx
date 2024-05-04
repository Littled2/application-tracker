import { useCallback, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function NewYears({ setTrigger }) {

    const { pb, user } = usePocket()

    const [ yearNames, setYearNames ] = useState()
    const [ year, setYear ] = useState()

    const submit = useCallback((e) => {
        e.preventDefault()
        
        pb.collection('years').create({
            "user": user.id,
            "year": year
        })
        .then(() => setTrigger(false))

    }, [ year, user ])

    return (
        <form onSubmit={submit} className="form flex col gap-s">

            <div>
                <label>Year names</label>
                <div>
                    <input value={year} onChange={e => setYear(e.target.value)} type="text" required />
                </div>
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>

        </form>
    )
}