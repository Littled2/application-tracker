'use client'

import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
    useMemo,
} from "react"

const ActiveYearContext = createContext({})


export const ActiveYearProvider = ({ children }) => {

    const [ activeYear, setActiveYear ] = useState(localStorage.getItem("activeYear"))

    useEffect(() => {
      console.log(activeYear)
      if(activeYear) {
        localStorage.setItem("activeYear", activeYear)
      }
    }, [ activeYear ])

    return (
        <ActiveYearContext.Provider
          value={{ activeYear, setActiveYear }}
        >
          {children}
        </ActiveYearContext.Provider>
      )
}


export const useActiveYear = () => useContext(ActiveYearContext)


