import { useState } from "react";
import { Body } from "../Body/index.jsx";
import { Header } from "../Header/index.jsx";

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function AppWrapper() {

    const [ counter, setCounter ] = useState(0)

    return (
        <>
        
            <Header counter={counter} setCounter={setCounter} />

            <Body counter={counter} />

        </>
    )
}