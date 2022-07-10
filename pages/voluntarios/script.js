const selectCapitulos = document.getElementById("capitulos");
const selectGrados = document.getElementById("grados");
const formulario_voluntarios = document.getElementById("formulario_voluntarios");
const btnActivarEdicion = document.getElementById("btnActivarEdicion");
const btnAgregar = document.getElementById("btnAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");
let ESTADO_EDICION=false;
let telefonoOriginal = 0;
let correoOriginal = 0;
let codigoOriginal = 0;
let idVoluntario = null;
document.addEventListener("DOMContentLoaded", () => {
  const sesionValida=validarSession();
 
  if(!sesionValida){
    window.location.href = "./login.html";
  }
  getCapitulos();
  getGrados();
  validarEditar();
});

const btnLogout = document.querySelector('#btnLogout');
     
btnLogout.addEventListener('click', function() {
  logout();
});
const logout=()=>{
  console.log('click')
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

const getCapitulos = async () => {
  const response = await axios.get(
    "https://iee-uso.herokuapp.com/api/capitulos"
  );
  const data = await response.data;
  const capitulos = data.payload.capitulos;
  capitulos.forEach((capitulo) => {
    const option = document.createElement("option");
    option.value = capitulo._id;
    option.innerHTML = capitulo.nombre;
    selectCapitulos.appendChild(option);
  });
};


const getGrados = async () => {
  const response = await axios.get("https://iee-uso.herokuapp.com/api/grados");
  const data = await response.data;
  const grados = data.payload.grados;
  console.log(grados);
  grados.forEach((grado) => {
    const option = document.createElement("option");
    option.value = grado._id;
    option.innerHTML = grado.grado;
    selectGrados.appendChild(option);
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  //swet alert cargando
  Swal.fire({
    icon: "info",
    title: "Cargando",
    showConfirmButton: false,
  });
  try {
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const grado = document.getElementById("grados").value;
    const capitulo = document.getElementById("capitulos").value;
    const codigo = document.getElementById("codigo").value;
    const genero = document.getElementById("genero").value;
    const link = document.getElementById("link").value;
    const imagen = document.getElementById("imagen").files[0];
    const formData = new FormData();
    formData.append("nombres", nombres);
    formData.append("apellidos", apellidos);
    formData.append("grado", grado);
    formData.append("capitulo", capitulo);
    formData.append("genero", genero);
    formData.append("link", link);
    formData.append("archivo", imagen);
    if (!idVoluntario) {
      formData.append("correo", correo);
      formData.append("telefono", telefono);
      formData.append("noMiembro", codigo);
    } else {
      if (correo != correoOriginal) {
        formData.append("correo", correo);
      }
      if (telefono != telefonoOriginal) {
        formData.append("telefono", telefono);
      }
      if (codigo != codigoOriginal) {
        formData.append("noMiembro", codigo);
      }
    }
    let response = null;
       //get jwt token from localStorage
       const token = localStorage.getItem("token");
         

    if (idVoluntario) {
      try {
        response = await axios.put(
          `https://iee-uso.herokuapp.com/api/voluntarios/${idVoluntario}`,
          formData,
          {
            headers: {
              'x-token': token,
            }
          }
        );
      } catch (error) {
        throw error;
      }
    } else {
      try {
        response = await axios.post(
          "https://iee-uso.herokuapp.com/api/voluntarios",
          formData,
          {
            headers: {
              'x-token': token,
            }
          }
        );
      } catch (error) {
        throw error;
      }
    }
    const data = await response.data;
    if (data.status) {
      Swal.close();
      Swal.fire({
        icon: "success",
        title: !idVoluntario
          ? "Se registro correctamente"
          : "Se actualizo correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    if (!idVoluntario) {
      formulario_voluntarios.reset();
    }
  } catch (error) {
    console.log("entroo al error");
    console.log(error);
    let mensajeError =
      error?.response?.data?.mensaje || error?.response?.data?.msj || null;
      if(!mensajeError){
        if(error?.response?.data?.errors){
            mensajeError = ""
            error.response.data.errors.forEach(e=>{
              mensajeError+=e.msg+'\n';
            }
            )

        }
      }
    if (mensajeError) {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error",
        button: "Aceptar",
      });
    }
  }
};



formulario_voluntarios.addEventListener("submit", handleSubmit);


const validarEditar = async () => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");
  if (id) {
    idVoluntario = id;
    const resp = await axios.get(
      `https://iee-uso.herokuapp.com/api/voluntarios/${id}`
    );
    const data = resp.data;
    console.log(data);
    const voluntario = data.payload.voluntario;
    const nombres = document.getElementById("nombres");
    const apellidos = document.getElementById("apellidos");
    const genero = document.getElementById("genero");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const codigo = document.getElementById("codigo");
    console.log(btnLimpiar)
    btnActivarEdicion.classList.remove("d-none");
    btnLimpiar.classList.add("d-none");
    btnAgregar.classList.add('d-none');
    btnAgregar.innerHTML = "Actualizar";
    codigo.disabled = true;
    nombres.value = voluntario.nombres;
    apellidos.value = voluntario.apellidos;
    genero.value = voluntario.genero;
    correo.value = voluntario.correo;
    codigo.value = voluntario.noMiembro;
    telefono.value = voluntario.telefono;
    telefonoOriginal = voluntario.telefono;
    correoOriginal = voluntario.correo;
    codigoOriginal = voluntario.noMiembro;
    //recorrer las options del select grados
    for (let i = 0; i < selectGrados.options.length; i++) {
      if (selectGrados.options[i].value == voluntario.grado._id) {
        selectGrados.selectedIndex = i;
      }
    }
    //recorrer las options del select capitulos
    for (let i = 0; i < selectCapitulos.options.length; i++) {
      if (selectCapitulos.options[i].value == voluntario.capitulo._id) {
        selectCapitulos.selectedIndex = i;
      }
    }
  }
};

const handleEdicion = ()=>{
    console.log('entro')
    if(!ESTADO_EDICION){
        btnLimpiar.classList.remove("d-none");
        btnAgregar.classList.remove('d-none');
        btnActivarEdicion.innerText="Desactivar edicion";
    }else{
        btnLimpiar.classList.add("d-none");
        btnAgregar.classList.add('d-none');
        btnActivarEdicion.innerText="Activar edicion";
        
    }
    ESTADO_EDICION = !ESTADO_EDICION;
}

btnActivarEdicion.addEventListener("click", handleEdicion);