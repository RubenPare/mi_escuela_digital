
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

const nombreRol =
    roles[usuario.fkrol_id] || "Usuario";

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
// ALUMNOS
// =========================

document
    .getElementById("btnAlumnos")
    .addEventListener("click", () => {

        window.location.href = "alumnos.html";

    });


// =========================
// CURSOS
// =========================

document
    .getElementById("btnCursos")
    .addEventListener("click", () => {

        window.location.href = "cursos.html";

    });


// =========================
// MATERIAS
// =========================

document
    .getElementById("btnMaterias")
    .addEventListener("click", () => {

        window.location.href = "materias.html";

    });


// =========================
// INSCRIPCIONES
// =========================

document
    .getElementById("btnInscripciones")
    .addEventListener("click", () => {

        alert("Módulo Inscripciones próximamente");

    });


// =========================
// ASISTENCIA
// =========================

document
    .getElementById("btnAsistencia")
    .addEventListener("click", () => {

        alert("Módulo Asistencia próximamente");

    });


// =========================
// CALIFICACIONES
// =========================

document
    .getElementById("btnCalificaciones")
    .addEventListener("click", () => {

        alert("Módulo Calificaciones próximamente");

    });


// =========================
// USUARIOS
// =========================

document
    .getElementById("btnUsuarios")
    .addEventListener("click", () => {

        alert("Módulo Usuarios próximamente");

    });


// =========================
// COMUNICADOS
// =========================

document
    .getElementById("btnComunicados")
    .addEventListener("click", () => {

        alert("Módulo Comunicados próximamente");

    });


});
