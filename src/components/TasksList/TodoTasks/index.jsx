import { useEffect, useState } from "react"
import { TableSection } from "../../TableSection"
import { DOMAIN } from "../../../globals"
import styles from "./styles.module.css"

export function TodoTasks({ setOpenAppID }) {

    const [ todoTasks, setTodoTasks ] = useState([])
    const [ completeTasks, setCompleteTasks ] = useState([])

    useEffect(() => {
        fetch(DOMAIN + "/get-tasks")
        .then(res => res.json())
        .then(tasksData => {
            setTodoTasks(tasksData.filter(task => task.complete === false))
            setCompleteTasks(tasksData.filter(task => task.complete === true))
        })
    }, [])

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Deadline</th>
                        <th style={{width:"1.5rem"}} className="text-center">T</th>
                    </tr>
                </thead>
                <tbody>

                    <TableSection name={"TODO"} amount={todoTasks.length}>
                        {
                            todoTasks.filter(t => t.complete === false).map(task => {

                                const diff = (new Date().getTime() - (1000*60*60*24)) - new Date(task?.deadline).getTime()

                                return (
                                    <tr
                                        className="cursor-pointer"
                                        key={task.taskID}
                                        onClick={() => setOpenAppID(task.appID)}
                                    >
                                        <td>{task?.info}</td>
                                        <td
                                            className={diff > 0 ? styles.late : ''}
                                        >{task?.deadline}</td>
                                        <td className="text-center">{task?.app?.type === "placement" ? "P" : "I"}</td>
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
                                        key={task.taskID}
                                        onClick={() => setOpenAppID(task.appID)}
                                    >
                                        <td>{task?.info}</td>
                                        <td>{task?.deadline}</td>
                                    </tr>
                                )
                            })
                        }
                    </TableSection>

                </tbody>
            </table>
        </>
    )
}