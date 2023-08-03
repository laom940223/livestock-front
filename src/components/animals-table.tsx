
import { Animal } from "../pages/farm-detail";
import { DataGrid, GridColDef  } from '@mui/x-data-grid';


const columns: GridColDef<Animal>[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'dob', headerName: 'Date of birth', width: 130 },
  { field: 'breed', headerName: 'Breed', width: 90,

    renderCell: (params=>{
      return params.value.name
    })
  },

  {
    field:"sex", headerName:"Sex", width:100

  },

  {
    field: "actions", headerName:"Actions",
    renderCell: (params=>{

      return <>{`Edit${params.row.id}`} </>
    })
  }
  
  
  ,
  
];



export const AnimalsTable = ({animals} : { animals :Animal[]})=>{


   

    return (
      <div style={{ height: 500, width: '100%' }}>
      
      <DataGrid
        rows={animals}
        columns={columns}
        disableColumnSelector
      
        
        initialState={{

          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[20, 40]}
        
      />
    </div>

    )

}

