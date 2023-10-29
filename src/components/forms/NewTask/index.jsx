import { useRef } from "react"
import { DOMAIN } from "../../../globals"

export function NewTask({ appID, counter, setCounter, setTrigger }) {

    const taskRef = useRef()
    const deadlineRef = useRef()

    function submit(e) {
        e.preventDefault()

        const newTask = {
            appID: appID,
            info: taskRef.current.value,
            deadline: deadlineRef.current.value
        }

        fetch(DOMAIN + "/new-task", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(res => {
            console.log(res)
            setCounter(counter + 1)
            setTrigger(false)
        })
        .catch(err => {
            console.error("Error setting task", err)
        })

    }

    return (
        <form className="form flex col gap-s" onSubmit={(e) => submit(e)}>
            <div>
                <div>
                    <label>Task</label>
                </div>
                <input type="text" ref={taskRef} required />
            </div>
            <div>
                <div>
                    <label>Deadline</label>
                </div>
                <input type="date" ref={deadlineRef} required />
            </div>
            <div>
                <button type="submit">Save</button>
            </div>
        </form>
    )
}