import { useState } from "react";
import { Body } from "../Body/index.jsx";
import { Header } from "../Header/index.jsx";
import { PocketProvider } from "../../contexts/pocketContext.jsx"

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ActiveYearProvider } from "../../contexts/activeYearContext.jsx";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function AppWrapper() {

    const [ counter, setCounter ] = useState(0)

    return (
        <PocketProvider>
            <ActiveYearProvider>

                <Header counter={counter} setCounter={setCounter} />

                <Body counter={counter} setCounter={setCounter} />
                
            </ActiveYearProvider>
        </PocketProvider>
    )
}