import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"

export function AppsDeadlinesChart() {

    const [ chartData, setChartData ] = useState(null)


    useEffect(() => {

        let a = new Date()
        const days = []
        
        for (let i = 0; i < 14; i++) {
            let b = new Date()
            b.setDate(a.getDate() + i)
            days.push(b.toISOString().slice(0, 10))
        }
    
        let days_map = {}

        days.forEach(day => {
            days_map[day] = [0, 0, 0]
        })

        fetch("http://localhost:4000/get-all-apps-deadline")
        .then(res => res.json())
        .then(tasksData => {
            tasksData.forEach(app => {

                if(!(app.deadline in days_map)) return

                // Has the task been completed?
                if(app.stage === "idea") {
                    // idea
                    days_map[app.deadline][0] += 1
                } else if (app.stage === "applying") {
                    // applying
                    days_map[app.deadline][1] += 1
                } else {
                    // applied / accepted / declined
                    days_map[app.deadline][2] += 1
                }
            })


            setChartData({
                labels: days.map(d => d.substr(d.length-2, 2)),
                datasets: [
                    {
                        label: '# Idea',
                        data: days.map(day => days_map[day][0]),
                        backgroundColor: '#8b0b20',
                    },
                    {
                        label: '# Applying',
                        data: days.map(day => days_map[day][1]),
                        backgroundColor: '#bcb067',
                    },
                    {
                        label: '# Applied / Accepted / Declined',
                        data: days.map(day => days_map[day][1]),
                        backgroundColor: '#00a522',
                    }
                ]
            })
        })
    }, [])


    const options = {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                ticks: { display: false }
            },
            y: {
                stacked: true,
            },
        }
    }
    
    return chartData !== null ? (
        <div>
            <b><small>App Deadlines (Nxt 14d)</small></b>
            <div style={{maxHeight:"100%"}}>
                <Bar options={options} data={chartData} />
            </div>
        </div>
    ) : (
        <></>
    )
}