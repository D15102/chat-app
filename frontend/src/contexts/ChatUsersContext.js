import { createContext, useContext } from "react";


const ChatUsersContext = createContext({
    chatUsers: [],
    setChatUsers: () => { }
})

export const ChatUsersProvider = ChatUsersContext.Provider


const useChatUsers = () => { return useContext(ChatUsersContext) }

export default useChatUsers
