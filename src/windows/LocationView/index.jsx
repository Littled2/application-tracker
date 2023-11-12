import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import ukImage from "./UK.png"
import { DOMAIN } from "../../globals";


const image_locations = {
    "london": [
        "76.39",
        "82.39"
    ],
    "bristol": [
        "55.90",
        "82.23"
    ],
    "exeter": [
        "46.02",
        "89.37"
    ],
    "cardiff": [
        "49.16",
        "81.56"
    ],
    "belfast": [
        "25.54",
        "50.66"
    ],
    "edinburgh": [
        "47.6",
        "35.8"
    ],
    "bournemouth": [
        "60.9",
        "88.6"
    ],
    "glasgow": [
        "38.6",
        "35.8"
    ],
    "manchester": [
        "56.54",
        "62"
    ],
    "nottingham": [
        "66.54",
        "68"
    ],
    "cambridge": [
        "81.54",
        "74.5"
    ],
    "reading": [
        "69.54",
        "83.5"
    ],
    "sheffield": [
        "64.54",
        "63"
    ],
    "southampton": [
        "66.9",
        "87.6"
    ],
    "yeovil": [
        "55.2",
        "87"
    ]
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function LocationView() {

    const [ locations, setLocations ] = useState([])


    const [ hover, setHover ] = useState(null)

    useEffect(() => {
        fetch(DOMAIN + "/get-locations")
        .then(res => res.json())
        .then(locations => setLocations(locations))
        .catch(error => console.error("Error getting locations", error))
    }, [])

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
                <table style={{ fontSize: "0.8rem" }}>
                    <tbody>
                        {
                            Object.keys(locations).map((l,i) => {
                                return (
                                    <tr onMouseEnter={() => mouseOver(l)} onMouseLeave={() => mouseAway(l)} key={l + i}>
                                        <th className={hover !== null ? ((hover === l) ? 'text-orange' : 'text-white') : 'text-white'}>{capitalizeFirstLetter(l)}</th>
                                        <td>{locations[l]}</td>
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
                        Object.keys(locations).map((loc, i) => {

                            if(hover !== null && hover !== loc) return
                            
                            let sizePX = (locations[loc] * 2) + 2

                            return loc in image_locations ? (
                                <div key={i} className={styles.dot} style={{
                                    width: `${sizePX}px`,
                                    height: `${sizePX}px`,
                                    left: `${image_locations[loc][0]}%`,
                                    top: `${image_locations[loc][1]}%`,
                                    transform: `translateY(calc(-${sizePX}px / 2)) translateX(calc(-${sizePX}px / 2))`
                                }}></div>
                            ) : (
                                <></>
                            )
                        })
                    }
                </div>
                <img className={styles.image} src={ukImage} />
            </div>
        </div>
    )
}