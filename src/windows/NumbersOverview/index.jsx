import { useEffect, useState } from "react"
import styles from "./styles.module.css"

export function NumbersOverview() {

    const [ breakdown, setBreakdown ] = useState({})
    const [ err, setErr ] = useState(false)

    useEffect(() => {
        fetch("http://localhost:4000/get-totals")
        .then(res => res.json())
        .then(breakdownData => {
            setBreakdown(breakdownData)
        })
        .catch(error => {
            console.error(error)
            setErr(true)
        })
    }, [])

    
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