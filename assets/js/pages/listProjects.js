const tabla_eventos = document.getElementById("tabla_eventos");

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
    "https://iee-uso.herokuapp.com/api/proyects"
  );
  const data = resp.data;
 
  const proyectos = data.payload.proyectos;
  let html = "";

  proyectos.map((p, i) => {
    html =
      html +
      `
          <tr >
                    <td class="text-dark"> ${i} </td>
                    <td class="text-dark"> ${p.titulo} </td>
                    <td class="text-dark"> ${p.subTitulo} </td>
                    <td class="text-dark"> ${p.descripcion} </td>
                    <td class="text-dark"> ${p.sitio} </td>
                    <td class="text-dark"> ${p.fecha} </td>
                    <td class="text-center">
                        <a  href="./addProject.html?id=${p.uid}"  class="btn btn-warning mr-2 ">Ver mas</a>
                        <button id=${
                          p._id
                        } type="submit" class="btn btn-danger mr-2 btnEliminar">Eliminar</button>
                    </td>
                    
                  </tr>
          `;
  });
  tabla_eventos.innerHTML = html;

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
