import { useState } from "react"
import { TableRows } from "../TableRows"
import { useEffect } from "react"
import { TableSection } from "../../TableSection"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { usePocket } from "../../../contexts/pocketContext"


export function Applied({ counter, setOpenAppID }) {

    const [ applied, setApplied ] = useState([])

    const [ err, setErr ] = useState(false)

    const { activeYear } = useActiveYear()

    const { pb } = usePocket()

    useEffect(() => {
        pb.collection("applications").getFullList({ filter: `year = "${activeYear}" && stage = "applied"`, expand: "locations, organisation" })
        .then(apps => {
            setApplied(apps)
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

                <TableSection name="Applied" amount={applied.length}>
                    <TableRows setOpenAppID={setOpenAppID} items={applied} showType={true} showDeadline={true} showDeadlineType={true}/>
                </TableSection>

            </tbody>
        </table>
    ) : (
        <p className="text-red">Error</p>
    )
}