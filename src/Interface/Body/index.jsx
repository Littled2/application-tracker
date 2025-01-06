import { useCallback, useEffect, useState } from "react"
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
import { AuthenticationWrapper } from "../AuthenticationWrapper"
import { useActiveYear } from "../../contexts/activeYearContext"
import { NewYears } from "../../components/forms/NewYears"

export function Body({ counter, setCounter }) {

    const { user } = usePocket()

    const { years } = useActiveYear()

    const [ openAppID, setOpenAppID ] = useState(null)

    const { activeYear } = useActiveYear()

    return (
        activeYear ? (
            <main className={[ "flex gap-m", styles.wrapper ].join(' ')}>

                <div className={styles.applicationsTasksWrapper}>
                    <div className={styles.dataVisWrapper}>

                        <LocationView />

                        <StageBreakdown />

                        {
                            !openAppID ? (
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
                            <h3 className="m-show-block">Your Applications</h3>
                            <ApplicationsTabs setOpenAppID={setOpenAppID} openAppID={openAppID} />
                        </div>

                        {
                            !openAppID ? (
                                <div className={styles.tasksWrapper}>
                                    {/* <b>-</b> */}
                                    <h3 className="m-show-block">Your tasks</h3>
                                    <b className="m-hide">Track tasks for each application</b>
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
                    openAppID ? (
                        <div className={styles.asidePage}>
                            <ApplicationView counter={counter} setCounter={setCounter} openAppID={openAppID} setOpenAppID={setOpenAppID} />
                        </div>
                    ) : (
                        <></>
                    )
                }

            </main>
        ) : (
            <p style={{ textAlign: "center", marginTop: "12%" }}>Please select an application group at the top of the screen.</p>
        )
    )
}