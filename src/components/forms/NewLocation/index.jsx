import { useEffect, useRef, useState } from "react"
import { usePocket } from "../../../contexts/pocketContext"
import ukImage from "./UK.png"
import styles from "./styles.module.css"

export function NewLocation({ setTrigger, setLocations, sc }) {

    const { pb, user } = usePocket()

    const [ name, setName ] = useState('')

    const [ distX, setDistX ] = useState(50)
    const [ distY, setDistY ] = useState(50)

    const newInput = useRef()

    useEffect(() => newInput.current.focus(), [])

    const submit = e => {
        e.preventDefault()
        pb.collection("locations").create({
            name: name,
            user: user.id,
            distX,
            distY
        })
        .then(res => {
            console.log("Created new location", res)
            setLocations(locs => [ ...locs, res.id ])
            setTrigger(false)
            sc(c => c + 1)
        })
        .catch(err => {
            console.error("Error creating organisation", err)
        })
    }

    return (
        <form className="form">

            <div>
                <label>Location name</label>
            </div>
            <div>
                <input ref={newInput} value={name} onChange={e => setName(e.target.value)} type="text" required />
            </div>

            <br /><br />

            <div style={{ position: "sticky", top: "0px", zIndex: "100", textAlign: "center" }}>
                <label>Please click on the map to mark where this location is</label>
            </div>

            <div>
                <div className={styles.imageWrapper} onClick={e => {

                    const rect = e.target.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top

                    setDistY((y / rect.height) * 100)
                    setDistX((x / rect.width) * 100)
                }}>
                    <div className={styles.dotsWrapper}>
                        
                            <div className={styles.dot} style={{
                                    width: `8px`,
                                    height: `8px`,
                                    left: `${distX}%`,
                                    top: `${distY}%`,
                                    transform: `translateY(calc(-8px / 2)) translateX(calc(-8px / 2))`
                                }}></div>
                            </div>

                    <img className={styles.image} src={ukImage} />
                </div>
            </div>

            <button onClick={submit}>Submit</button>

        </form>
    )
}