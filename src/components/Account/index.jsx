import styles from "./styles.module.css"
import { BiEdit, BiLogOut } from "react-icons/bi"
import { usePocket } from "../../contexts/pocketContext"
import { useEffect, useState } from "react"
import { FiDelete } from "react-icons/fi"
import { BsTrash } from "react-icons/bs"
import { useActiveYear } from "../../contexts/activeYearContext"
import { Popup } from "../Popup"
import { Confirm } from "../forms/Confirm"

export function Account({ setTrigger }) {

    const { logout } = usePocket()
    const { pb } = usePocket()

    const [ years, setYears ] = useState([])
    const [ edit, setEdit ] = useState()
    const [ toDelete, setToDelete ] = useState()

    const { clearActiveYears } = useActiveYear()

    useEffect(() => {
        pb.collection("years").getFullList()
        .then(yrs => setYears(yrs))
        .catch(err => console.error("Error getting years", err))

        pb.collection('years').subscribe('*', () => {

            pb.collection("years").getFullList()
            .then(yrs => setYears(yrs))
            .catch(err => console.error("Error getting years", err))

        }, { /* other options like expand, custom headers, etc. */ });

        return () => pb.collection('years').unsubscribe()
    }, [])


    return (
        <section className={styles.wrapper}>
            <div className={styles.section}>
                <h5>Groups you have registered</h5>
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
                                            <button onClick={() => setEdit(yr)}><BiEdit /></button>
                                        </td>
                                        <td>
                                            <button onClick={() => setToDelete(yr)}><BsTrash /></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className={styles.section}>
                <h5>Log out of your account</h5>
                <button onClick={() => {
                    setTrigger(false)
                    logout()
                    clearActiveYears()
                }}><BiLogOut /> Logout</button>
            </div>



            {
                edit && (
                    <Popup trigger={edit} setTrigger={setEdit}>
                        <div className={styles.section}>
                            <h5>Change name</h5>

                            <div>
                                <input type="text" value={edit?.year} onInput={e => setEdit(val => {
                                    return {
                                        ...val,
                                        year: e.target.value
                                    }
                                })} />
                            </div>

                            <button
                                onClick={() => {
                                    pb.collection("years").update(edit?.id, {
                                        year: edit?.year
                                    }).then(() => setEdit(null))
                                }}
                            >Save</button>
                        </div>
                    </Popup>
                )
            }

            {
                toDelete && (
                    <Confirm message={"Are you sure you want to delete " + toDelete?.year} trigger={toDelete} setTrigger={setToDelete} onConfirm={() => {
                            pb.collection("years").delete(toDelete?.id)
                            .then(() => setToDelete(null))
                        }}
                    />
                )
            }
        </section>
    )
}