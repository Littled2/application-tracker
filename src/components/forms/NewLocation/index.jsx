import { useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function NewLocation({ setTrigger, setLocations, sc }) {

    const { pb, user } = usePocket()

    const [ name, setName ] = useState('')

    const submit = e => {
        e.preventDefault()
        pb.collection("locations").create({
            name: name,
            user: user.id
        })
        .then(res => {
            console.log("Created new location", res)
            setLocations(locs => [ ...locs, res.id ])
            setTrigger(false)
            sc(c => c + 1)
        })
        .catch(err => {
            console.error("Error creating organisation", err)
        })
    }

    return (
        <form className="form">

            <div>
                <label>Location</label>
            </div>
            <div>
                <input value={name} onChange={e => setName(e.target.value)} type="text" />
            </div>

            <br />

            <button onClick={submit}>Submit</button>

        </form>
    )
}