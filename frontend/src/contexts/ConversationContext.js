import { useContext } from "react";
import { createContext } from "react";


const ConversationContext = createContext({
    conversations: [],
    setConversations: () => { }
})


export const ConversationProvider = ConversationContext.Provider

const useConversations = () => { return useContext(ConversationContext) }

export default useConversations