import { useEffect, useState } from "react";
import { AcceptedDeclined } from "../../components/ApplicationsList/AcceptedDeclined";
import { Applied } from "../../components/ApplicationsList/Applied";
import { IdeasApplying } from "../../components/ApplicationsList/IdeaApplying";
import { Tabs } from "../../components/Tabs";
import { usePocket } from "../../contexts/pocketContext";
import { useActiveYear } from "../../contexts/activeYearContext";

export function ApplicationsTabs({ counter, setOpenAppID }) {

    const { pb } = usePocket()

    const { activeYear } = useActiveYear()

    const [ ideaApplying, setIdeaApplying ] = useState(0)
    const [ applied, setApplied ] = useState(0)
    const [ acceptedDeclined, setAcceptedDeclined ] = useState(0)

    useEffect(() => {
        pb.collection("stageBreakdown").getFullList()
        .then(totals => {

            let temp = {}

            totals.forEach(row => {
                temp[row.year + "_" + row.stage] = row.count
            })

            setIdeaApplying(temp[activeYear + "_" + "idea"] + temp[activeYear + "_" + "applying"])
            setApplied(temp[activeYear + "_" + "applied"])
            setAcceptedDeclined(temp[activeYear + "_" + "accepted"] + temp[activeYear + "_" + "declined"])
        })
        .catch(err => console.error("Error getting total types by year", err))
    }, [ activeYear, counter ])

    return (
        <Tabs tabs={[
            {
                name: `Idea / Applying ${ideaApplying ? `(${ideaApplying})` : ""}`,
                tab: <IdeasApplying counter={counter} setOpenAppID={setOpenAppID} />
            },
            {
                name: `Applied ${applied ? `(${applied})` : ""}`,
                tab: <Applied counter={counter} setOpenAppID={setOpenAppID} />
            },
            {
                name: `Accepted / Declined ${acceptedDeclined ? `(${acceptedDeclined})` : ""}`,
                tab: <AcceptedDeclined counter={counter} setOpenAppID={setOpenAppID} />
            }
        ]} />
    )
}