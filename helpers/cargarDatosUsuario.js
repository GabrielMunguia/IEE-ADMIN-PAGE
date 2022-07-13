const cargarDatosUsuario = () => {
const usuario=JSON.parse(localStorage.getItem('usuario'));
const nombreUsuario=document.querySelectorAll('.nombre_usuario') || [];
const datosUsuario = usuario.voluntario ;
const imgUsuario = document.querySelectorAll('.img_usuario') || [];
if(!usuario)return;
nombreUsuario.forEach(element => {
    element.innerHTML=datosUsuario.nombres.split(' ')[0]+' '+datosUsuario.apellidos.split(' ')[0];
});
console.log(datosUsuario);
console.log(imgUsuario)
imgUsuario.forEach(element => {
    element.src=datosUsuario.img;
});

}

document.addEventListener('DOMContentLoaded',cargarDatosUsuario);