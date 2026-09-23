

let asignaciones = [];
let usuarios = [];
let materias = [];
let cursos = [];
let ciclosLectivos = [];

let asignacionEditando = null;


// ============================================================
// INICIO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    cargarDatos();
    cargarAsignaciones();

});


// ============================================================
// CARGAR DATOS PARA LOS SELECT
// ============================================================

async function cargarDatos() {

    try {

        await Promise.all([
            cargarUsuarios(),
            cargarMaterias(),
            cargarCursos(),
            cargarCiclosLectivos()
        ]);

    } catch (error) {

        console.error("Error cargando datos:", error);

        mostrarMensaje(
            "No se pudieron cargar los datos necesarios.",
            "error"
        );
    }
}


// ============================================================
// USUARIOS
// ============================================================

async function cargarUsuarios() {

    const respuesta = await fetch(
        `${API_URL}/usuarios`
    );

    if (!respuesta.ok) {
        throw new Error("Error al cargar usuarios");
    }

    usuarios = await respuesta.json();

    const select = document.getElementById("usuario_id");

    select.innerHTML = `
        <option value="">
            Seleccionar profesor
        </option>
    `;

    usuarios.forEach(usuario => {

        const opcion = document.createElement("option");

        opcion.value = usuario.idusuarios;

        opcion.textContent =
            `${usuario.apellido}, ${usuario.nombre}`;

        select.appendChild(opcion);

    });
}


// ============================================================
// MATERIAS
// ============================================================

async function cargarMaterias() {

    const respuesta = await fetch(
        `${API_URL}/materias`
    );

    if (!respuesta.ok) {
        throw new Error("Error al cargar materias");
    }

    materias = await respuesta.json();

    const select = document.getElementById("materia_id");

    select.innerHTML = `
        <option value="">
            Seleccionar materia
        </option>
    `;

    materias
        .filter(materia => materia.activo !== false)
        .forEach(materia => {

            const opcion = document.createElement("option");

            opcion.value = materia.idmaterias;

            opcion.textContent = materia.nombre;

            select.appendChild(opcion);

        });
}


// ============================================================
// CURSOS
// ============================================================

async function cargarCursos() {

    const respuesta = await fetch(
        `${API_URL}/cursos`
    );

    if (!respuesta.ok) {
        throw new Error("Error al cargar cursos");
    }

    cursos = await respuesta.json();

    const select = document.getElementById("curso_id");

    select.innerHTML = `
        <option value="">
            Seleccionar curso
        </option>
    `;

    cursos
        .filter(curso => curso.activo === 1)
        .forEach(curso => {

            const opcion = document.createElement("option");

            opcion.value = curso.idcursos;

            opcion.textContent =
                `${curso.nivel}° ${curso.division}`;

            select.appendChild(opcion);

        });
}


// ============================================================
// CICLOS LECTIVOS
// ============================================================

async function cargarCiclosLectivos() {

    const respuesta = await fetch(
        `${API_URL}/ciclos_lectivos`
    );

    if (!respuesta.ok) {
        throw new Error("Error al cargar ciclos lectivos");
    }

    ciclosLectivos = await respuesta.json();

    const select =
        document.getElementById("ciclo_lectivo_id");

    select.innerHTML = `
        <option value="">
            Seleccionar ciclo lectivo
        </option>
    `;

    ciclosLectivos
        .filter(ciclo => ciclo.activo === 1)
        .forEach(ciclo => {

            const opcion = document.createElement("option");

            opcion.value =
                ciclo.idciclos_lectivos;

            opcion.textContent =
                ciclo.año;

            select.appendChild(opcion);

        });
}


// ============================================================
// CARGAR ASIGNACIONES
// ============================================================

