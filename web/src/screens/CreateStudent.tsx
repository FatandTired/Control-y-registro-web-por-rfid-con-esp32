import { Alert } from "@mui/material";
import config from "../config.json";
import { useState } from "react";
import "./CreateStudents.css";
import axios from "axios";

export default function CreateStudent() {
  const [post, setPost] = useState({
    uuid: "",
    code: "",
    name: "",
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrAlert, setShowErrAlert] = useState(false);

  const handleInput = (event: any) => {
    setPost({ ...post, [event.target?.name]: event.target.value });
  };

  const handleSumbit = (event: any) => {
    event.preventDefault();
    axios
      .post(config.apiUrl + "/students/create", post)
      .then((res) => {
        if (res.status === 200) {
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
      .catch((err) => setShowErrAlert(true));
    event.target.reset();
  };

  return (
    <div className="content">
      {showSuccessAlert && (
        <Alert severity="success">Estudiante agregado correctamente.</Alert>
      )}
      {showErrAlert && (
        <Alert severity="error">Hubo un error al agregar al estudiante.</Alert>
      )}
      <div className="form">
        <form onSubmit={handleSumbit}>
          <h2>Asignar identificador a estudiante</h2>
          <p>UUID: </p>
          <input type="text" onChange={handleInput} name="uuid"></input>
          <p>Código: </p>
          <input type="text" onChange={handleInput} name="code"></input>
          <p>Nombre: </p>
          <input type="text" onChange={handleInput} name="name"></input>
          <br />
          <button>Agregar Estudiante</button>
        </form>
      </div>
    </div>
  );
}
