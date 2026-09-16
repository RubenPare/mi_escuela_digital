
import { API_URL } from "./config.js";

const tablaCursos = document.getElementById("tablaCursos");
const mensaje = document.getElementById("mensaje");
const cursoForm = document.getElementById("cursoForm");

const nivelInput = document.getElementById("nivel");
const divisionInput = document.getElementById("division");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnCancelar =
    document.getElementById("btnCancelar");


// ============================================================
// VARIABLE PARA SABER SI ESTAMOS EDITANDO
// ============================================================

let cursoEditandoId = null;


// ============================================================
// MOSTRAR MENSAJE
// ============================================================

function mostrarMensaje(texto, error = false) {

    mensaje.textContent = texto;

    if (error) {
        mensaje.style.color = "red";
    } else {
        mensaje.style.color = "green";
    }

}


// ============================================================
// CARGAR CURSOS
// ============================================================

async function cargarCursos() {

    try {

        const respuesta =
            await fetch(`${API_URL}/cursos`);


        if (!respuesta.ok) {

            throw new Error(
                "Error al consultar los cursos"
            );

        }


        const cursos =
            await respuesta.json();


        console.log(
            "Cursos recibidos:",
            cursos
        );


        tablaCursos.innerHTML = "";


        if (cursos.length === 0) {

            tablaCursos.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay cursos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        cursos.forEach(curso => {

            const fila =
                document.createElement("tr");


            const estado =
                Number(curso.activo) === 1;


            fila.innerHTML = `

                <td>
                    ${curso.idcursos}
                </td>

                <td>
                    ${curso.nivel}
                </td>

                <td>
                    ${curso.division}
                </td>

                <td>
                    <span class="${
                        estado
                            ? "estado-activo"
                            : "estado-inactivo"
                    }">
                        ${
                            estado
                                ? "Activo"
                                : "Inactivo"
                        }
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        data-id="${curso.idcursos}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="${
                            estado
                                ? "btn-desactivar"
                                : "btn-activar"
                        }"
                        data-id="${curso.idcursos}"
                        data-activo="${estado ? 1 : 0}"
                    >
                        ${
                            estado
                                ? "Desactivar"
                                : "Activar"
                        }
                    </button>

                </td>

            `;


            tablaCursos.appendChild(fila);

        });


        // =====================================================
        // BOTONES EDITAR
        // =====================================================

        document
            .querySelectorAll(".btn-editar")
            .forEach(boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(boton.dataset.id);

                        const curso =
                            cursos.find(
                                item =>
                                    Number(
                                        item.idcursos
                                    ) === id
                            );


                        if (!curso) {

                            mostrarMensaje(
                                "No se encontró el curso.",
                                true
                            );

                            return;
                        }


                        iniciarEdicion(curso);

                    }
                );

            });


        // =====================================================
        // BOTONES ACTIVAR / DESACTIVAR
        // =====================================================

        document
            .querySelectorAll(
                ".btn-activar, .btn-desactivar"
            )
            .forEach(boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.id;

                        const activo =
                            Number(
                                boton.dataset.activo
                            );


                        cambiarEstadoCurso(
                            id,
                            activo
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        mostrarMensaje(
            "No se pudieron cargar los cursos.",
            true
        );

    }

}


// ============================================================
// INICIAR EDICIÓN
// ============================================================

function iniciarEdicion(curso) {

    cursoEditandoId =
        curso.idcursos;


    // Cargar datos en el formulario

    nivelInput.value =
        curso.nivel;


    divisionInput.value =
        curso.division;


    // Cambiar título

    tituloFormulario.textContent =
        "Editar Curso";


    // Cambiar botón principal

    btnGuardar.textContent =
        "Guardar cambios";


    // Mostrar cancelar

    btnCancelar.hidden = false;


    // Llevar al usuario hacia el formulario

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    nivelInput.focus();


    mostrarMensaje(
        `Editando curso ${curso.nivel}° ${curso.division}.`
    );

}


// ============================================================
// CANCELAR EDICIÓN
// ============================================================

function cancelarEdicion() {

    cursoEditandoId = null;


    cursoForm.reset();


    tituloFormulario.textContent =
        "Registrar Curso";


    btnGuardar.textContent =
        "Registrar Curso";


    btnCancelar.hidden = true;


    mensaje.textContent = "";

}


