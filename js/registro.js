import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registroForm");

    if (registroForm) {
        registroForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // Capturar datos del formulario
            const formData = new FormData(registroForm);
            const datos = Object.fromEntries(formData.entries());

            // Asegurar que fkrol_id sea un número entero
            datos.fkrol_id = parseInt(datos.fkrol_id);

            try {
                const response = await fetch(`${API_URL}/usuarios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (response.ok) {
                    alert("¡Registro exitoso! Redirigiendo al login...");
                    window.location.href = "login.html"; // Redirige al login al registrarse
                } else {
                    alert("Error: " + (resultado.detail || "No se pudo registrar el usuario."));
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                alert("No se pudo conectar con el servidor backend.");
            }
        });
    }
});














