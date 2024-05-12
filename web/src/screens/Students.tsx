import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import { useState, useEffect, ChangeEvent } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { Alert } from "@mui/material";
import config from "../config.json";
import axios from "axios";

interface Column {
  id: "code" | "name" | "uuid" | "manage";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  { id: "code", label: "Codigo", minWidth: 100 },
  { id: "name", label: "Nombre", minWidth: 170 },
  { id: "uuid", label: "UUID", minWidth: 170 },
  { id: "manage", label: "Administrar", minWidth: 170, align: "right" },
];
interface Data {
  name: string;
  code: string;
  uuid: string;
  manage: JSX.Element;
}
function createData(
  name: string,
  code: string,
  uuid: string,
  manage: JSX.Element
): Data {
  return { name, code, uuid, manage };
}

export default function Students() {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrAlert, setShowErrAlert] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [page, setPage] = useState(0);

  const handleSumbit = (code: string) => {
    axios
      .post(config.apiUrl + "/students/remove", { code })
      .then((res) => {
        if (res.status === 200) {
          setData();
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
        } else {
          setShowErrAlert(true);
          setTimeout(() => {
            setShowErrAlert(false);
          }, 5000);
        }
      })
      .catch(() => setShowErrAlert(true));
  };

  const setData = () => {
    axios.get(config.apiUrl + "/students").then((res) => {
      const raw: Data[] = [];
      res.data.students.map((student: any) => {
        return raw.push(
          createData(
            student.name,
            student.code,
            student.uuid,
            <IconButton
              onClick={() => {
                handleSumbit(student.code);
              }}
              aria-label="delete"
              size="large"
            >
              <DeleteIcon color="error" />
            </IconButton>
          )
        );
      });
      setRows(raw);
    });
  };

  useEffect(() => {
    setData();
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="App">
      {showSuccessAlert && (
        <Alert severity="success">Estudiante removido correctamente.</Alert>
      )}
      {showErrAlert && (
        <Alert severity="error">Hubo un error al remover al estudiante.</Alert>
      )}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 10 * 50 }}>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
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
