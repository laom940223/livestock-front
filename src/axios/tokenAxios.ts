import axios from "axios";
import { TOKEN_KEY } from "../components/protectedRoute";


export const apiAxios = axios.create(
    
    {

        headers:{

            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            'origin':"http:localhost:5898"
        }
    }
  )

