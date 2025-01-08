import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
    useMemo,
} from "react"
import styles from "./activeYearContext.module.css"
import { usePocket } from "./pocketContext"
import { NewYears } from "../components/forms/NewYears"
import { useMasterCounter } from "../contexts/masterCounterContext"

const ActiveYearContext = createContext({})


export const ActiveYearProvider = ({ children }) => {

    const [ activeYear, setActiveYear ] = useState(localStorage.getItem("activeYear"))
    const [ years, setYears ] = useState([])

    const [ loading, setLoading ] = useState(true)

    const { pb, user } = usePocket()
	const { masterCounter } = useMasterCounter()

    useEffect(() => {

		if(!user) return

		if(activeYear) {
			localStorage.setItem("activeYear", activeYear)
		}

		pb.collection("years").getFullList({
			sort: "order,created"
		})
		.then(yrs => {

		setLoading(false)

			setYears(yrs)

			if(!activeYear && years.length > 0) {
			setActiveYear(years[0].id)
			}

		})
		.catch(err => {
			console.error("Error getting years", err)
			setLoading(false)
		})

		pb.collection('years').subscribe('*', (change) => {

			pb.collection("years").getFullList({
				sort: "order"
			})
			.then(yrs => {

				setYears(yrs)

				if(!activeYear && yrs.length > 0) {
				setActiveYear(yrs[0].id)
				}
			})
			.catch(err => console.error("Error getting years", err))

		});

		return () => pb.collection('years').unsubscribe()

    }, [ activeYear, user, masterCounter ])

    const clearActiveYears = useCallback(() => {
      setYears([])
    }, [years])

    return !loading ? (
      years.length > 0 ? (
        <ActiveYearContext.Provider
          value={{ activeYear, setActiveYear, years, clearActiveYears }}
        >
          {children}
        </ActiveYearContext.Provider>
      ) : (
        <div className={styles.noYearsWrapper}>

          <h3>Your applications are grouped into 'groups' that you create.</h3>
          <p>Create one now to begin tracking you applications.</p>

          <NewYears />

        </div>
      )
    ) : (
      <div className={styles.loadingWrapper}>
        <img className={styles.logo} src="/exeter application tracker logo.png" alt="Exeter Application Tracker logo" />
      </div>
    )
}


export const useActiveYear = () => useContext(ActiveYearContext)


