import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { useActiveYear } from "../../contexts/activeYearContext"
import { usePocket } from "../../contexts/pocketContext"
import { useMasterCounter } from "../../contexts/masterCounterContext"
import { DayPicker } from "react-day-picker"
import { areSameDate } from "../../helpers/dates.js"

import 'react-day-picker/style.css';
import { Tooltip } from "react-tooltip"
import { Confirm } from "../../components/forms/Confirm/index.jsx"
import { BsEye } from "react-icons/bs"


export function DeadlinesOverView({ openAppID, setOpenAppID }) {

    const { user, pb } = usePocket()
    const { masterCounter } = useMasterCounter()
    const { activeYear } = useActiveYear()
    const [ err, setErr ] = useState(null)
    const [ modifiers, setModifiers ] = useState()
    const [ upcomingDeadlines, setUpcomingDeadlines ] = useState([])
    const [ hideConfirmOpen, setHideConfirmOpen ] = useState(false)


    useEffect(() => {

        pb.collection("upcomingDeadlines").getFullList({
            filter: `group = '${activeYear}'`
        })
        .then(res => {
            setErr(null)
            setUpcomingDeadlines(res)
            const today = new Date()
            today.setHours(0, 0, 0, 0);
            setModifiers({
                pastDeadlines: res.filter(doc => new Date(doc?.deadline) < today).map(day => new Date(day.deadline)),
                dueMoreThanThreeDays: res.filter(doc => (new Date(doc?.deadline) - today) > 3 * 24 * 60 * 60 * 1000).map(day => new Date(day.deadline)),
                dueThreeDays: res.filter(doc => (new Date(doc?.deadline) - today) <= 3 * 24 * 60 * 60 * 1000 && (new Date(doc?.deadline) - today) > 24 * 60 * 60 * 1000).map(day => new Date(day.deadline)),
                dueToday: res.filter(doc => areSameDate(new Date(), new Date(doc?.deadline))).map(day => new Date(day.deadline))
            })
        })
        .catch(err => {
            console.error("Error fetching deadlines", err)
            setErr(err)
        })
    }, [ masterCounter, activeYear ])
    

    const handleDayClick = (day, modifiers) => {
        if (modifiers.pastDeadlines || modifiers.dueMoreThanThreeDays || modifiers.dueThreeDays || modifiers.dueToday) {

            let applications = upcomingDeadlines.filter(doc => areSameDate(new Date(doc.deadline), day))

            if(applications.length === 0) return

            setOpenAppID(applications[0].id)

        }
    }

    function hideComponent() {
        pb.collection("users").update(user.id, {
            deadlinesView: false
        })
        .then(() => {
            console.log("Hid deadlines card")
         })
         .catch(err =>{
             console.error("Something west wrong hiding deadlines card", err)
         })
    }
    
    return !err ? (
        <div className={[ styles.wrapper, openAppID ? styles.hide : '' ].join(' ')}>
            <div className="flex space-between align-center m-hide">
                <b><small className="text-grey">Application Deadlines</small></b>

                <span
                    className="cursor-pointer text-grey hover-text-orange"
                    data-tooltip-id="hide-deadlines-view-tooltip"
                    data-tooltip-content="Hide deadlines view"
                    data-tooltip-place="bottom"
                    onClick={() => setHideConfirmOpen(true)}
                >
                    <BsEye />
                </span>

                <Tooltip id="hide-deadlines-view-tooltip" />

                <Confirm trigger={hideConfirmOpen} setTrigger={setHideConfirmOpen} onConfirm={hideComponent} message={"Are you sure you want to hide this component? You can always un-hide it in Settings > Dashboard menu"} />

            </div>

            <div className={styles.inner}>
                <DayPicker
                    style={{ maxWidth: "100%" }}
                    modifiers={modifiers}
                    // captionLayout="dropdown-months"
                    modifiersStyles={{
                        pastDeadlines: { backgroundColor: "var(--deadline-passed-bg)" },
                        dueMoreThanThreeDays: { backgroundColor: "var(--deadline-passed-bg)" },
                        dueThreeDays: { backgroundColor: "var(--upcoming-deadline-bg)" },
                        dueToday: { backgroundColor: "var(--almost-late-bg)" }
                    }}
                    classNames={{
                        today: "text-orange",
                        chevron: "cal-chevron"
                    }}
                    styles={{
                        root: { color: 'var(--text-grey)' }
                    }}
                    onDayClick={handleDayClick}
                />
            </div>

            <div className="flex gap-s justify-center">
                <span className={styles.dueToday}>Due today</span>
                <span className={styles.almostDue}>Next 3 days</span>
                <span className={styles.passed}>Passed</span>
            </div>

        </div>
    ) : (
        <p style={{color:"red"}}>Error</p>
    )
}