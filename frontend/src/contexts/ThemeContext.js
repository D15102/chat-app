import { createContext, useContext } from "react";

const ThemeContext = createContext({
    themeMode: "light",
    lightMode: () => { },
    darkMode: () => { },
})

export const ThemeProvider = ThemeContext.Provider

const useTheme = () => useContext(ThemeContext)


export default useTheme