

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// CARGAR MATERIAS
// ============================================================

async function cargarMaterias() {

    try {

        const respuesta = await fetch(`${API_URL}/materias`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las materias");
        }

        const materias = await respuesta.json();

        mostrarMaterias(materias);

    } catch (error) {

        console.error(error);

        alert("Error al cargar las materias");
    }
}


// ============================================================
// MOSTRAR MATERIAS
// ============================================================

function mostrarMaterias(materias) {

    const tabla = document.getElementById("tablaMaterias");
    const sinResultados = document.getElementById("sinResultados");

    tabla.innerHTML = "";

    if (materias.length === 0) {

        sinResultados.style.display = "block";
        return;

    } else {

        sinResultados.style.display = "none";
    }

    materias.forEach(materia => {

        const fila = document.createElement("tr");

        const estado = materia.activo
            ? "Activo"
            : "Inactivo";

        fila.innerHTML = `
            <td>${materia.idmaterias}</td>

            <td>${materia.nombre}</td>

            <td>
                <span class="estado ${materia.activo ? "activo" : "inactivo"}">
                    ${estado}
                </span>
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarMateria(${materia.idmaterias}, '${materia.nombre.replace(/'/g, "\\'")}')">
                    Editar
                </button>

                ${
                    materia.activo
                    ?
                    `
                    <button
                        class="btn-desactivar"
                        onclick="desactivarMateria(${materia.idmaterias})">
                        Desactivar
                    </button>
                    `
                    :
                    `
                    <button
                        class="btn-activar"
                        onclick="activarMateria(${materia.idmaterias})">
                        Activar
                    </button>
                    `
                }

            </td>
        `;

        tabla.appendChild(fila);
    });
}


// ============================================================
// FILTRAR MATERIAS
// ============================================================

function filtrarMaterias() {

    const texto = document
        .getElementById("buscarMateria")
        .value
        .toLowerCase();

    const filas = document.querySelectorAll(
        "#tablaMaterias tr"
    );

    filas.forEach(fila => {

        const nombre = fila
            .children[1]
            .textContent
            .toLowerCase();

        fila.style.display =
            nombre.includes(texto)
                ? ""
                : "none";
    });
}


// ============================================================
// ABRIR MODAL NUEVA MATERIA
// ============================================================

function abrirModal() {

    document.getElementById("modalMateria").style.display = "flex";

    document.getElementById("tituloModal").textContent =
        "Nueva Materia";

    document.getElementById("idMateria").value = "";

    document.getElementById("nombreMateria").value = "";

    document.getElementById("mensajeModal").textContent = "";

    document.getElementById("nombreMateria").focus();
}


// ============================================================
// CERRAR MODAL
// ============================================================

function cerrarModal() {

    document.getElementById("modalMateria").style.display = "none";
}


// ============================================================
// EDITAR MATERIA
// ============================================================

function editarMateria(id, nombre) {

    document.getElementById("modalMateria").style.display = "flex";

    document.getElementById("tituloModal").textContent =
        "Editar Materia";

    document.getElementById("idMateria").value = id;

    document.getElementById("nombreMateria").value = nombre;

    document.getElementById("mensajeModal").textContent = "";

    document.getElementById("nombreMateria").focus();
}


// ============================================================
// GUARDAR MATERIA
// ============================================================

async function guardarMateria() {

    const id = document.getElementById("idMateria").value;

    const nombre = document
        .getElementById("nombreMateria")
        .value
        .trim();

    const mensaje = document.getElementById("mensajeModal");

    if (!nombre) {

        mensaje.textContent =
            "Ingrese el nombre de la materia.";

        return;
    }

    try {

        let respuesta;

        if (id) {

            respuesta = await fetch(
                `${API_URL}/materias/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre: nombre
                    })
                }
            );

        } else {

            respuesta = await fetch(
                `${API_URL}/materias`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre: nombre
                    })
                }
            );
        }

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.detail || "Error al guardar la materia"
            );
        }

        cerrarModal();

        cargarMaterias();

    } catch (error) {

        console.error(error);

        mensaje.textContent = error.message;
    }
}


// ============================================================
// DESACTIVAR MATERIA
// ============================================================

async function desactivarMateria(id) {

    const confirmar = confirm(
        "¿Está seguro de que desea desactivar esta materia?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/materias/${id}/desactivar`,
            {
                method: "PUT"
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.detail || "No se pudo desactivar la materia"
            );
        }

        alert(datos.mensaje);

        cargarMaterias();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ============================================================
// ACTIVAR MATERIA
// ============================================================

async function activarMateria(id) {

    const confirmar = confirm(
        "¿Desea activar nuevamente esta materia?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/materias/${id}/activar`,
            {
                method: "PUT"
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.detail || "No se pudo activar la materia"
            );
        }

        alert(datos.mensaje);

        cargarMaterias();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ============================================================
// INICIO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    cargarMaterias
);

