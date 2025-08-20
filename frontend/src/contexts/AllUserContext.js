import { createContext, useContext } from "react";


const AllUserContext = createContext({
    allUsers: [],
    setAllUsers: () => { }
})

export const AllUserProvider = AllUserContext.Provider

const useAllUsers = () => useContext(AllUserContext)

export default useAllUsers