import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import { useActiveYear } from "../../contexts/activeYearContext"
import { usePocket } from "../../contexts/pocketContext"

export function NumbersOverview() {

    const [ breakdown, setBreakdown ] = useState({})
    const [ err, setErr ] = useState(false)

    const { pb } = usePocket()

    const { activeYear } = useActiveYear()

    

    useEffect(() => {

        pb.collection("stageBreakdown").getFullList({ filter: `year = "${activeYear}"` })
        .then(res => {

            let freq = {
                idea: 0,
                applying: 0,
                applied: 0,
                accepted: 0,
                declined: 0
            }

            res.forEach(stage => {
                freq[stage.stage] = stage.count
            })

            setBreakdown(freq)
            
        })
        .catch(error => {
            console.error("Error getting stages breakdown", error)
            setErr(true)
        })

    }, [activeYear])

    
    return !err ? (
        <div className={styles.wrapper}>
            <b>Applications by stage</b>
            <table>
                <tbody>
                    <tr>
                        <th>Ideas</th>
                        <td className="text-white">{breakdown?.idea}</td>
                    </tr>
                    <tr>
                        <th>Applying</th>
                        <td className="text-white">{breakdown?.applying}</td>
                    </tr>
                    <tr>
                        <th>Applied</th>
                        <td className="text-white">{breakdown?.applied}</td>
                    </tr>
                    <tr>
                        <th>Accepted</th>
                        <td className="text-green">{breakdown?.accepted}</td>
                    </tr>
                    <tr>
                        <th>Declined</th>
                        <td className="text-red">{breakdown?.declined}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    ) : (
        <p style={{color:"red"}}>Error</p>
    )
}