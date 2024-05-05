import { useRef } from "react"

export function NewTicket({ setTrigger }) {

    const ticketRef = useRef()

    function submit(e) {
        e.preventDefault()

        console.log("New Ticket")
    }

    return (
        <form className="form flex col gap-s" onSubmit={submit}>
            <div>
                <div>
                    <label>Engineering Ticket</label>
                </div>
                <input type="text" ref={ticketRef} />
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}