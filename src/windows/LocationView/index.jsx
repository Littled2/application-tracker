import { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"
import ukImage from "./UK.png"
import { DOMAIN } from "../../globals";
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function LocationView() {

    const { pb } = usePocket()

    const { activeYear } = useActiveYear()

    const [ hover, setHover ] = useState(null)

    const [ appLocations, setAppLocations ] = useState([])

    const table = useRef()

    useEffect(() => {
        
        pb.collection("locationsOfApplications").getFullList({ expand: "locations", filter: `year = "${activeYear}"` })
        .then(items => {

            let map = {}

            items.forEach(item => {

                if(!("expand" in item)) {
                    return
                }

                item.expand.locations.forEach(loc => {
                    if(loc.id in map) {
                        map[loc.id].freq += 1
                    } else {
                        map[loc.id] = {
                            ...loc,
                            freq: 1
                        }
                    }
                })
            })

            setAppLocations(map)
        })
        .catch(error => console.error("Error getting locations", error))

    }, [ activeYear ])


    function mouseOver(loc) {
        setHover(loc)
    }

    function mouseAway(loc) {
        setHover(null)
    }

    return (
        <div className={styles.wrapper}>
            <div>
                <b>Locations</b>
                <table style={{ fontSize: "0.8rem" }} ref={table}>
                    <tbody>
                        {
                            Object.keys(appLocations).map((locID, i) => {
                                return (
                                    <tr onMouseEnter={() => mouseOver(locID)} onMouseLeave={() => mouseAway(locID)} key={locID + i}>
                                        <th className={hover !== null ? ((hover === locID) ? 'text-orange' : 'text-white') : 'text-white'}>{appLocations[locID].freq}</th>
                                        <td>{appLocations[locID].name}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className={styles.imageWrapper}>
                <div className={styles.dotsWrapper}>
                    {
                        Object.keys(appLocations).map((locID, i) => {

                            const loc = appLocations[locID]

                            if(hover !== null && hover !== locID) return
                            
                            let sizePX = (loc.freq * 2) + 2

                            return (
                                <div key={i} className={styles.dot} style={{
                                    width: `${sizePX}px`,
                                    height: `${sizePX}px`,
                                    left: `${loc.distX}%`,
                                    top: `${loc.distY}%`,
                                    transform: `translateY(calc(-${sizePX}px / 2)) translateX(calc(-${sizePX}px / 2))`
                                }}></div>
                            )
                        })
                    }
                </div>
                <img className={styles.image} src={ukImage} />
            </div>
        </div>
    )
}