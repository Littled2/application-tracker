import { useRef } from "react"

export function NewTicket({ setTrigger }) {

    const ticketRef = useRef()

    function submit(e) {
        e.preventDefault()

        fetch("http://localhost:4000/new-ticket", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ticket: ticketRef.current.value
            })
        })
        .then(res => res.text())
        .then(res => {
            console.log(res)
            setTrigger(false)
        })
        .catch(err => {
            console.error("Error setting task", err)
        })
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