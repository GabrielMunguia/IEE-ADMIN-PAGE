const tabla_voluntarios = document.getElementById("tabla_voluntarios");

const btnLogout = document.querySelector('#btnLogout');
document.addEventListener("DOMContentLoaded", function () {
  const sesionValida=validarSession();

if(!sesionValida){
const url = window.location.origin+"/IEE-ADMIN-PAGE/login.html";
window.location.href = url;
}
  cargar_voluntarios();
});
const cargar_voluntarios = async () => {
  const resp = await axios.get(
    "https://iee-uso.herokuapp.com/api/voluntarios"
  );
  const data = resp.data;
  const voluntarios = data.payload.voluntarios;
  let html = "";

  voluntarios.map((v, i) => {
    html =
      html +
      `
          <tr >
                    <td class="text-dark"> ${i} </td>
                    <td class="text-dark"> ${v.nombres} </td>
                    <td class="text-dark"> ${v.apellidos} </td>
                    <td class="text-dark"> ${v.genero} </td>
                    <td class="text-dark"> ${v.correo} </td>
                    <td class="text-dark">${v.telefono ?? "-"} </td>
                    <td class="text-dark"> ${v.grado.grado} </td>
                    <td class="text-dark"> ${v.capitulo.nombre} </td>
                    <td class="text-center">
                        <a  href="./add.html?id=${v._id}"  class="btn btn-warning mr-2 ">Ver mas</a>
                        <button id=${
                          v._id
                        } type="submit" class="btn btn-danger mr-2 btnEliminar">Eliminar</button>
                    </td>
                    
                  </tr>
          `;
  });
  tabla_voluntarios.innerHTML = html;

  const btnEliminar = document.querySelectorAll(".btnEliminar");
  btnEliminar.forEach((btn) => {
    btn.addEventListener("click", eliminarVoluntario);
  });
};

const eliminarVoluntario = async (e) => {
  const id = e.target.id;
  //sweet alert para confirmar la eliminacion del voluntario
  const seEliminara = await Swal.fire({
    title: "Do you want to save the changes?",
    titleColor: "red",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
  });

  if (seEliminara.isConfirmed) {
    //get jwt token from localStorage
    const token = localStorage.getItem("token");
   

    const resp = await axios.delete(
      `https://iee-uso.herokuapp.com/api/voluntarios/${id}`,
      {
        headers: {
          "x-token": token,
        },
      }
    );
    const data = resp.data;

    if (data.status ) {
     await  Swal.fire({
        title: "Eliminado!",
        text: "El voluntario ha sido eliminado",
        icon: "success",
        confirmButtonText: "Cool",
      });
     await  cargar_voluntarios();
    }
  }
};


btnLogout.addEventListener('click', function() {
 logout();
});
const logout=()=>{

 localStorage.removeItem('token');

 window.location.href = "login.html";
}
