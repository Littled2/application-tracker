import { useCallback, useEffect, useState } from "react";
import { Popup } from "../../components/Popup";
import { NewApp } from "../../components/forms/NewApp";
import { IoTicketOutline } from "react-icons/io5"
import { NewTicket } from "../../components/forms/NewTicket";
import { FiMoon } from "react-icons/fi"
import { BsGear, BsPerson, BsSun } from "react-icons/bs"
import { Settings } from "../../components/Settings";
import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext";
import { NewYears } from "../../components/forms/NewYears";
import { useActiveYear } from "../../contexts/activeYearContext";
import { useNewApplicationPopup } from "../../contexts/newApplicationPopupContext";
import { Groups } from "../../components/Groups";

export function Header() {

    const { pb, user } = usePocket()

    const { newApplicationPopupOpen, setNewApplicationPopupOpen} = useNewApplicationPopup()

    const [ newTicketOpen, setNewTicketOpen ] = useState(false)
    const [ settingsOpen, setSettingsOpen ] = useState(false)

    const { years, setActiveYear, activeYear } = useActiveYear()

    const handleKeyPress = useCallback(e => {
        if(e.ctrlKey && e.key === "b") {
            e.preventDefault()
            e.stopPropagation()
            
            setNewApplicationPopupOpen(true)
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
        <>
            <div className={styles.header}>
                <header className="flex gap-s align-center space-between">
                    {
                        user ? (
                            years.length > 0 ? (
                                <>

                                    <div className={[ "m-show-block", styles.mobileGroupsSelect ].join(" ")}>
                                        <select onInput={e => setActiveYear(e.target.value)}>
                                            {
                                                years.map(year => {
                                                    return <option key={'_dd_' + year.id} selected={activeYear === year.id} value={year.id}>{year.year}</option>
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div>
                                        <button className={styles.newAppButton} onClick={() => setNewApplicationPopupOpen(true)}>
                                            <span>+ New Application</span>
                                            <span className={[ styles.keyIndicators, 'windows-only' ].join(' ')}>
                                                <span>ctrl</span>
                                                +
                                                <span>b</span>    
                                            </span>
                                        </button>
                                    </div>

                                    <div className="m-hide">
                                        <Groups groups={years} />
                                    </div>

                                    <div className="flex">
                                        <button className="m-hide" onClick={() => setNewTicketOpen(true)}>
                                            <IoTicketOutline/>
                                            <span>Contact support</span>
                                        </button>
                                        {/* <button onClick={() => setLightTheme(!lightTheme)}>
                                            {
                                                !lightTheme ? (
                                                    <FiMoon />
                                                ) : (
                                                    <BsSun />
                                                )
                                            }
                                        </button> */}
                                        <button onClick={() => setSettingsOpen(true)}>
                                            <BsGear />
                                        </button>
                                    </div>       
                                </>
                            ) : (
                                <>
                                    <br />
                                    <button onClick={() => setSettingsOpen(true)}>
                                        <BsGear />
                                    </button>
                                </>
                            )
                        ) : (
                            <></>
                        )
                    }
                </header>
            </div>

            <Popup title={"Contact Support"} trigger={newTicketOpen} setTrigger={setNewTicketOpen}>
                <NewTicket setTrigger={setNewTicketOpen} />
            </Popup>

            <Popup title={"Settings"} trigger={settingsOpen} setTrigger={setSettingsOpen}>
                <Settings setTrigger={setSettingsOpen} />
            </Popup>

        </>
    )
}