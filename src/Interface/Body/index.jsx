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
import { usePocket } from "../../contexts/pocketContext"
import { Login } from "../../components/forms/Login"
import { ApplicationsTabs } from "../../windows/ApplicationsTabs"
import { OpportunitiesTracker } from "../../components/OppourtunitiesTracker"

export function Body({ counter, setCounter }) {

    const { user } = usePocket()

    const [ openAppID, setOpenAppID ] = useState(null)

    return user ? (
        <main className={[ "flex gap-m", styles.wrapper ].join(' ')}>

            <div className="flex col gap-m flex-1">
                <div className={styles.dataVisWrapper}>

                    <LocationView />

                    <StageBreakdown />

                    {
                        openAppID === null ? (
                            <NumbersOverview />
                        ) : (
                            <></>
                        )
                    }

                    {/* {
                        openAppID === null ? (
                            <DeadlinesBreakdown />
                        ) : (
                            <></>
                        )
                    } */}

                </div>

                <div className={styles.tablesWrapper}>
                    <div className={styles.applicationsWrapper} style={{ height: "calc(100vh - 300px)" }}>
                        <ApplicationsTabs counter={counter} setOpenAppID={setOpenAppID}  />
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

                {/* <div>
                    <div className={styles.opportunityWrapper}>

                    </div>
                    <h5>Opportunities Tracker</h5>
                    <div className={styles.applicationsWrapper} style={{ height: "calc(100vh - 300px)" }}>
                        <OpportunitiesTracker />
                    </div>
                </div> */}

            </div>

            {
                openAppID !== null ? (
                    <div className={styles.asidePage}>
                        <ApplicationView counter={counter} setCounter={setCounter} openAppID={openAppID} setOpenAppID={setOpenAppID} />
                    </div>
                ) : (
                    <></>
                )
            }

        </main>
    ) : (
        <main className={styles.loginWrapper}>
            <Login />
        </main>
    )
}