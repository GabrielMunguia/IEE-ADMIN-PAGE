const formularioEvento = document.querySelector("#formulario_evento");
const titulo = document.querySelector("#titulo");
const descripcion = document.querySelector("#descripcion");
const fecha = document.querySelector("#fecha");
const subTitulo = document.querySelector("#subTitulo");
const img = document.querySelector("#img");
const sitio = document.querySelector("#sitio");
const token = localStorage.getItem("token");
const idProject = new URLSearchParams(window.location.search).get("id");
const btnActivarEdicion = document.querySelector("#btnActivarEdicion");
const btnAgregar = document.querySelector("#btnAgregar");
const btnLimpiar = document.querySelector("#btnLimpiar");
const imgActual=document.querySelector("#imgActual");
const divImagenActual=document.querySelector("#divImagenActual");
let datosOriginales = {};

document.addEventListener("DOMContentLoaded", () => {
  if (idProject) {
    divImagenActual.classList.remove("d-none");
    cargarProyecto();
    //muestro el boton de editar
    btnActivarEdicion.classList.remove("d-none");
    btnActivarEdicion.addEventListener("click", handleEdicion);
    //Quito el boton de crear y limpiar
    btnAgregar.classList.add("d-none");
    btnAgregar.innerHTML = "Actualizar";
    btnLimpiar.classList.add("d-none");

    //desabilito los campos
    titulo.disabled = true;
    descripcion.disabled = true;
    fecha.disabled = true;
    subTitulo.disabled = true;
    img.disabled = true;
    sitio.disabled = true;
    
  }else{
    divImagenActual.classList.add("d-none");
   
  }
});

formularioEvento.addEventListener("submit", submit);
async function submit(e) {
  e.preventDefault();
  try {
    const validarCamposModificados=validarCampos();
    if(!validarCamposModificados){
      return Swal.fire({
        title: "Error",
        text: "No hay nada que actualizar",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    const data = new FormData();
    const url = idProject
      ? "https://iee-uso.herokuapp.com/api/proyects/" + idProject
      : "https://iee-uso.herokuapp.com/api/proyects";
   
      titulo.value!==datosOriginales.titulo && data.append("titulo", titulo.value);
    data.append("descripcion", descripcion.value);
    data.append("fecha", fecha.value);
    data.append("subTitulo", subTitulo.value);
    console.log(img.files[0]);
   if(img.files[0]){
    data.append("archivo", img.files[0])
  };
    data.append("sitio", sitio.value);


    const response = await axios[idProject ? "put" : "post"](
      url,
      data,
      {
        headers: {
          "x-token": token,
        },
      }
    );
    console.log(response.data)
    if (response.data.status) {
      await Swal.fire({
        title: "Evento creado",
        text:idProject ? "Evento actualizado" :  "El evento se creo correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

       idProject ? window.location.reload() :  formularioEvento.reset();
     
      return;
    }
    throw new Error(response.data.msg);
  } catch (error) {
    mostrarError(error);
  }
}
//validar que al menos un campo se modifique
const validarCampos=()=>{
  const camposModificados={
    titulo:titulo.value!==datosOriginales.titulo,
    descripcion:descripcion.value!==datosOriginales.descripcion,
    fecha:fecha.value!==datosOriginales.fecha,
    subTitulo:subTitulo.value!==datosOriginales.subTitulo,
    sitio:sitio.value!==datosOriginales.sitio,
  }
  return Object.values(camposModificados).some((e)=>e) || img.files[0];
}
const mostrarError = async (error) => {
  let mensajeError =
    error?.response?.data?.mensaje || error?.response?.data?.msj || null;
  if (!mensajeError) {
    if (error?.response?.data?.errors) {
      mensajeError = "";
      error.response.data.errors.forEach((e) => {
        mensajeError += e.msg + "\n";
      });
    }
  }
  if (mensajeError) {
    Swal.close();
    await Swal.fire({
      title: "Error",
      text: mensajeError,
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

const cargarProyecto = async () => {
  const resp = await axios.get(
    "https://iee-uso.herokuapp.com/api/proyects/" + idProject
  );
  if (!resp.data.status) {
    return;
  }
  //le quito el required a la imagen
  img.required = false;
  const proyecto = resp.data.payload.proyecto;
  console.log(proyecto);
  titulo.value = proyecto.titulo;
  descripcion.value = proyecto.descripcion;

  subTitulo.value = proyecto.subTitulo;
  sitio.value = proyecto.sitio;
  fecha.value = moment(proyecto.fecha).format("YYYY-MM-DDTkk:mm");
  //guardar los datos originales
  datosOriginales = {
    titulo: proyecto.titulo,
    descripcion: proyecto.descripcion,
    fecha: moment(proyecto.fecha).format("YYYY-MM-DDTkk:mm"),
    subTitulo: proyecto.subTitulo,
    sitio: proyecto.sitio,
  };

  imgActual.src=proyecto.img;
};

const handleEdicion = async () => {
  titulo.disabled = !titulo.disabled;
  descripcion.disabled = !descripcion.disabled;
  fecha.disabled = !fecha.disabled;
  subTitulo.disabled = !subTitulo.disabled;
  img.disabled = !img.disabled;
  sitio.disabled = !sitio.disabled;
  btnAgregar.classList.toggle("d-none");
  btnLimpiar.classList.toggle("d-none");
};
