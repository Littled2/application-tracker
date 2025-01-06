import { useCallback, useEffect, useState } from "react"
import styles from "./styles.module.css"
import { Popup } from "../../components/Popup"
import { NewTask } from "../../components/forms/NewTask"
import { LiaEdit } from "react-icons/lia"
import { EditApp } from "../../components/forms/EditApp"
import { AppTasksList } from "../../components/TasksList/AppTasksList"
import { AiFillEdit, AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { usePocket } from "../../contexts/pocketContext"
import { getDate } from "../../helpers/dates"
import { DocumentUploadDownload } from "./DocumentUploadDownload"
import { useActiveYear } from "../../contexts/activeYearContext"
import { Confirm } from "../../components/forms/Confirm"
import { BiPen, BiPencil } from "react-icons/bi"
import { usePopupsContext } from "../../contexts/popupsContext"

export function ApplicationView({ openAppID, setOpenAppID, counter, setCounter }) {

    const { setPopups } = usePopupsContext()

    useEffect(() => {
        if(openAppID) {
            setPopups(p => [ ...p, setOpenAppID ])
        } else {
            setPopups(prev => prev.filter(item => item !== setOpenAppID))
        }
    }, [ openAppID ])

    const [ application, setApplication ] = useState({})
    const [ err, setErr ] = useState(false)
    const [ loading, setLoading ] = useState(true)

    const [ newTaskOpen, setNewTaskOpen ] = useState()
    const [ editAppOpen, setEditAppOpen ] = useState()
    const [ confirmOpen, setConfirmOpen ] = useState(false)

    const { activeYear } = useActiveYear()

    const { pb } = usePocket()


    useEffect(() => {

        if(!openAppID) return

        setLoading(true)


        pb.collection("applications").getOne(openAppID, { expand:"locations, organisation" })
        .then(app => {

            // If the year has changed, close the tab
            if(activeYear !== app.year) {
                setOpenAppID(null)
            }

            setApplication(app)
            setCounter(c => c + 1)
            setLoading(false)
        })
        .catch(err => {
            console.error("Error getting application", err)
            setErr(true)
            setLoading(false)
        })



        pb.collection("applications").subscribe("*", e => {
            console.log("LIVE Changes", e)
            setApplication(e.record)
        }, { expand:"locations, organisation" })

        return () => {
            pb.collection('applications').unsubscribe()
        }
        
    }, [ openAppID, activeYear ])



    const deleteApplication = useCallback(() => {
        pb.collection('applications').delete(openAppID)
        .then(() => {
            setOpenAppID(null)
        })
        .catch(err => {
            console.error("Error deleting application", err)
            alert("Error deleting application. See console devtools for more information.")
        })
    }, [ pb, openAppID ])

    const handleKeyPress = useCallback(e => {
        if(e.ctrlKey && e.key === "q") {
            e.preventDefault()
            e.stopPropagation()
            
            setNewTaskOpen(true)
        }
    }, [])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])


    return (
        <section className={styles.window}>
            <div className={styles.topBar}>

                <div className="flex">
                    <button className={styles.close} onClick={() => setConfirmOpen(true)}>
                        <AiOutlineDelete />
                    </button>
                    <button className={styles.close} onClick={() => setEditAppOpen(true)}>
                        <AiOutlineEdit />
                    </button>
                </div>

                <button className={styles.close} onClick={() => setOpenAppID(null)}>
                    <AiOutlineClose />
                </button>
            </div>

            <div className={styles.inner}>
                {
                    !err ? (
                        !loading ? (
                            <div className="flex col gap-s">

                                <div>
                                    <h4 className="text-white flex align-center gap-s">
                                        <span className="cursor-pointer" onClick={() => setEditAppOpen(true)}><BiPencil /></span>
                                        {application?.role}
                                    </h4>
                                    <hr/>
                                </div>

                                <Popup title={"Edit Application"} trigger={editAppOpen} setTrigger={setEditAppOpen}>
                                    <EditApp setTrigger={setEditAppOpen} app={application}/>
                                </Popup>

                                <div className="flex gap-s m-flex-col">
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
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex gap-s m-flex-col">
                                    <table>
                                        <tbody>
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
                                                <td className="text-white">Cover Letter</td>
                                                <td>
                                                    <DocumentUploadDownload application={application} fileKeyName={"coverLetter"} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {
                                    application?.link && (
                                        <div>
                                            <p className="text-white">Link</p>
                                            <a className={styles.link} rel="noreferrer" target="_blank" href={application?.link}>{application?.link}</a>
                                        </div>
                                    )
                                }

                                <div>
                                    <div className="flex space-between">
                                        <p className="text-white">Info</p>
                                        <span className="cursor-pointer text-white" onClick={() => setEditAppOpen(true)}><BiPencil /></span>
                                    </div>
                                    <pre style={{fontFamily:"inherit", whiteSpace:"pre-wrap", wordWrap:"break-word", margin:"0" }}>{application?.info}</pre>
                                </div>

                                <div>
                                    <div>
                                        <h4 className="text-white">Tasks</h4>
                                        <hr/>
                                    </div>

                                    <AppTasksList counter={counter} setCounter={setCounter} application={application} />

                                </div>

                                </div>
                        ) : (
                            <p className="text-center text-grey">Loading...</p>
                        )    
                    ) : (
                        <p className="text-red">Error</p>
                    )
                    
                }

            </div>

            <Confirm message={"Are you sure you want to delete this application?"} trigger={confirmOpen} setTrigger={setConfirmOpen} onConfirm={deleteApplication} />

        </section>
    )
}