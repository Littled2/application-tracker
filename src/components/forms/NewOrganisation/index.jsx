import { useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function NewOrganisation({ setTrigger, setSelectedOrgID, sc }) {

    const { pb, user } = usePocket()

    const [ name, setName ] = useState('')

    const submit = e => {
        e.preventDefault()
        pb.collection("organisations").create({
            name: name,
            user: user.id
        })
        .then(res => {
            console.log(res)
            setSelectedOrgID(res.id)
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
                <label>Organisation</label>
            </div>
            <div>
                <input value={name} onChange={e => setName(e.target.value)} type="text" />
            </div>

            <br />

            <button onClick={submit}>Submit</button>

        </form>
    )
}