import styles from "./styles.module.css"

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { DOMAIN } from "../../globals";



const barChartOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    responsive: true,
    scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        },
    }
}






export function StageBreakdown() {

    const [ amounts, setAmounts ] = useState([ 0, 0, 0 ])
    const [ err, setErr ] = useState(false)

    const [ barChartData, setBarChartData ] = useState(null)

    useEffect(() => {
        fetch(DOMAIN + "/get-totals")
        .then(res => res.json())
        .then(data => {
            setAmounts([
                data.internships.idea + data.placements.idea,
                data.internships.applying + data.placements.applying,
                data.internships.applied + data.placements.applied,
            ])


            setBarChartData({
                labels: [ "Ida", "Apl", "Apd" ],
                datasets: [
                    {
                        label: 'Internships - Idea Stage',
                        data: [ data.internships.idea, 0, 0],
                        backgroundColor: '#4a010d',
                    },
                    {
                        label: 'Placements - Idea Stage',
                        data: [ data.placements.idea, 0, 0],
                        backgroundColor: '#8b0b20',
                    },
                    {
                        label: 'Internships - Applying Stage',
                        data: [ 0, data.internships.applying, 0],
                        backgroundColor: '#554e28',
                    },
                    {
                        label: 'Placements - Applying Stage',
                        data: [ 0, data.placements.applying, 0],
                        backgroundColor: '#bcb067',
                    },
                    {
                        label: 'Internships - Applied Stage',
                        data: [ 0, 0, data.internships.applied],
                        backgroundColor: '#015312',
                    },
                    {
                        label: 'Placements - Applied Stage',
                        data: [ 0, 0, data.placements.applied],
                        backgroundColor: '#00a522',
                    }
                ]
            })


        })
        .catch(error => {
            console.error(error)
            setErr(true)
        })
    }, [])
    
    return (
        <div className={styles.outer}>
            <div className={styles.wrapper}>
                <div className="flex col gap-s">
                    <b><small>Pre Final Apps by Stage</small></b>
                    <div className={styles.chart}>
                        <Pie
                        options={{
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                        }}
                        data={
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
                <div className="flex col gap-s">
                    <b><small>Pre Final Apps Plc/Int</small></b>
                    {
                        barChartData ? (
                            <div className={styles.chart}>
                                <Bar options={barChartOptions} data={barChartData} />
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>
            <div className="flex gap-s justify-center">
                <b style={{ padding: "0 4px", backgroundColor: "#8b0b20", color: "black" }}><small>Idea</small></b>
                <b style={{ padding: "0 4px", backgroundColor: "#bcb067", color: "rgb(52 49 32)" }}><small>Applying</small></b>
                <b style={{ padding: "0 4px", backgroundColor: "#00a522", color: "rgb(8 59 19)" }}><small>Applied</small></b>
            </div>
        </div>
    )
}