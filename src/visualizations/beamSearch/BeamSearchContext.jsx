import { createContext, useContext } from 'react'

const BSContext = createContext();

export const useAppContext = () => {
    return useContext(BSContext);
}

export default BSContext;