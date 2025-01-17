import { useCallback, useEffect, useState } from "react"
import styles from "./styles.module.css"
import { Popup } from "../../components/Popup"
import { EditApp } from "../../components/forms/EditApp"
import { AppTasksList } from "../../components/TasksList/AppTasksList"
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { usePocket } from "../../contexts/pocketContext"
import { DocumentUploadDownload } from "./DocumentUploadDownload"
import { useActiveYear } from "../../contexts/activeYearContext"
import { Confirm } from "../../components/forms/Confirm"
import { BiChevronLeft, BiPencil } from "react-icons/bi"
import { usePopupsContext } from "../../contexts/popupsContext"
import { useMasterCounter } from "../../contexts/masterCounterContext"
import { Deadline } from "../../components/Deadline"
import { useMobile } from "../../contexts/mobileContext"

export function ApplicationView({ openAppID, setOpenAppID, counter, setCounter }) {

    const { setPopups, openPopup } = usePopupsContext()

    useEffect(() => {
        if(openAppID) {
            openPopup(setOpenAppID)
        } else {
            setPopups(prev => prev.filter(item => item !== setOpenAppID))
        }
    }, [ openAppID ])

    const [ application, setApplication ] = useState({})
    const [ err, setErr ] = useState(false)
    const [ loading, setLoading ] = useState(true)

    const [ editAppOpen, setEditAppOpen ] = useState()
    const [ confirmOpen, setConfirmOpen ] = useState(false)

    const { activeYear } = useActiveYear()

    const { pb } = usePocket()

    const { setMasterCounter, masterCounter } = useMasterCounter()

    const { isMobile } = useMobile()

    const [ uploadCVReminder, setUploadCVReminder ] = useState(false)


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
        
    }, [ openAppID, activeYear, masterCounter ])



    const deleteApplication = useCallback(() => {
        pb.collection('applications').delete(openAppID)
        .then(() => {
            setOpenAppID(null)
            setMasterCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Error deleting application", err)
            alert("Error deleting application. See console devtools for more information.")
        })
    }, [ pb, openAppID ])

    const handleKeyPress = useCallback(e => {
        if(e.key === "Delete") {
            e.preventDefault()
            e.stopPropagation()
            setConfirmOpen(true)
        }
    }, [ setConfirmOpen ])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    function handleStageChange(e) {
        if((application.stage === 'idea' || application.stage === 'applying') && e.target.value === 'applied') {
            setUploadCVReminder(true)
        }
        pb.collection("applications").update(application.id, { stage: e.target.value })
        .then(() => {
            setMasterCounter(c => c + 1)
        })
        .catch(err => {
            console.error("Something went wrong whilst setting application stage", err)
        })
    }

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
                    {
                        !isMobile ? (
                            <AiOutlineClose />
                        ) : (
                            <BiChevronLeft />
                        )
                    }
                </button>
            </div>

            <div className={styles.inner}>
                {
                    !err ? (
                        !loading ? (
                            <div className="flex col gap-m">

                                <div>
                                    <h4 className="text-white flex align-center space-between gap-s">
                                        {application?.role}
                                        <span className="cursor-pointer hover-text-orange" onClick={() => setEditAppOpen(true)}><BiPencil /></span>
                                    </h4>
                                    <hr/>
                                </div>

                                <Popup title={"Edit Application"} trigger={editAppOpen} setTrigger={setEditAppOpen}>
                                    <EditApp setTrigger={setEditAppOpen} app={application}/>
                                </Popup>

                                <div className={styles.tablesWrapper}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="text-white">Company</td>
                                                <td className={styles.mobileTextRight}>{application?.expand?.organisation?.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-white">Location(s)</td>
                                                <td className={styles.mobileTextRight}>
                                                    {
                                                        application?.expand?.locations?.map((loc, i) => <span key={"____" + loc?.id}>{loc?.name}{i < application?.expand?.locations.length - 1 ? ", " : ""}</span>)
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="text-white">Deadline Type</td>
                                                <td className={styles.mobileTextRight}>{application?.deadlineType ? application?.deadlineType : "-"}</td>
                                            </tr>
                                            <tr>
                                                {
                                                    application?.deadlineType === "fixed" ? (
                                                        <>
                                                            <td className="text-white">Deadline</td>
                                                            <td className={styles.mobileTextRight}>{application?.deadline ? <Deadline highlight={application?.stage === "idea" || application?.stage === "applying"} deadline={application?.deadline} /> : "-"}</td>       
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
                                            <tr className={styles.documentRow}>
                                                <td className="text-white">CV</td>
                                                <td>
                                                    <DocumentUploadDownload displayName={"CV"} application={application} fileKeyName={"cv"} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table>
                                        <tbody>
                                            <tr className={styles.documentRow}>
                                                <td className="text-white">Cover Letter</td>
                                                <td>
                                                    <DocumentUploadDownload displayName={"Cover Letter"} application={application} fileKeyName={"coverLetter"} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex gap-s flex-col">
                                    <p className="text-white">Application Stage</p>
                                    <div className={styles.stages}>
                                        <select value={application?.stage} onChange={handleStageChange} className={styles.stageSelect}>
                                            <option value="idea">Idea</option>
                                            <option value="applying">Applying</option>
                                            <option value="applied">Applied</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="declined">Decline</option>
                                        </select>
                                    </div>
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
                                        <p className="text-white">Other Info</p>
                                        {/* <span className="cursor-pointer text-white" onClick={() => setEditAppOpen(true)}><BiPencil /></span> */}
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

            <Popup trigger={uploadCVReminder} setTrigger={setUploadCVReminder}>
                <div className="flex flex-col gap-m">
                    <h3 className="text-white">Have you uploaded your CV?</h3>
                    <p className="text-grey">If you have adapted your CV for this application or written a cover letter, make sure to save it here to track what {application?.expand?.organisation?.name} received.</p>
                    <button className="m-submit-btn" onClick={() => setUploadCVReminder(false)}>OK</button>
                </div>
            </Popup>

            <Confirm message={"Are you sure you want to delete this application?"} trigger={confirmOpen} setTrigger={setConfirmOpen} onConfirm={deleteApplication} />

        </section>
    )
}