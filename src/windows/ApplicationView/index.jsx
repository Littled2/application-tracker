import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { Popup } from "../../components/Popup"
import { NewTask } from "../../components/forms/NewTask"
import { LiaEdit } from "react-icons/lia"
import { EditApp } from "../../components/forms/EditApp"
import { AppTasksList } from "../../components/TasksList/AppTasksList"
import { AiOutlineClose } from "react-icons/ai"
import { usePocket } from "../../contexts/pocketContext"
import { getDate } from "../../helpers/dates"
import { DocumentUploadDownload } from "./DocumentUploadDownload"
import { useActiveYear } from "../../contexts/activeYearContext"

export function ApplicationView({ openAppID, setOpenAppID, counter, setCounter }) {

    const [ application, setApplication ] = useState({})
    const [ err, setErr ] = useState(false)

    const [ newTaskOpen, setNewTaskOpen ] = useState()
    const [ editAppOpen, setEditAppOpen ] = useState()

    const { activeYear } = useActiveYear()

    const { pb } = usePocket()

    useEffect(() => {

        if(!openAppID) return

        pb.collection("applications").subscribe(openAppID, e => {
            setApplication(e.record)
        }, { expand:"locations, organisation" })

        pb.collection("applications").getOne(openAppID, { expand:"locations, organisation" })
        .then(app => {

            // If the year has changed, close the tab
            if(activeYear !== app.year) {
                setOpenAppID(null)
            }

            setApplication(app)
            setCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error getting application", err)
            setErr(true)
        })

    }, [ openAppID, editAppOpen, activeYear ])


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
                                    {application?.role}
                                </h4>
                                <hr/>
                            </div>
                            
                            <Popup title={"Edit Application"} trigger={editAppOpen} setTrigger={setEditAppOpen}>
                                <EditApp setTrigger={setEditAppOpen} app={application}/>
                            </Popup>
        
                            <div className="flex gap-s">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="text-white">Company</td>
                                            <td>{application?.expand?.organisation?.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-white">Location(s)</td>
                                            <td>
                                                {
                                                    application?.expand?.locations?.map((loc, i) => <span key={i}>{loc?.name}{i < application?.expand?.locations.length - 1 ? ", " : ""}</span>)
                                                }
                                            </td>
                                        </tr>
                                        <tr><td><br /></td></tr>
                                        <tr>
                                            <td className="text-white">CV</td>
                                            <td>
                                                <DocumentUploadDownload application={application} fileKeyName={"cv"} />
                                            </td>
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
                                            {
                                                application?.deadlineType === "fixed" ? (
                                                    <>
                                                        <td className="text-white">Deadline</td>
                                                        <td>{application?.deadline ? getDate(application?.deadline) : "-"}</td>       
                                                    </>
                                                ) : (
                                                    <>
                                                        <td><br /></td>
                                                        <td><br /></td>
                                                    </>
                                                )
                                            }
                                        </tr>
                                        <tr><td><br /></td></tr>
                                        <tr>
                                            <td className="text-white">Cover Letter</td>
                                            <td>
                                                <DocumentUploadDownload application={application} fileKeyName={"coverLetter"} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>


                            {/* <div className="flex gap-s">
                                {
                                    linkText !== "" ? (
                                        <LinkView linkText={"Hello"} link={"df"} />
                                    ) : (
                                        <></>
                                    )
                                }
                            </div> */}
        
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
                                    
                                    <AppTasksList counter={counter} setCounter={setCounter} appID={application.id} />

                                    <div>
                                        <button className={styles.newTask} onClick={() => setNewTaskOpen(true)}>Add Task +</button>

                                        <Popup title={"Create Task"} trigger={newTaskOpen} setTrigger={setNewTaskOpen}>
                                            <NewTask appID={application.id} counter={counter} setCounter={setCounter} setTrigger={setNewTaskOpen} />
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