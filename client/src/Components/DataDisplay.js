import React, {useState,useEffect} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './DataDisplay.css';

function DataDisplay({data}) {
  const [hasData, sethasData] = useState(false);
  useEffect(() => {
    console.log(data,data.length);
    if(data.length > 0) {
      sethasData(true);
    }
    else {
      sethasData(false);
    }
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead >
          <TableRow>
            <TableCell sx ={{color: '#61dafb'}}>ID</TableCell>
            <TableCell sx ={{color: '#61dafb'}} align="right">Trade Type</TableCell>
            <TableCell sx ={{color: '#61dafb'}} align="right">Quantity</TableCell>
            <TableCell sx ={{color: '#61dafb'}} align="right">Price</TableCell>
            <TableCell sx ={{color: '#61dafb'}} align="right">Average Buying Price</TableCell>
          </TableRow>
        </TableHead>
        {hasData ? (
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx ={{color: '#fff'}}>
                {row.id}
              </TableCell>
              <TableCell sx ={{color: '#fff'}} align="right">{row.trade_type}</TableCell>
              <TableCell sx ={{color: '#fff'}} align="right">{row.quantity}</TableCell>
              <TableCell sx ={{color: '#fff'}} align="right">{row.price}</TableCell>
              <TableCell sx ={{color: '#fff'}} align="right">{row.avg}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell sx ={{color: '#61dafb'}} colSpan={6} align="center">No Data To Display!</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}

export default DataDisplay