import { BiX } from "react-icons/bi"
import styles from "./styles.module.css"
import { useEffect, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"

export function LocationsSelect({ locations, setLocations, c }) {

    const { pb } = usePocket()

    const [ allLocations, setAllLocations ] = useState([])

    useEffect(() => {
        pb.collection("locations").getFullList({ sort: "name"})
        .then(locs => setAllLocations(locs))
        .catch(err => console.error("Error getting locations", err))
    }, [c])

    const getLoc = (id) => {
        return allLocations.filter(l => l.id === id)[0]
    }

    const removeLoc = (locID) => {
        let tempLocations = JSON.parse(JSON.stringify(locations))
        tempLocations.splice(tempLocations.indexOf(locID), 1)
        setLocations(tempLocations)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.locations}>
                {
                    locations.map((locID, i) => {
                        return (
                            <div key={i}>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    removeLoc(locID)
                                }}>
                                    <BiX />
                                </button>
                                <span>
                                    {getLoc(locID)?.name}
                                </span>
                            </div>
                        )
                    })
                }

                <select onChange={e => setLocations(l => [ ...l, e.target.value ])}>
                    {
                        allLocations.filter(location => !locations.some((selected) => selected.id === location.id)).map(location => {
                            return (
                                <option value={location.id}>{location.name}</option>
                            )
                        })
                    }
                </select>
            </div>

            {/* <div className={styles.add}>
                <span>Add location</span>

            </div> */}
        </div>
    )
}