async function cargarAsignaciones() {

    const tabla =
        document.getElementById("tablaAsignaciones");

    try {

        const respuesta = await fetch(
            `${API_URL}/asignaciones`
        );

        if (!respuesta.ok) {
            throw new Error(
                "Error al cargar asignaciones"
            );
        }

        asignaciones = await respuesta.json();

        mostrarAsignaciones();

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="sin-datos">
                    No se pudieron cargar las asignaciones.
                </td>
            </tr>
        `;

    }
}


// ============================================================
// MOSTRAR ASIGNACIONES
// ============================================================

function mostrarAsignaciones(lista = asignaciones) {

    const tabla =
        document.getElementById("tablaAsignaciones");

    if (lista.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="sin-datos">
                    No hay asignaciones registradas.
                </td>
            </tr>
        `;

        return;
    }

    tabla.innerHTML = "";

    lista.forEach(asignacion => {

        const usuario = usuarios.find(
            usuario =>
                usuario.idusuarios === asignacion.usuario_id
        );

        const materia = materias.find(
            materia =>
                materia.idmaterias === asignacion.materia_id
        );

        const curso = cursos.find(
            curso =>
                curso.idcursos === asignacion.curso_id
        );

        const ciclo = ciclosLectivos.find(
            ciclo =>
                ciclo.idciclos_lectivos ===
                asignacion.ciclo_lectivo_id
        );

        const tr = document.createElement("tr");

        const profesor = usuario
            ? `${usuario.apellido}, ${usuario.nombre}`
            : "Sin datos";

        const nombreMateria = materia
            ? materia.nombre
            : "Sin datos";

        const nombreCurso = curso
            ? `${curso.nivel}° ${curso.division}`
            : "Sin datos";

        const añoCiclo = ciclo
            ? ciclo.año
            : "Sin datos";

        const activo = Number(asignacion.activo) === 1;

        tr.innerHTML = `
            <td>${asignacion.idasignaciones}</td>

            <td>${profesor}</td>

            <td>${nombreMateria}</td>

            <td>${nombreCurso}</td>

            <td>${añoCiclo}</td>

            <td>
                <strong>
                    ${activo ? "Activo" : "Inactivo"}
                </strong>
            </td>

            <td>

                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarAsignacion(
                        ${asignacion.idasignaciones}
                    )"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="btn-estado"
                    onclick="cambiarEstadoAsignacion(
                        ${asignacion.idasignaciones}
                    )"
                >
                    ${activo ? "Desactivar" : "Activar"}
                </button>

            </td>
        `;

        tabla.appendChild(tr);

    });
}


// ============================================================
// CREAR / MODIFICAR
// ============================================================

