import { useEffect, useState } from "react"
import { TableSection } from "../../TableSection"
import { TableRows } from "../../ApplicationsList/TableRows"
import { Popup } from "../../Popup"
import { TaskView } from "../../forms/TaskView"
import { usePocket } from "../../../contexts/pocketContext"
import { getDate } from "../../../helpers/dates"


export function AppTasksList({ appID, counter, setCounter }) {

    const [ popupOpen, setPopupOpen ] = useState(false)
    const [ selectedTask, setSelectedTask ] = useState(null)

    const [ todoTasks, setTodoTasks ] = useState([])
    const [ completeTasks, setCompleteTasks ] = useState([])

    const { pb } = usePocket()

    useEffect(() => {

        pb.collection("tasks").getFullList({ sort: "deadline", filter: "complete = false" })
        .then(tasks => {
            console.log(tasks)
            setTodoTasks(tasks)
        })
        .catch(err => console.error("Error getting TODO tasks", err))

        pb.collection("tasks").getFullList({ sort: "deadline", filter: "complete = true" })
        .then(tasks => {
            console.log(tasks)
            setCompleteTasks(tasks)
        })
        .catch(err => console.error("Error getting complete tasks", err))

    }, [ appID, counter ])

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th style={{ maxWidth: "15px" }}></th>
                        <th>Task</th>
                        <th>Dln</th>
                    </tr>
                </thead>
                <tbody>

                    <TableSection name={"TODO"} amount={todoTasks.length}>
                        {
                            todoTasks.filter(t => t.complete === false).map(task => {
                                return (
                                    <tr
                                    className="cursor-pointer"
                                    key={task.taskID}
                                    onClick={() => {
                                        setSelectedTask(task)
                                        setPopupOpen(true)
                                    }}
                                    >
                                        <td>
                                            <input type="checkbox" checked={task?.complete} />
                                        </td>
                                        <td>{task?.info}</td>
                                        <td>{getDate(task?.deadline)}</td>
                                    </tr>
                                )
                            })
                        }
                    </TableSection>

                    <TableSection name={"Complete"} defaultOpen={false} amount={completeTasks.length}>
                        {
                            completeTasks.filter(t => t.complete === true).map(task => {
                                return (
                                    <tr
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSelectedTask(task)
                                        setPopupOpen(true)
                                    }} key={task.taskID}>
                                        <td>
                                            <input type="checkbox" checked={task?.complete} />
                                        </td>
                                        <td>{task?.info}</td>
                                        <td>{getDate(task?.deadline)}</td>
                                    </tr>
                                )
                            })
                        }
                    </TableSection>

                </tbody>
            </table>


            <Popup title="Task View" trigger={popupOpen} setTrigger={setPopupOpen}>
                {
                    selectedTask !== null ? (
                        <TaskView task={selectedTask} setTrigger={setPopupOpen} counter={counter} setCounter={setCounter} />
                    ) : (
                        <></>
                    )
                }
            </Popup>
        </>
    )
}