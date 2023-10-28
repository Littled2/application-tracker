import styles from "./styles.module.css"

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { DOMAIN } from "../../globals";

export function StageBreakdown() {

    const [ amounts, setAmounts ] = useState([ 0, 0, 0 ])
    const [ err, setErr ] = useState(false)

    useEffect(() => {
        fetch(DOMAIN + "/get-totals")
        .then(res => res.json())
        .then(breakdown => {
            setAmounts([ breakdown.idea, breakdown.applying, breakdown.applied ])
        })
        .catch(error => {
            console.error(error)
            setErr(true)
        })
    }, [])
    
    return (
        <div className={styles.wrapper}>
            <b>Pre Final Apps by Stage</b>
            <div className={styles.chart}>
                <Pie data={
                    {
                        labels: ['Idea', 'Applying', 'Applied'],
                        datasets: [
                            {
                                label: '# apps at stage',
                                data: amounts,
                                backgroundColor: [
                                    '#8b0b20',
                                    '#bcb067',
                                    '#00a522'
                                ],
                                borderWidth: 2,
                                borderColor: "transparent"
                            },
                        ]
                    }
                } />
            </div>
        </div>
    )
}