import { useState } from "react"
import { TableRows } from "../TableRows"
import { useEffect } from "react"
import { TableSection } from "../../TableSection"
import { DOMAIN } from "../../../globals"


export function Applied({ counter, setOpenAppID }) {

    const [ applied, setApplied ] = useState([])

    const [ err, setErr ] = useState(false)

    useEffect(() => {
        fetch(DOMAIN + "/get-pre-applications")
        .then(res => res.json())
        .then(apps => {
            setApplied(apps.filter(app => app.stage === "applied"))
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

                <TableSection name="Applied" amount={applied.length}>
                <TableRows setOpenAppID={setOpenAppID} items={applied} showType={true} showDeadline={true} showDeadlineType={true}/>
                </TableSection>

            </tbody>
        </table>
    ) : (
        <p className="text-red">Error</p>
    )
}