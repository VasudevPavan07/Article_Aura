import React, {  useContext, useState } from 'react'
import { createContext } from 'react';

export let themeContext = createContext();

const ThemeContext = ({children}) => {
    const [theme,setTheme] =useState('light');
  return (
    <themeContext.Provider value={{theme,setTheme}}>
      {children}
    </themeContext.Provider>
  )
}

export default ThemeContext
