import { useState } from "react"
import { TableRows } from "../TableRows"
import styles from "./styles.module.css"
import { useEffect } from "react"
import { TableSection } from "../../TableSection"
import { DOMAIN } from "../../../globals"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { usePocket } from "../../../contexts/pocketContext"


export function AcceptedDeclined({ counter, setOpenAppID }) {

    const [ accepted, setAccepted ] = useState([])
    const [ declined, setDeclined ] = useState([])

    const [ err, setErr ] = useState(false)


    const { activeYear } = useActiveYear()

    const { pb } = usePocket()

    useEffect(() => {
    
            pb.collection("applications").getFullList({ filter: `year = "${activeYear}" && (stage = "accepted" || stage = "declined")`, expand: "locations, organisation", sort: "deadline" })
            .then(apps => {
                setAccepted(apps.filter(app => app.stage === "accepted"))
                setDeclined(apps.filter(app => app.stage === "declined"))
            })
            .catch(error => {
                console.error("Error getting applications", error)
                setErr(true)
            })
    }, [counter, activeYear])

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

                <TableSection name="Accepted" amount={accepted.length}>
                    <TableRows setOpenAppID={setOpenAppID} items={accepted} showType={true} showDeadline={true} showDeadlineType={true}/>
                </TableSection>

                <TableSection name="Declined" amount={declined.length}>
                    <TableRows setOpenAppID={setOpenAppID} items={declined} showType={true} showDeadline={true} showDeadlineType={true}/>
                </TableSection>

            </tbody>
        </table>
    ) : (
        <p className="text-red">Error</p>
    )
}