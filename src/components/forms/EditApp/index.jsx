import { useEffect, useState } from "react";
import { SelectOrganisation } from "../../inputs/SelectOrganisation";
import { DOMAIN } from "../../../globals";

export function EditApp({ app, setTrigger, fetchApp }) {

    const [ org, setOrg ] = useState(app?.orgID ? app?.orgID : '')

    const [ name, setName ] = useState(app?.name ? app?.name : '')
    const [ info, setInfo ] = useState(app?.info ? app?.info : '')
    const [ deadlineType, setDeadlineType ] = useState(app?.deadlineTypes ? app?.deadlineTypes : '')
    const [ deadline, setDeadline ] = useState(app?.deadline ? app?.deadline : '')
    const [ locations, setLocations ] = useState(app?.locations.join(","))
    const [ type, setType ] = useState(app?.type ? app?.type : '')
    const [ stage, setStage ] = useState(app?.stage ? app?.stage : '')

    function submit(e) {
        e.preventDefault()

        e.preventDefault()
        
        fetch(DOMAIN + "/set-app?appID=" + app.id,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: app.id,
                name: name,
                info: info,
                orgID: org,
                stage: stage,
                type: type,
                locations: locations,
                deadlineType: deadlineType,
                deadline: deadline,
            })
        })
        .then(res => res.text())
        .then(res => {
            console.log(res)
            fetchApp()
            setTrigger(false)
        })
        .catch(err => {
            console.error(err)
        })

        setTrigger(false)
    }

    function handleStageChange(e) {
        setStage(e.target.value)
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
            <div className="flex col">
                <label className="flex align-center"><input onChange={handleStageChange} defaultChecked={app?.stage === "idea"} type="radio" name="Idea" value="idea"/><span>Idea</span></label>
                <label className="flex align-center"><input onChange={handleStageChange} defaultChecked={app?.stage === "applying"} type="radio" name="Idea" value="applying"/><span>Applying</span></label>
                <label className="flex align-center"><input onChange={handleStageChange} defaultChecked={app?.stage === "applied"} type="radio" name="Idea" value="applied"/><span>Applied</span></label>
                <label className="flex align-center"><input onChange={handleStageChange} defaultChecked={app?.stage === "accepted"} type="radio" name="Idea" value="accepted"/><span>Accepted</span></label>
                <label className="flex align-center"><input onChange={handleStageChange} defaultChecked={app?.stage === "declined"} type="radio" name="Idea" value="declined"/><span>Declined</span></label>
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