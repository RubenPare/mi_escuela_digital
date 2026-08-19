// js/login.js
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Capturamos los valores (en tu login.html el input de mail/usuario debe tener name="mail")
           const mail = document.getElementById("inputUsuario").value.trim();
const contraseña = document.getElementById("inputPass").value;

console.log("MAIL:", mail);
console.log("CONTRASEÑA:", contraseña);

            const credenciales = {
                mail: mail,
                contraseña: contraseña
            };

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(credenciales)
                });

                const resultado = await response.json();

                if (response.ok) {

    sessionStorage.setItem(
        "usuario",
        JSON.stringify(resultado.usuario)
    );

    alert(
        "¡Login exitoso! Bienvenido " +
        resultado.usuario.nombre
    );

    window.location.href = "dashboard.html";

}
                 else {
                    alert("Error: " + (resultado.detail || "Credenciales incorrectas"));
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                alert("No se pudo conectar con el servidor backend.");
            }
        });
    }
});