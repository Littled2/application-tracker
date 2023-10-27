import { useState } from "react";
import { Popup } from "../../components/Popup";
import { NewApp } from "../../components/forms/NewApp";
import { IoTicketOutline } from "react-icons/io5"
import { NewTicket } from "../../components/forms/NewTicket";
import { FiMoon } from "react-icons/fi"
import { BsSun } from "react-icons/bs"

export function Header({ counter, setCounter }) {

    const [ newAppOpen, setNewAppOpen ] = useState(false)
    const [ newTicketOpen, setNewTicketOpen ] = useState(false)
    const [ lightTheme, setLightTheme ] = useState(false)

    return (
        <>

            {
                lightTheme ? (
                    <link rel="stylesheet" href="/light-theme.css" />
                ) : (
                    <></>
                )
            }

            <header className="flex gap-s align-center space-between">
                <div>
                    <button onClick={() => setNewAppOpen(true)}>New Application +</button>
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
                </div>
            </header>



            <Popup title={"New Application"} trigger={newAppOpen} setTrigger={setNewAppOpen}>
                <NewApp setTrigger={setNewAppOpen} counter={counter} setCounter={setCounter} />
            </Popup>

            <Popup title={"New Ticket"} trigger={newTicketOpen} setTrigger={setNewTicketOpen}>
                <NewTicket setTrigger={setNewTicketOpen} />
            </Popup>
        </>
    )
}