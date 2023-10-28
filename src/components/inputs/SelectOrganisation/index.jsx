import { useEffect, useState } from "react"
import { DOMAIN } from "../../../globals"

export function SelectOrganisation({ required, selected, setSelected }) {

    const [ orgs, setOrgs ] = useState([])
    const [ custom, setCustom ] = useState('')
    const [ selectedOrg, setSelectedOrg ] = useState(selected)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        fetch(DOMAIN + "/get-organisations")
        .then(res => res.json())
        .then(orgsData => {
            setLoading(false)
            setOrgs(orgsData)
            if(selected in orgsData) {
                setSelectedOrg(selected)
            }
        })
    }, [])

    useEffect(() => {
        if(selectedOrg === "other") {
            setSelected(custom)
        } else {
            setSelected(selectedOrg)
        }
    }, [custom, selectedOrg])

    function setOrg(e) {
        console.log(e.target.value)
        setSelectedOrg(e.target.value)
    }

    return !loading ? (
        <div className="flex col gap-s">
            <select required={required} onInput={e => setOrg(e)}>
                <option>Please Select</option>
                {
                    Object.keys(orgs).map(orgID => {
                        return <option value={orgID} key={orgID}>{orgs[orgID]?.name}</option>
                    })
                }
                <option value="other">Other - Please enter</option>
            </select>

            {
                selectedOrg === "other" ? (
                    <div>
                        <div>
                            <label>Organisation Name</label>
                        </div>
                        <input type="text" value={custom} onInput={e => setCustom(e.target.value)} />
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    ) : (
        <></>
    )
}