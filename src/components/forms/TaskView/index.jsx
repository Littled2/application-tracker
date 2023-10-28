import { useRef } from "react"
import { DOMAIN } from "../../../globals"

export function TaskView({ task, setTrigger }) {

    const taskRef = useRef()
    const deadlineRef = useRef()
    const completeRef = useRef()

    function submit(e) {
        e.preventDefault()

        fetch(DOMAIN + "/set-task", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskID: task.taskID,
                appID: task.appID,
                info: taskRef.current.value,
                deadline: deadlineRef.current.value,
                complete: completeRef.current.checked,
            })
        })
        .then(res => res.text())
        .then(res => {
            console.log(res)
            setTrigger(false)
        })
        .catch(err => {
            console.error("Error setting task", err)
        })
    }

    return (
        <form className="form flex col gap-s" onSubmit={submit}>
            <div>
                <div>
                    <label>Task</label>
                </div>
                <input type="text" ref={taskRef} defaultValue={task.info} />
            </div>
            <div>
                <div>
                    <label>Deadline</label>
                </div>
                <input type="date" ref={deadlineRef} defaultValue={task.deadline} />
            </div>
            <div>
                <div>
                    <label className="flex align-center">
                        <input ref={completeRef} defaultChecked={task.complete} type="checkbox"/>
                        <span>Complete</span>
                    </label>
                </div>
            </div>
            <div>
                <button type="submit">Save</button>
            </div>
        </form>
    )
}