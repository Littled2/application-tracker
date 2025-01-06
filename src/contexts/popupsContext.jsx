import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

const PopupContext = createContext({})


export const PopupContextProvider = ({ children }) => {


    const [ popups, setPopups ] = useState([])


    const closeTopPopup = useCallback(() => {
            
        if(popups.length === 0) {
            return
        }

        const setTrigger = popups[popups.length - 1]
        setTrigger(false)

        // Remove the last element from the array
        setPopups(prev => prev.slice(0, -1))

    }, [ popups, setPopups ])


    const handleKeyPress = useCallback(e => {
        if(e.key === "Escape") {
            closeTopPopup()
        }
    }, [ closeTopPopup ])


    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])



    useEffect(() => {
        const handleBackNavigation = (event) => {
          if (popups.length > 0) {
            event.preventDefault()
            // Trigger your custom function or prevent back navigation
            console.log('Back navigation prevented because popups is empty!')
            window.history.pushState(null, '', window.location.href)

            closeTopPopup()
          } else {
            console.log('Back navigation allowed because popups is not empty!')
          }
        };
    
        const onPopState = (event) => {
          handleBackNavigation(event)
        };
    
        // Push a dummy state and set up the listener
        window.history.pushState(null, '', window.location.href)
        window.addEventListener('popstate', onPopState)
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('popstate', onPopState)
        }

    }, [ popups ]);
    

    useEffect(() => {
        console.log("popups list has changed", {popups})
    }, [ popups ])


    return (
        <PopupContext.Provider
          value={{ popups, setPopups }}
        >
          {children}
        </PopupContext.Provider>
      )
}


export const usePopupsContext = () => useContext(PopupContext)


