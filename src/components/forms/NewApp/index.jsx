import { useEffect, useState } from "react";
import { SelectOrganisation } from "../../inputs/SelectOrganisation";

export function NewApp({ setTrigger, setCounter, counter }) {

    const [ org, setOrg ] = useState(null)

    useEffect(() => {
        console.log("org", org)
    }, [org])

    const [ name, setName ] = useState('')
    const [ info, setInfo ] = useState('')
    const [ deadlineType, setDeadlineType ] = useState('')
    const [ deadline, setDeadline ] = useState('')
    const [ locations, setLocations ] = useState('')
    const [ type, setType ] = useState('')

    function submit(e) {
        e.preventDefault()
        
        fetch("http://localhost:4000/new-app",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                info: info,
                orgID: org,
                stage: "idea",
                type: type,
                locations: locations,
                deadlineType: deadlineType,
                deadline: deadline,
            })
        })
        .then(res => res.text())
        .then(res => {
            console.log(res)
            setTrigger(false)
            setCounter(counter + 1)
        })
        .catch(err => {
            console.error(err)
        })

        setTrigger(false)
    }

    return (
        <form className="form flex col gap-s" onSubmit={submit}>
            <div>
                <div>
                    <label>Name</label>
                </div>
                <input type="text" required value={name} onInput={e => setName(e.target.value)}/>
            </div>
            <div>
                <div>
                    <label>Organisation</label>
                </div>
                <SelectOrganisation required selected={org} setSelected={setOrg} />
            </div>
            <div>
                <div>
                    <label>Info</label>
                </div>
                <textarea value={info} onInput={e => setInfo(e.target.value)}></textarea>
            </div>
            <div className="flex gap-s">
                <div>
                    <div>
                        <label>Deadline Type</label>
                    </div>
                    <select value={deadlineType} onInput={e => setDeadlineType(e.target.value)}>
                        <option value="">Please Select</option>
                        <option value="rolling">Rolling</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>
                <div>
                    <div>
                        <label>Deadline</label>
                    </div>
                    <input type="date" value={deadline} onInput={e => setDeadline(e.target.value)}/>
                </div>
            </div>
            <div>
                <div>
                    <label>Location(s) (comma separated)</label>
                </div>
                <input type="text" value={locations} onInput={e => setLocations(e.target.value)}/>
            </div>
            <div>
                <div>
                    <label>Application Type</label>
                </div>
                <select required value={type} onInput={e => setType(e.target.value)}>
                    <option>Please Select</option>
                    <option value="placement">Placement</option>
                    <option value="internship">Internship</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}