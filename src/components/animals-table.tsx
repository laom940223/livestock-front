import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Animal } from "../pages/farm-detail";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];


export const AnimalsTable = ({animals} : { animals :Animal[]})=>{


    const keys = Object.keys(animals[0])

    


    const headers  = keys.map((key, index)=>{
        return( 
            <TableCell key={index}>{key}</TableCell>
        )
    })


    

    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                    {headers}
                
              </TableRow>
            </TableHead>
            
          </Table>
        </TableContainer>

    )

}