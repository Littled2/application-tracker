import { useState } from "react"
import { AcceptedDeclined } from "../../components/ApplicationsList/AcceptedDeclined"
import { Tabs } from "../../components/Tabs"
import { ApplicationView } from "../../windows/ApplicationView"
import { LocationView } from "../../windows/LocationView"
import { NumbersOverview } from "../../windows/NumbersOverview"
import { StageBreakdown } from "../../windows/StageBreakdown"
import styles from "./styles.module.css"
import { Applied } from "../../components/ApplicationsList/Applied"
import { IdeasApplying } from "../../components/ApplicationsList/IdeaApplying"
import { TodoTasks } from "../../components/TasksList/TodoTasks"
import { DeadlinesBreakdown } from "../../windows/DeadlinesBreakdown"

export function Body({ counter }) {

    const [ openAppID, setOpenAppID ] = useState(null)

    return (
        <main className={[ "flex gap-m", styles.wrapper ].join(' ')}>

            <div className="flex col gap-m flex-1">
                <div className={styles.dataVisWrapper}>

                    <LocationView />

                    <StageBreakdown />

                    {/* <NumbersOverview /> */}

                    <DeadlinesBreakdown />

                </div>

                <div className="flex gap-m">
                    <div className={styles.applicationsWrapper} style={{ height: "calc(100vh - 300px)" }}>
                        <Tabs tabs={[
                            {
                                name: "Idea / Applying",
                                tab: <IdeasApplying counter={counter} setOpenAppID={setOpenAppID} />
                            },
                            {
                                name: "Applied",
                                tab: <Applied counter={counter} setOpenAppID={setOpenAppID} />
                            },
                            {
                                name: "Accepted / Declined",
                                tab: <AcceptedDeclined counter={counter} setOpenAppID={setOpenAppID} />
                            }
                        ]} />
                    </div>

                    {
                        openAppID === null ? (
                            <div className={styles.tasksWrapper}>
                                <b>-</b>
                                <TodoTasks setOpenAppID={setOpenAppID} />
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </div>

            </div>

            {
                openAppID !== null ? (
                    <div className={styles.asidePage}>
                        <ApplicationView openAppID={openAppID} setOpenAppID={setOpenAppID} />
                    </div>
                ) : (
                    <></>
                )
            }

        </main>
    )
}