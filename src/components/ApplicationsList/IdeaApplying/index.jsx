import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { TableRows } from "../TableRows"
import { TableSection } from "../../TableSection"
import { DOMAIN } from "../../../globals"

export function IdeasApplying({ counter, setOpenAppID }) {

    const [ ideas, setIdeas ] = useState([])
    const [ applying, setApplying ] = useState([])

    const [ err, setErr ] = useState(false)

    useEffect(() => {
        fetch(DOMAIN + "/get-pre-applications")
        .then(res => res.json())
        .then(apps => {
            setIdeas(apps.filter(app => app.stage === "idea"))
            setApplying(apps.filter(app => app.stage === "applying"))
        })
        .catch(error => {
            console.error(error)
            setErr(true)
        })
    }, [counter])


    return !err ? (
        <table>
            <thead>
                <tr>
                    <th width="12%">Company</th>
                    <th>Name</th>
                    <th width="6%">Type</th>
                    <th width="10%">Dln</th>
                    <th width="6%">Dln Type</th>
                </tr>
            </thead>
            <tbody>

                <TableSection name="Ideas" amount={ideas.length}>
                    <TableRows setOpenAppID={setOpenAppID} items={ideas} showType={true} showDeadline={true} showDeadlineType={true}/>
                </TableSection>

                <TableSection name="Applying" amount={applying.length}>
                    <TableRows setOpenAppID={setOpenAppID} items={applying} showType={true} showDeadline={true} showDeadlineType={true}/>
                </TableSection>

            </tbody>
        </table>
    ) : (
        <p style={{ color: "red" }}>Error</p>
    )
}