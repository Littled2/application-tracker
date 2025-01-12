import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
    useMemo,
} from "react";
import PocketBase from "pocketbase";
import { useInterval } from "usehooks-ts";
import {jwtDecode} from "jwt-decode";
import ms from "ms";
import { AuthenticationWrapper } from "../Interface/AuthenticationWrapper";

// const BASE_URL = "http://127.0.0.1:8090";
// const BASE_URL = "http://localhost:8090";
// const BASE_URL = "http://192.168.1.169:8090";
const BASE_URL = "http://192.168.1.196:8090";
// const BASE_URL = "http://192.168.43.9:8090"

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

const PocketContext = createContext({});




export const PocketProvider = ({ children }) => {

    const pb = useMemo(() => new PocketBase(BASE_URL), [])
    
    const [token, setToken] = useState(pb.authStore.token)
    const [user, setUser] = useState(pb.authStore.model)


    useEffect(() => {
      
      return pb.authStore.onChange((token, model) => {
        setToken(token)
        setUser(model)
      })

    }, [])

    useEffect(() => {

      if(!user) {
        pb.collection("users").unsubscribe()
        return
      }

      pb.collection("users").subscribe(user.id, e => {
        console.log("User record changed", user)
        setUser(e.record)
      })

      return () => pb.collection("users").unsubscribe()

    }, [ user ])


    const login = useCallback(async (email, password) => {
        return await pb.collection("users").authWithPassword(email, password);
    }, [])
    
    const register = useCallback(async (email, password) => {
      return new Promise(((res, rej) => {
        pb.collection("users").create({ email, password, passwordConfirm: password, locationsView: true, stagesView: true, deadlinesView: true })
        .then(() => {
          login(email, password)
          .then(() => {
            res()
          })
          .catch(err => {
            console.error("Error logging in after creating user", err)
            rej(err)
          })
        })
        .catch(err => {
          console.error("Error creating user", err)
          rej(err)
        })
      }))
    }, [])

    const deleteUser = useCallback(async () => {
      return new Promise(((res, rej) => {
        console.log({user})
        pb.collection("users").delete(user?.id)
        .then(() => {
          logout()
          res()
        })
        .catch(err => {
          console.error("Error deleting user", err)
          rej(err)
        })
      }))
    }, [])

    const logout = useCallback(() => {
        pb.authStore.clear()
    }, [])


    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
        if (tokenExpiration < expirationWithBuffer) {
            await pb.collection("users").authRefresh();
        }
    }, [token]);

    pb.autoCancellation(false);
    
    useInterval(refreshSession, token ? twoMinutesInMs : null);

    return (
        <PocketContext.Provider
          value={{ register, login, logout, deleteUser, user, token, pb }}
        >
          {
            user ? (
              <>
                {children}
              </>
            ) : (
              <AuthenticationWrapper />
            )
          }
        </PocketContext.Provider>
      );
}


export const usePocket = () => useContext(PocketContext);


