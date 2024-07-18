import React, { createContext } from 'react'
import doctors from "../Components/Assest/doctor"




export const Telecontext = createContext(null);
const TelecontextProvider = (props) => {

    const contextValue = {
        doctors
    }


  return (
    <Telecontext.Provider value={contextValue}>
        {props.children}
    </Telecontext.Provider>
  )
}

export default TelecontextProvider