document
    .getElementById("formAsignacion")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const usuario_id =
            Number(
                document.getElementById("usuario_id").value
            );

        const materia_id =
            Number(
                document.getElementById("materia_id").value
            );

        const curso_id =
            Number(
                document.getElementById("curso_id").value
            );

        const ciclo_lectivo_id =
            Number(
                document.getElementById("ciclo_lectivo_id").value
            );

        if (
            !usuario_id ||
            !materia_id ||
            !curso_id ||
            !ciclo_lectivo_id
        ) {

            mostrarMensaje(
                "Complete todos los campos.",
                "error"
            );

            return;
        }

        const datos = {
            usuario_id: usuario_id,
            materia_id: materia_id,
            curso_id: curso_id,
            ciclo_lectivo_id: ciclo_lectivo_id
        };

        try {

            let respuesta;

            if (asignacionEditando === null) {

                respuesta = await fetch(
                    `${API_URL}/asignaciones`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(datos)
                    }
                );

            } else {

                respuesta = await fetch(
                    `${API_URL}/asignaciones/${asignacionEditando}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(datos)
                    }
                );

            }

            const resultado =
                await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    resultado.detail ||
                    "Error al guardar la asignación"
                );

            }

            mostrarMensaje(
                resultado.mensaje ||
                "Asignación guardada correctamente.",
                "exito"
            );

            cancelarEdicion();

            await cargarAsignaciones();

        } catch (error) {

            console.error(error);

            mostrarMensaje(
                error.message,
                "error"
            );
        }

    });


// ============================================================
// EDITAR ASIGNACIÓN
// ============================================================

function editarAsignacion(id) {

    const asignacion = asignaciones.find(
        item =>
            item.idasignaciones === id
    );

    if (!asignacion) {

        mostrarMensaje(
            "No se encontró la asignación.",
            "error"
        );

        return;
    }

    asignacionEditando = id;

    document.getElementById("usuario_id").value =
        asignacion.usuario_id;

    document.getElementById("materia_id").value =
        asignacion.materia_id;

    document.getElementById("curso_id").value =
        asignacion.curso_id;

    document.getElementById("ciclo_lectivo_id").value =
        asignacion.ciclo_lectivo_id;

    document.getElementById("btnGuardar").textContent =
        "Guardar Cambios";

    document.getElementById("btnCancelar").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================================
// CANCELAR EDICIÓN
// ============================================================

function cancelarEdicion() {

    asignacionEditando = null;

    document.getElementById("formAsignacion").reset();

    document.getElementById("btnGuardar").textContent =
        "Crear Asignación";

    document.getElementById("btnCancelar").style.display =
        "none";
}


document
    .getElementById("btnCancelar")
    .addEventListener(
        "click",
        cancelarEdicion
    );


// ============================================================
// ACTIVAR / DESACTIVAR
// ============================================================

async function cambiarEstadoAsignacion(id) {

    const asignacion = asignaciones.find(
        item =>
            item.idasignaciones === id
    );

    if (!asignacion) {
        return;
    }

    const activo =
        Number(asignacion.activo) === 1;

    const confirmar = confirm(
        activo
            ? "¿Desea desactivar esta asignación?"
            : "¿Desea activar esta asignación?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/asignaciones/${id}/estado`,
            {
                method: "PUT"
            }
        );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                resultado.detail ||
                "No se pudo cambiar el estado."
            );
        }

        mostrarMensaje(
            resultado.mensaje,
            "exito"
        );

        await cargarAsignaciones();

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            "error"
        );
    }
}


// ============================================================
// BUSCADOR
// ============================================================

document
    .getElementById("buscarAsignacion")
    .addEventListener(
        "input",
        function() {

            const texto =
                this.value
                    .toLowerCase()
                    .trim();

            if (!texto) {

                mostrarAsignaciones();

                return;
            }

            const resultado =
                asignaciones.filter(asignacion => {

                    const usuario =
                        usuarios.find(
                            usuario =>
                                usuario.idusuarios ===
                                asignacion.usuario_id
                        );

                    const materia =
                        materias.find(
                            materia =>
                                materia.idmaterias ===
                                asignacion.materia_id
                        );

                    const curso =
                        cursos.find(
                            curso =>
                                curso.idcursos ===
                                asignacion.curso_id
                        );

                    const ciclo =
                        ciclosLectivos.find(
                            ciclo =>
                                ciclo.idciclos_lectivos ===
                                asignacion.ciclo_lectivo_id
                        );

                    const textoAsignacion = [

                        asignacion.idasignaciones,

                        usuario
                            ? usuario.nombre
                            : "",

                        usuario
                            ? usuario.apellido
                            : "",

                        materia
                            ? materia.nombre
                            : "",

                        curso
                            ? curso.nivel
                            : "",

                        curso
                            ? curso.division
                            : "",

                        ciclo
                            ? ciclo.año
                            : ""

                    ]
                        .join(" ")
                        .toLowerCase();

                    return textoAsignacion.includes(
                        texto
                    );

                });

            mostrarAsignaciones(resultado);

        }
    );


// ============================================================
// MENSAJES
// ============================================================

function mostrarMensaje(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById("mensaje");

    mensaje.textContent = texto;

    mensaje.className =
        `mensaje ${tipo}`;

    mensaje.style.display =
        "block";

    setTimeout(() => {

        mensaje.style.display =
            "none";

    }, 4000);
}