import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { Popup } from "../../components/Popup"
import { NewTask } from "../../components/forms/NewTask"
import { LiaEdit } from "react-icons/lia"
import { EditApp } from "../../components/forms/EditApp"
import { AppTasksList } from "../../components/TasksList/AppTasksList"
import { DOMAIN } from "../../globals"
import { AiOutlineClose } from "react-icons/ai"

export function ApplicationView({ openAppID, setOpenAppID }) {

    const [ application, setApplication ] = useState({})
    const [ err, setErr ] = useState(false)

    const [ newTaskOpen, setNewTaskOpen ] = useState()
    const [ editAppOpen, setEditAppOpen ] = useState()

    useEffect(() => {

        if(newTaskOpen) return

        fetchApp()

    }, [ openAppID ])

    function fetchApp() {
        fetch(DOMAIN + "/get-application?id=" + openAppID)
        .then(res => res.json())
        .then(appData => {
            setApplication(appData)
        })
        .catch(error => {
            console.error(error)
            setErr(true)
        })
    }


    return (
        <section className={styles.window}>
            <div className={styles.topBar}>
                <button className={styles.close} onClick={() => setOpenAppID(null)}>
                    <AiOutlineClose />
                </button>
            </div>

            <div className={styles.inner}>
                {
                    !err ? (
                        <div className="flex col gap-s">

                            <div>
                                <h4 className="text-white flex align-center gap-s">
                                    <span onClick={() => setEditAppOpen(true)}><LiaEdit /></span>
                                    {application?.name}
                                </h4>
                                <hr/>
                            </div>
                            
                            <Popup title={"Edit Application"} trigger={editAppOpen} setTrigger={setEditAppOpen}>
                                <EditApp fetchApp={fetchApp} setTrigger={setEditAppOpen} app={application}/>
                            </Popup>
        
                            <div className="flex gap-s">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="text-white">Company</td>
                                            <td>{application?.org?.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-white">Location(s)</td>
                                            <td>{application?.locations?.join(", ")}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="text-white">Deadline Type</td>
                                            <td>{application?.deadlineType ? application?.deadlineType : "-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-white">Deadline</td>
                                            <td>{application?.deadline ? application?.deadline : "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
        
                            <div>
                                <p className="text-white">Info</p>
                                <pre style={{fontFamily:"inherit", whiteSpace:"pre-wrap", wordWrap:"break-word", margin:"0" }}>{application?.info}</pre>
                            </div>
        
                            <div>
                                <div>
                                    <h4 className="text-white">Tasks</h4>
                                    <hr/>
                                </div>
                                <div className="flex col gap-s">
                                    
                                    <AppTasksList appID={application.id} />

                                    <div>
                                        <button className={styles.newTask} onClick={() => setNewTaskOpen(true)}>Add Task +</button>

                                        <Popup title={"Create Task"} trigger={newTaskOpen} setTrigger={setNewTaskOpen}>
                                            <NewTask appID={application.id} fetchApp={fetchApp} setTrigger={setNewTaskOpen} />
                                        </Popup>
                                    </div>
                                </div>
                            </div>

                        </div>
    
                    ) : (
                        <p className="text-red">Error</p>
                    )
                    
                }

            </div>
        </section>
    )
}