'use client'

import React, { createContext, useContext, useState } from 'react'

type NavbarThemeContextType = {
    isDark: boolean
    setIsDark: (v: boolean) => void
}

const NavbarThemeContext = createContext<NavbarThemeContextType | null>(null)

export const NavbarThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(true)

    return (
        <NavbarThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </NavbarThemeContext.Provider>
    )
}

export const useNavbarTheme = () => {
    const ctx = useContext(NavbarThemeContext)
    if (!ctx) throw new Error('useNavbarTheme must be used inside NavbarThemeProvider')
    return ctx
}
