import { useRef, useState } from "react"
import { DOMAIN } from "../../../globals"
import { usePocket } from "../../../contexts/pocketContext"
import { DateInput } from "../../inputs/DateInput"

export function NewTask({ appID, setCounter, setTrigger }) {

    const [ info, setInfo ] = useState()
    const [ deadline, setDeadline ] = useState(new Date())

    const { pb, user } = usePocket()

    function submit(e) {
        e.preventDefault()

        pb.collection("tasks").create({
            "info": info,
            "deadline": deadline,
            "user": user.id,
            "complete": false,
            "application": appID
        })
        .then(res => {
            setCounter(c => c + 1)
            setTrigger(false)
        })
        .catch(err => {
            console.error("Error creating task", err)
        })

    }

    return (
        <form className="form flex col gap-s" onSubmit={(e) => submit(e)}>
            <div>
                <div>
                    <label>Task</label>
                </div>
                <input type="text" value={info} onChange={e => setInfo(e.target.value)} required />
            </div>
            <div>
                <div>
                    <label>Deadline</label>
                </div>
                <DateInput date={deadline} setDate={setDeadline} />
            </div>
            <div>
                <button type="submit">Save</button>
            </div>
        </form>
    )
}