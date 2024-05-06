import { useEffect, useState } from "react";
import { Popup } from "../../components/Popup";
import { NewApp } from "../../components/forms/NewApp";
import { IoTicketOutline } from "react-icons/io5"
import { NewTicket } from "../../components/forms/NewTicket";
import { FiMoon } from "react-icons/fi"
import { BsPerson, BsSun } from "react-icons/bs"
import { Account } from "../../components/Account";
import { BiPlus } from "react-icons/bi";
import styles from "./styles.module.css"
import { usePocket } from "../../contexts/pocketContext";
import { NewYears } from "../../components/forms/NewYears";
import { useActiveYear } from "../../contexts/activeYearContext";

export function Header({ counter, setCounter }) {

    const { pb, user } = usePocket()

    const [ newAppOpen, setNewAppOpen ] = useState(false)
    const [ newTicketOpen, setNewTicketOpen ] = useState(false)
    const [ accountOpen, setAccountOpen ] = useState(false)
    const [ newYearOpen, setNewYearOpen ] = useState(false)

    const [ lightTheme, setLightTheme ] = useState(false)

    const { activeYear, setActiveYear, years } = useActiveYear()


    return (
        <>

            {
                lightTheme ? (
                    <link rel="stylesheet" href="/light-theme.css" />
                ) : (
                    <></>
                )
            }

            <div className={styles.header}>
                <header className="flex gap-s align-center space-between">
                    {
                        user ? (
                            years.length > 0 ? (
                                <>
                                    <div>
                                        <button onClick={() => setNewAppOpen(true)}>New Application +</button>
                                    </div>

                                    <div className={styles.years}>
                                        {
                                            years.map((y, i) => {
                                                return (
                                                    <button className={y.id === activeYear ? styles.selected : ""} key={i} onClick={() => setActiveYear(y.id)}>{y?.year}</button>
                                                )
                                            })
                                        }

                                        <button onClick={() => setNewYearOpen(true)}><BiPlus /></button>
                                    </div>

                                    <div>
                                        <button onClick={() => setNewTicketOpen(true)}><IoTicketOutline/></button>
                                        <button onClick={() => setLightTheme(!lightTheme)}>
                                            {
                                                !lightTheme ? (
                                                    <FiMoon />
                                                ) : (
                                                    <BsSun />
                                                )
                                            }
                                        </button>
                                        <button onClick={() => setAccountOpen(true)}>
                                            <BsPerson />
                                        </button>
                                    </div>       
                                </>
                            ) : (
                                <>
                                    <br />
                                    <button onClick={() => setAccountOpen(true)}>
                                        <BsPerson />
                                    </button>
                                </>
                            )
                        ) : (
                            <></>
                        )
                    }
                </header>
            </div>



            <Popup title={"New Application"} trigger={newAppOpen} setTrigger={setNewAppOpen}>
                <NewApp setTrigger={setNewAppOpen} counter={counter} setCounter={setCounter} />
            </Popup>

            <Popup title={"New Ticket"} trigger={newTicketOpen} setTrigger={setNewTicketOpen}>
                <NewTicket setTrigger={setNewTicketOpen} />
            </Popup>

            <Popup title={"Account"} trigger={accountOpen} setTrigger={setAccountOpen}>
                <Account setTrigger={setAccountOpen} />
            </Popup>

            <Popup title={"New Year"} trigger={newYearOpen} setTrigger={setNewYearOpen}>
                <NewYears setTrigger={setNewYearOpen} />
            </Popup>
        </>
    )
}