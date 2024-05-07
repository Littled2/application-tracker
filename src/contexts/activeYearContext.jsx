'use client'

import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
    useMemo,
} from "react"
import { usePocket } from "./pocketContext"

const ActiveYearContext = createContext({})


export const ActiveYearProvider = ({ children }) => {

    const [ activeYear, setActiveYear ] = useState(localStorage.getItem("activeYear"))
    const [ years, setYears ] = useState([])

    const { pb, user } = usePocket()

    useEffect(() => {

      if(!user) return

      if(activeYear) {
        localStorage.setItem("activeYear", activeYear)
      }

      pb.collection('years').subscribe('*', getYears)

      getYears()

      return () => pb.collection('years').unsubscribe()

    }, [ activeYear, user ])

    const getYears = () => {
      pb.collection("years").getFullList()
      .then(years => {
          setYears(years)

          if(!activeYear && years.length > 0) {
            setActiveYear(years[0].id)
          }
      })
      .catch(err => {
          console.error("Error getting years", err)
      })
    }

    const clearActiveYears = useCallback(() => {
      setYears([])
    }, [years])

    return (
        <ActiveYearContext.Provider
          value={{ activeYear, setActiveYear, years, clearActiveYears }}
        >
          {children}
        </ActiveYearContext.Provider>
      )
}


export const useActiveYear = () => useContext(ActiveYearContext)


