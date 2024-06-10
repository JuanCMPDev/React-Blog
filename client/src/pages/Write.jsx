import React, { useContext, useEffect, useState } from "react";
import { uploadFile } from "../firebase/config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import moment from "moment";
import { toast } from "sonner";



const categories = ["tutoriales", "recursos", "opinión"];

const Write = () => {
  const {currentUser, logout} = useContext(AuthContext);
  const navigate = useNavigate();
  const locationState = useLocation().state;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(null);
  const [editableTitle, setEditableTitle] = useState("");

  useEffect(() => {
    setValue(locationState?.description || "");
    setTitle(locationState?.title || "");
    setEditableTitle(locationState?.title || "");
    setCategory(locationState?.category || null);
  }, [locationState]);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!editableTitle || !value) {
      toast.error("Por favor ingresa un título y una descripción.");
      return;
    }

    try {
      let imgUrl = locationState?.img || "";
      if (file) {
        const fileType = file.type.split("/")[0];
        if (fileType === "image") {
          imgUrl = await uploadFile(file);
        } else {
          console.log("El archivo seleccionado no es una imagen.");
        }
      }
  
      if (locationState) {
        await axios.put(`${BACKEND_URL}posts/${locationState.id}`, {
          title: editableTitle,
          description: value,
          category,
          img: imgUrl,
        }, { withCredentials: true });
        navigate(`/post/${locationState.id}`);
        toast.success("Post actualizado con exito.")
      } else {
        await axios.post(`${BACKEND_URL}posts`, {
          title: editableTitle,
          description: value,
          category,
          img: imgUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        }, { withCredentials: true });
        navigate('/');
        toast.success("Post creado con exito.")
      }
    } catch (err) {
      if(err.response.status === 401){
        logout();
        toast.error("Se ha excedido el tiempo de tu sesión, inicia sesión nuvamente")
        return;
      };
      toast.error("Error al editar o elimar post", {
        description: err,
      })
    }
  };

  const hasWritePermission = currentUser && (currentUser.role === 'admin' || currentUser.role === 'writer');

  useEffect(() => {
    if (!hasWritePermission) {
      navigate('/');
    }
  }, [hasWritePermission, navigate]);

  return (
    <div className="write">
      <div className="write-container">
        <div className="content">
        <input
            type="text"
            placeholder="Título"
            value={editableTitle}
            onChange={(e) => {
              setEditableTitle(e.target.value);
            }}
          />
          <div className="editorContainer">
            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
        <div className="menu">
          <div className="item">
            <h1>Pubicación</h1>
            <span>
              <b>Estatus: </b> borrador
            </span>
            <span>
              <b>Visibilidad: </b> publica
            </span>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label className="file " htmlFor="file">
              Selecciona una imagen
            </label>
            <div className="buttons">
              <button>Guarda como borrador</button>
              <button onClick={handleClick}>
                {locationState ? "Actualiza" : "Publica"}
              </button>
            </div>
          </div>
          <div className="item">
            <h1>Categoría</h1>
            {categories.map((cat) => (
              <div className="cat" key={cat}>
                <input
                  type="radio"
                  name="cat"
                  checked={category === cat}
                  value={cat}
                  id={cat}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label htmlFor={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
