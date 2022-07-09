const validarSession = (redirect=true) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Si existe el token, validamos que sea correcto
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload);
    if (payload.exp < Date.now() / 1000) {
      // Si el token ya expiró
      localStorage.removeItem("token");
      return false;

    } else {
       return true;
    }
  } else {
   return false;
  }
};
