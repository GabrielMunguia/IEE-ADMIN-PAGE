const usuario = document.querySelector("#usuario");
const password = document.querySelector("#password");
const password2= document.querySelector("#password2");
const noMiembro= document.querySelector("#noMiembro");
const formularioUsuario= document.querySelector("#formulario_usuario");


const submit= async (e)=>{
    e.preventDefault();
try {

    console.log('submit');

    const voluntario= await obtenerVoluntario();
     if(!voluntario){
        throw new Error('No existe el voluntario');
     }
     console.log('pasaooo')
     const usuario = await agregarUsuario(voluntario._id);
     console.log('x')
        if(!usuario){
            throw new Error('No se pudo crear el usuario');
        }
        await Swal.fire({
            title: "Usuario creado",
            text: "El usuario se creo correctamente",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          
    

  
    
    console.log(resp);
} catch (error) {
    mostrarError(error);
}
}

const obtenerVoluntario = async()=>{
 try {
    const resp = await axios.get(`https://iee-uso.herokuapp.com/api/voluntarios/noMiembro/${noMiembro.value}`);
    return resp.data.payload.voluntario;
 } catch (error) {
    throw error;
 }
}


const agregarUsuario= async (idVoluntario)=>{
   try {
    console.log('me ejecute')
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("usuario", usuario.value);
    formData.append("password", password.value);
    formData.append("voluntario", idVoluntario);
   
    const resp = await axios.post(`https://iee-uso.herokuapp.com/api/usuarios`,formData,{
        headers: {
            'x-token': token,
          }
    });
    return resp.data.payload.usuario;



    
   } catch (error) {
    console.log(error);
    throw error;
    
   }
}
formularioUsuario.addEventListener("submit",submit);

   

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