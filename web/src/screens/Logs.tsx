import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import RemoveIcon from '@mui/icons-material/Remove';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import AddIcon from '@mui/icons-material/Add';
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import config from "../config.json";
import io from "socket.io-client";
import * as React from "react";
import axios from "axios";

interface Column {
  id: "code" | "name" | "action" | "date";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  { id: "code", label: "Codigo", minWidth: 100 },
  { id: "name", label: "Nombre", minWidth: 170 },
  { id: "action", label: "Accion", minWidth: 170 },
  {
    id: "date",
    label: "Fecha",
    minWidth: 170,
    align: "right",
  },
];

interface Data {
  name: string;
  code: string;
  action: JSX.Element;
  date: string;
}

function createData(
  name: string,
  code: string,
  action: JSX.Element,
  date: string
): Data {
  return { name, code, action, date };
}

//Socket de conexion para recibir evento de nuevo registro
const socket = io(config.socketUrl);

export default function Logs() {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const setData = () => {
    axios.get(config.apiUrl + "/register").then((res) => {
      const raw: Data[] = [];
      res.data.logs.map((log: any) => {
        return raw.push(
          createData(
            log.name,
            log.code,
            log.action === "entry" ? <AddIcon color="success"/> : <RemoveIcon color="error"/>,
            log.date
          )
        )
      });
      setRows(raw);

    });
  };

  React.useEffect(() => {
    setData();
    socket.on("Record_Added", () => {
      setRows([]);
      setData();
    });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="App">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ minHeight: 10*50, maxHeight: 10*50 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (

                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          title="Filas por pagina"
        />
      </Paper>
    </div>
  );
}
