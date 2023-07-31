import { TOKEN_KEY } from "../components/protectedRoute"



export const getTokenString= ()=>{

    return `Bearer ${localStorage.getItem(TOKEN_KEY)}`
}