// ============================================================
// BOTÓN CANCELAR
// ============================================================

btnCancelar.addEventListener(
    "click",
    cancelarEdicion
);


// ============================================================
// REGISTRAR / EDITAR CURSO
// ============================================================

cursoForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const nivel =
            nivelInput.value.trim();


        const division =
            divisionInput.value
                .trim()
                .toUpperCase();


        // ====================================================
        // VALIDACIONES
        // ====================================================

        if (!nivel) {

            mostrarMensaje(
                "Debe ingresar el nivel.",
                true
            );

            return;
        }


        if (
            isNaN(Number(nivel)) ||
            Number(nivel) < 1
        ) {

            mostrarMensaje(
                "El nivel debe ser un número mayor o igual a 1.",
                true
            );

            return;
        }


        if (!division) {

            mostrarMensaje(
                "Debe ingresar la división.",
                true
            );

            return;
        }


        const datosCurso = {

            nivel: Number(nivel),

            division: division

        };


        try {

            let respuesta;


            // =================================================
            // EDITAR CURSO
            // =================================================

            if (cursoEditandoId !== null) {

                respuesta =
                    await fetch(
                        `${API_URL}/cursos/${cursoEditandoId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    datosCurso
                                )
                        }
                    );

            }

            // =================================================
            // REGISTRAR CURSO
            // =================================================

            else {

                respuesta =
                    await fetch(
                        `${API_URL}/cursos`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    datosCurso
                                )
                        }
                    );

            }


            // =================================================
            // CONTROL DE ERROR
            // =================================================

            if (!respuesta.ok) {

                let errorMensaje =
                    cursoEditandoId !== null
                        ? "No se pudo modificar el curso."
                        : "No se pudo registrar el curso.";


                try {

                    const error =
                        await respuesta.json();


                    errorMensaje =
                        error.detail ||
                        errorMensaje;

                } catch {
                    // Sin respuesta JSON
                }


                throw new Error(
                    errorMensaje
                );

            }


            await respuesta.json();


            // =================================================
            // MENSAJE
            // =================================================

            if (cursoEditandoId !== null) {

                mostrarMensaje(
                    "Curso modificado correctamente."
                );

            } else {

                mostrarMensaje(
                    "Curso registrado correctamente."
                );

            }


            // =================================================
            // RESTABLECER FORMULARIO
            // =================================================

            cursoEditandoId = null;


            cursoForm.reset();


            tituloFormulario.textContent =
                "Registrar Curso";


            btnGuardar.textContent =
                "Registrar Curso";


            btnCancelar.hidden = true;


            // =================================================
            // ACTUALIZAR TABLA
            // =================================================

            await cargarCursos();


        } catch (error) {

            console.error(
                "Error:",
                error
            );


            mostrarMensaje(
                error.message,
                true
            );

        }

    }
);


// ============================================================
// ACTIVAR / DESACTIVAR CURSO
// ============================================================

async function cambiarEstadoCurso(
    id,
    activoActual
) {

    const estaActivo =
        Number(activoActual) === 1;


    const nuevoEstado =
        estaActivo ? 0 : 1;


    const mensajeConfirmacion =
        estaActivo
            ? "¿Está seguro de que desea desactivar este curso?"
            : "¿Está seguro de que desea activar este curso?";


    if (
        !confirm(
            mensajeConfirmacion
        )
    ) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/cursos/${id}/estado`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            activo: nuevoEstado
                        })

                }
            );


        if (!respuesta.ok) {

            let errorMensaje =
                "No se pudo cambiar el estado del curso.";


            try {

                const error =
                    await respuesta.json();


                errorMensaje =
                    error.detail ||
                    errorMensaje;

            } catch {
                // Sin respuesta JSON
            }


            throw new Error(
                errorMensaje
            );

        }


        await respuesta.json();


        mostrarMensaje(
            nuevoEstado === 1
                ? "Curso activado correctamente."
                : "Curso desactivado correctamente."
        );


        await cargarCursos();


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        mostrarMensaje(
            error.message,
            true
        );

    }

}


// ============================================================
// INICIAR
// ============================================================

cargarCursos();

