import { useContext } from "react";
import { createContext } from "react";


const UserContext = createContext({
    user: {},
    setUser: () => { }
})

export const UserProvider = UserContext.Provider

const useUser = () => {
    return useContext(UserContext)
}
export default useUser