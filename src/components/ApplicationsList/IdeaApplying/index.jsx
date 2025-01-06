import { useCallback, useEffect, useState } from "react"
import styles from "./styles.module.css"
import { TableRows } from "../TableRows"
import { TableSection } from "../../TableSection"
import { usePocket } from "../../../contexts/pocketContext"
import { useActiveYear } from "../../../contexts/activeYearContext"
import { useNewApplicationPopup } from "../../../contexts/newApplicationPopupContext"
import { useMasterCounter } from "../../../contexts/masterCounterContext"

export function IdeasApplying({ openAppID, setOpenAppID }) {

    const { setNewApplicationPopupOpen } = useNewApplicationPopup()

    const [ loading, setLoading ] = useState(true)

    const [ ideas, setIdeas ] = useState([])
    const [ applying, setApplying ] = useState([])

    const { activeYear } = useActiveYear()
    const { masterCounter } = useMasterCounter()

    const { pb } = usePocket()

    const [ err, setErr ] = useState(false)

    useEffect(() => {

        getApps()

        pb.collection('applications').subscribe('*', getApps)

        return () => pb.collection('applications').unsubscribe()

    }, [ masterCounter, activeYear ])

    const getApps = () => {
        setLoading(true)
        pb.collection("applications").getFullList({ filter: `year = "${activeYear}" && (stage = "idea" || stage = "applying")`, expand: "locations, organisation", sort: "deadline" })
        .then(apps => {
            setIdeas(apps.filter(app => app.stage === "idea"))
            setApplying(apps.filter(app => app.stage === "applying"))
            setLoading(false)
        })
        .catch(error => {
            console.error("Error getting applications", error)
            setErr(true)
            setLoading(false)
        })
    }


    const handleKeyPress = useCallback(e => {

        if(!openAppID) return

        if(e.key !== "ArrowUp" && e.key !== "ArrowDown") {
            return
        }

        let apps = [ ...ideas, ...applying ]
        let index = apps.findIndex(el => el.id === openAppID)

        if(index === -1) return

        if(e.key === "ArrowUp") {
            e.preventDefault()
            e.stopPropagation()
            
            index = Math.max(index - 1, 0)
        } else if(e.key === "ArrowDown") {
            e.preventDefault()
            e.stopPropagation()

            index = Math.min(index + 1, apps.length - 1)
        }

        setOpenAppID(apps[index].id)
    }, [ openAppID, setOpenAppID ])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [handleKeyPress])




    return !err ? (
        <div className={styles.wrapper}>
            <table>
                <thead className="m-hide">
                    <tr>
                        <th width="12%">Company</th>
                        <th>Name</th>
                        <th className="m-hide" width="6%">Type</th>
                        <th className="m-hide" width="10%">Deadline</th>
                        <th className="m-hide" width="10%">Deadline Type</th>
                    </tr>
                </thead>
                <tbody>

                    <TableSection name="Ideas" amount={ideas.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={ideas} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                    <TableSection name="Applying" amount={applying.length}>
                        <TableRows setOpenAppID={setOpenAppID} openAppID={openAppID} items={applying} showType={true} showDeadline={true} showDeadlineType={true}/>
                    </TableSection>

                </tbody>
            </table>

            <div className={[ styles.key, 'm-hide' ].join(" ")}>
                <span className={styles.late}>Overdue</span>
                <span className={styles.almostLate}>Due today</span>
            </div>

            {
                ideas.length === 0 && applying.length === 0 && !loading && (
                    <div className={styles.statusInfo}>
                        <p>You have no applications yet</p>
                        <button onClick={() => setNewApplicationPopupOpen(true)}>+ New Application</button>
                    </div>
                )
            }

            {
                loading && (
                    <div className={styles.statusInfo}>
                        <p>Loading....</p>
                    </div> 
                )
            }
        </div>
    ) : (
        <p style={{ color: "red" }}>Error</p>
    )
}