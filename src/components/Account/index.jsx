import styles from "./styles.module.css"
import { BiEdit, BiLogOut } from "react-icons/bi"
import { usePocket } from "../../contexts/pocketContext"
import { useEffect, useState } from "react"
import { FiDelete } from "react-icons/fi"
import { BsTrash } from "react-icons/bs"
import { useActiveYear } from "../../contexts/activeYearContext"

export function Account({ setTrigger }) {

    const { logout } = usePocket()
    const { pb } = usePocket()

    const [ years, setYears ] = useState([])

    const { clearActiveYears } = useActiveYear()

    useEffect(() => {
        pb.collection("years").getFullList()
        .then(yrs => setYears(yrs))
        .catch(err => console.error("Error getting years", err))
    }, [])


    return (
        <section className={styles.wrapper}>
            {/* <div>
                <p>Years you have registered</p>
                <table>
                    <thead>
                        <th>Year</th>
                        <th>Rename</th>
                        <th>Delete</th>
                    </thead>
                    <tbody>
                        {
                            years.map(yr => {
                                return (
                                    <tr>
                                        <td>{yr.year}</td>
                                        <td>
                                            <button><BiEdit /></button>
                                        </td>
                                        <td>
                                            <button><BsTrash /></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div> */}
            <div>
                <p>Log out of your account</p>
                <button onClick={() => {
                    setTrigger(false)
                    logout()
                    clearActiveYears()
                }}><BiLogOut /> Logout</button>
            </div>
        </section>
    )
}