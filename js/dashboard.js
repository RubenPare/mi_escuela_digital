document.addEventListener("DOMContentLoaded", () => {

    const usuarioGuardado = sessionStorage.getItem("usuario");

    if (!usuarioGuardado) {

        window.location.href = "login.html";

        return;
    }


    const usuario = JSON.parse(usuarioGuardado);


    // =========================
    // MOSTRAR USUARIO
    // =========================

    document.getElementById("nombreUsuario").textContent =
        `${usuario.nombre} ${usuario.apellido}`;


    const roles = {
        1: "Profesor",
        2: "Dirección",
        3: "Administrador",
        4: "Secretaría",
        5: "Preceptor"
    };


    const nombreRol = roles[usuario.fkrol_id] || "Usuario";


    document.getElementById("rolUsuario").textContent =
        nombreRol;


    document.getElementById("tituloBienvenida").textContent =
        `Bienvenido/a ${usuario.nombre}`;


    // =========================
    // CERRAR SESIÓN
    // =========================

    document
        .getElementById("btnCerrarSesion")
        .addEventListener("click", () => {

            sessionStorage.removeItem("usuario");

            window.location.href = "login.html";
        });


    // =========================
    // BOTONES
    // =========================

    document
        .getElementById("btnAlumnos")
        .addEventListener("click", () => {

            alert("Módulo Alumnos próximamente");
        });


    document
        .getElementById("btnCursos")
        .addEventListener("click", () => {

            alert("Módulo Cursos próximamente");
        });


    document
        .getElementById("btnMaterias")
        .addEventListener("click", () => {

            alert("Módulo Materias próximamente");
        });


    document
        .getElementById("btnInscripciones")
        .addEventListener("click", () => {

            alert("Módulo Inscripciones próximamente");
        });


    document
        .getElementById("btnAsistencia")
        .addEventListener("click", () => {

            alert("Módulo Asistencia próximamente");
        });


    document
        .getElementById("btnCalificaciones")
        .addEventListener("click", () => {

            alert("Módulo Calificaciones próximamente");
        });


    document
        .getElementById("btnUsuarios")
        .addEventListener("click", () => {

            alert("Módulo Usuarios próximamente");
        });


    document
        .getElementById("btnComunicados")
        .addEventListener("click", () => {

            alert("Módulo Comunicados próximamente");
        });

});