import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

    const tablaAlumnos = document.getElementById("tablaAlumnos");
    const modalAlumno = document.getElementById("modalAlumno");
    const btnNuevoAlumno = document.getElementById("btnNuevoAlumno");
    const btnCerrarModal = document.getElementById("btnCerrarModal");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnVolver = document.getElementById("btnVolver");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const formAlumno = document.getElementById("formAlumno");
    const buscarAlumno = document.getElementById("buscarAlumno");


    // ==========================================
    // ABRIR MODAL - NUEVO ALUMNO
    // ==========================================

    btnNuevoAlumno.addEventListener("click", () => {

        formAlumno.reset();

        delete formAlumno.dataset.id;

        modalAlumno.classList.remove("oculto");

    });


    // ==========================================
    // CERRAR MODAL
    // ==========================================

    function cerrarModal() {

        modalAlumno.classList.add("oculto");

        formAlumno.reset();

        delete formAlumno.dataset.id;

    }


    btnCerrarModal.addEventListener("click", cerrarModal);

    btnCancelar.addEventListener("click", cerrarModal);


    // ==========================================
    // VOLVER AL DASHBOARD
    // ==========================================

    btnVolver.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    btnCerrarSesion.addEventListener("click", () => {

        localStorage.removeItem("usuario");

        window.location.href = "login.html";

    });


    // ==========================================
    // CARGAR ALUMNOS
    // ==========================================

    async function cargarAlumnos() {

        try {

            const response = await fetch(
                `${API_URL}/alumnos`
            );

            if (!response.ok) {

                throw new Error(
                    "No se pudieron obtener los alumnos"
                );

            }

            const alumnos = await response.json();

            mostrarAlumnos(alumnos);

        } catch (error) {

            console.error(error);

            tablaAlumnos.innerHTML = `
                <tr>
                    <td colspan="7" class="mensaje-tabla">
                        ❌ Error al conectar con el servidor.
                    </td>
                </tr>
            `;

        }

    }


    // ==========================================
    // MOSTRAR ALUMNOS
    // ==========================================

    function mostrarAlumnos(alumnos) {

        tablaAlumnos.innerHTML = "";

        if (alumnos.length === 0) {

            tablaAlumnos.innerHTML = `
                <tr>
                    <td colspan="7" class="mensaje-tabla">
                        No hay alumnos registrados.
                    </td>
                </tr>
            `;

            return;

        }


        alumnos.forEach(alumno => {

            const fila = document.createElement("tr");

            fila.innerHTML = `

                <td>${alumno.legajo}</td>

                <td>${alumno.apellido}</td>

                <td>${alumno.nombre}</td>

                <td>${alumno.documento}</td>

                <td>${alumno.mail || "-"}</td>

                <td>
                    ${
                        alumno.activo == 1
                            ? "Activo"
                            : "Inactivo"
                    }
                </td>

                <td>

                    <button
                        class="btn-editar"
                        data-id="${alumno.idalumnos}">
                        ✏️ Editar
                    </button>

                    <button
                        class="btn-estado"
                        data-id="${alumno.idalumnos}">
                        ${
                            alumno.activo == 1
                                ? "🔴 Desactivar"
                                : "🟢 Activar"
                        }
                    </button>

                </td>

            `;

            tablaAlumnos.appendChild(fila);

        });


        // ==========================================
        // BOTONES EDITAR
        // ==========================================

        document
            .querySelectorAll(".btn-editar")
            .forEach(boton => {

                boton.addEventListener("click", () => {

                    const id = boton.dataset.id;

                    editarAlumno(id);

                });

            });


        // ==========================================
        // BOTONES ESTADO
        // ==========================================

        document
            .querySelectorAll(".btn-estado")
            .forEach(boton => {

                boton.addEventListener("click", () => {

                    const id = boton.dataset.id;

                    cambiarEstadoAlumno(id);

                });

            });

    }


    // ==========================================
    // GUARDAR / MODIFICAR ALUMNO
    // ==========================================

    formAlumno.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const datos = {

                legajo:
                    document
                        .getElementById("legajo")
                        .value,

                nombre:
                    document
                        .getElementById("nombre")
                        .value,

                apellido:
                    document
                        .getElementById("apellido")
                        .value,

                documento:
                    parseInt(
                        document
                            .getElementById("documento")
                            .value
                    ),

                mail:
                    document
                        .getElementById("mail")
                        .value || null,

                fecha_nacimiento:
                    document
                        .getElementById("fecha_nacimiento")
                        .value || null

            };


            // ==========================================
            // NUEVO O EDICIÓN
            // ==========================================

            const idAlumno =
                formAlumno.dataset.id;

            let url =
                `${API_URL}/alumnos`;

            let metodo = "POST";


            if (idAlumno) {

                url =
                    `${API_URL}/alumnos/${idAlumno}`;

                metodo = "PUT";

            }


            // ==========================================
            // ENVIAR AL BACKEND
            // ==========================================

            try {

                const response =
                    await fetch(
                        url,
                        {

                            method: metodo,

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(datos)

                        }
                    );


                const resultado =
                    await response.json();


                // ==========================================
                // RESPUESTA
                // ==========================================

                if (response.ok) {

                    if (idAlumno) {

                        alert(
                            "✅ Alumno modificado correctamente"
                        );

                    } else {

                        alert(
                            "✅ Alumno registrado correctamente"
                        );

                    }


                    cerrarModal();

                    cargarAlumnos();


                } else {

                    alert(
                        "❌ Error: " +
                        (
                            resultado.detail ||
                            "No se pudo guardar el alumno"
                        )
                    );

                }


            } catch (error) {

                console.error(error);

                alert(
                    "❌ No se pudo conectar con el servidor."
                );

            }

        }
    );


    // ==========================================
    // EDITAR ALUMNO
    // ==========================================

    async function editarAlumno(id) {

        try {

            const response =
                await fetch(
                    `${API_URL}/alumnos`
                );


            if (!response.ok) {

                throw new Error(
                    "No se pudieron obtener los alumnos"
                );

            }


            const alumnos =
                await response.json();


            const alumno =
                alumnos.find(
                    a => a.idalumnos == id
                );


            if (!alumno) {

                alert(
                    "Alumno no encontrado"
                );

                return;

            }


            document.getElementById("legajo").value =
                alumno.legajo || "";


            document.getElementById("nombre").value =
                alumno.nombre || "";


            document.getElementById("apellido").value =
                alumno.apellido || "";


            document.getElementById("documento").value =
                alumno.documento || "";


            document.getElementById("mail").value =
                alumno.mail || "";


            document.getElementById("fecha_nacimiento").value =
                alumno.fecha_nacimiento
                    ? alumno.fecha_nacimiento.substring(0, 10)
                    : "";


            // Guardamos el ID que estamos editando

            formAlumno.dataset.id = id;


            // Abrimos modal

            modalAlumno.classList.remove("oculto");


        } catch (error) {

            console.error(error);

            alert(
                "❌ No se pudo cargar el alumno."
            );

        }

    }


    // ==========================================
    // ACTIVAR / DESACTIVAR ALUMNO
    // ==========================================

    async function cambiarEstadoAlumno(id) {

        const confirmar =
            confirm(
                "¿Querés cambiar el estado de este alumno?"
            );


        if (!confirmar) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/alumnos/${id}/estado`,
                    {
                        method: "PUT"
                    }
                );


            const resultado =
                await response.json();


            if (!response.ok) {

                alert(
                    "❌ Error: " +
                    (
                        resultado.detail ||
                        "No se pudo cambiar el estado"
                    )
                );

                return;

            }


            alert(
                "✅ " + resultado.mensaje
            );


            cargarAlumnos();


        } catch (error) {

            console.error(error);

            alert(
                "❌ No se pudo conectar con el servidor."
            );

        }

    }


    // ==========================================
    // BUSCADOR
    // ==========================================

    buscarAlumno.addEventListener(
        "input",
        () => {

            const texto =
                buscarAlumno.value.toLowerCase();


            const filas =
                tablaAlumnos.querySelectorAll("tr");


            filas.forEach(fila => {

                const contenido =
                    fila.textContent.toLowerCase();


                fila.style.display =
                    contenido.includes(texto)
                        ? ""
                        : "none";

            });

        }
    );


    // ==========================================
    // INICIO
    // ==========================================

    cargarAlumnos();

});