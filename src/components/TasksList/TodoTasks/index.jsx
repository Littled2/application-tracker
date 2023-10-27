import { useEffect, useState } from "react"
import { TableSection } from "../../TableSection"

export function TodoTasks({ setOpenAppID }) {

    const [ todoTasks, setTodoTasks ] = useState([])
    const [ completeTasks, setCompleteTasks ] = useState([])

    useEffect(() => {
        fetch("http://localhost:4000/get-tasks")
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
                                        onClick={() => setOpenAppID(task.appID)}
                                    >
                                        <td>{task?.info}</td>
                                        <td>{task?.deadline}</td>
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