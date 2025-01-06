import { useEffect, useState } from "react"
import { TableSection } from "../../TableSection"
import styles from "./styles.module.css"
import { usePocket } from "../../../contexts/pocketContext"
import { getDate } from "../../../helpers/dates"
import { useActiveYear } from "../../../contexts/activeYearContext"

export function TodoTasks({ setOpenAppID }) {

    const [ todoTasks, setTodoTasks ] = useState([])
    const [ completeTasks, setCompleteTasks ] = useState([])

    const { activeYear } = useActiveYear()

    const { pb } = usePocket()

    useEffect(() => {

        pb.collection("tasks").getFullList({ sort: "deadline", filter: `application.year = '${activeYear}' && complete = false` })
        .then(tasks => {
            setTodoTasks(tasks)
        })
        .catch(err => {
            console.error("Error getting TODO tasks", err)
        })

        pb.collection("tasks").getFullList({ sort: "deadline", filter: `application.year = '${activeYear}' && complete = true` })
        .then(tasks => {
            setCompleteTasks(tasks)
        })
        .catch(err => {
            console.error("Error getting complete tasks", err)
        })

    }, [activeYear])

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Deadline</th>
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
                                        key={'_' + task.taskID}
                                        onClick={() => setOpenAppID(task.application)}
                                    >
                                        <td>{task?.info}</td>
                                        <td
                                            className={diff > 0 ? styles.late : ''}
                                        >{getDate(task?.deadline)}</td>
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
                                        key={'__' + task.taskID}
                                        onClick={() => setOpenAppID(task.application)}
                                    >
                                        <td>{task?.info}</td>
                                        <td>{getDate(task?.deadline)}</td>
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