

const tabla_voluntarios = document.getElementById("tabla_voluntarios");
const btnLogout = document.querySelector("#btnLogout");

document.addEventListener("DOMContentLoaded", function () {
  const sesionValida = validarSession();

  if (!sesionValida) {
    const url = window.location.origin + "/IEE-ADMIN-PAGE/login.html";
    window.location.href = url;
  }
  cargar_usuarios();
});

const cargar_usuarios = async () => {
  const token = localStorage.getItem("token");
  const resp = await axios.get("https://iee-uso.herokuapp.com/api/usuarios", {
    headers: {
      "x-token": token,
    },
  });
  const data = resp.data;
  const usuarios = data.payload.usuarios;
  console.log(usuarios);

  let html = "";

  usuarios.map((u, i) => {
 console.log(u.uid)
    html =
      html +
      `
          <tr >
                    <td class="text-dark"> ${i} </td>
                    <td class="text-dark"> ${u.usuario} </td>
                    <td class="text-dark"> ${u.voluntario.nombres}  ${u.voluntario.apellidos} </td>
                    <td class="text-dark"> ${u.voluntario.noMiembro} </td>
                    <td class="text-dark">
                     <button idVoluntario="${u.uid}" class= 'btn btn-danger py-2 text-white btn-eliminar'>Eliminar</button> 
                  
                    </td>
                    
                    
                    
                  </tr>
          `;
  });
  tabla_voluntarios.innerHTML = html;

  const btnEliminar = document.querySelectorAll(".btn-eliminar");
  btnEliminar.forEach((btn) => {
    btn.addEventListener("click", eliminarUsuario);
  });
};



btnLogout.addEventListener("click", function () {
  logout();
});
const logout = () => {
  localStorage.removeItem("token");

  window.location.href = "login.html";
};

const eliminarUsuario = async (e) => {
try {

const id = e.target.getAttribute("idVoluntario");
console.log(id)
  //sweet alert para confirmar la eliminacion del voluntario
  const seEliminara = await Swal.fire({
    title: "Estas seguro de eliminarlo?",
    titleColor: "red",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    denyButtonText: `Cancelar`,
  });

  if (seEliminara.isConfirmed) {
    //get jwt token from localStorage
    const token = localStorage.getItem("token");

    const resp = await axios.delete(
      `https://iee-uso.herokuapp.com/api/usuarios/${id}`,

      {
        headers: {
          "x-token": token,
        },
      }
    );
    const data = resp.data;

    if (data.status) {
      await Swal.fire({
        title: "Eliminado!",
        text: "El voluntario ha sido eliminado",
        showConfirmButton: false,
        timer: 1500,
        icon: "success",
        
       
      });
      await cargar_usuarios();
    }
  }
} catch (error) {
  mostrarError(error);
}
};

const desactivarUsuario = async () => {
  try {
    const token = localStorage.getItem("token");
  } catch (error) {
    mostrarError(error);
  }
};
const mostrarError=async(error)=>{
  let mensajeError =
      error?.response?.data?.mensaje || error?.response?.data?.msj || null;
    if (!mensajeError) {
      if (error?.response?.data?.errors) {
        mensajeError = ""
        error.response.data.errors.forEach(e => {
          mensajeError += e.msg + '\n';
        }
        )

      }
    }
    if (mensajeError) {
      Swal.close();
      await Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error",
        showConfirmButton: false,
        timer: 1500
      });
    }
}