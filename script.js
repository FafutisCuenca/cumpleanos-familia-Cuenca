document.addEventListener("DOMContentLoaded", iniciarCalendario);


// ============================================================
// CONFIGURACIÓN
// ============================================================

const GRUPO_WHATSAPP =
    "https://chat.whatsapp.com/IvI6oayIIoEJ8Wn7EWQxO0?s=cl&p=i&mlu=0";


// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

function iniciarCalendario() {

    const tabla = document.getElementById("calendario");

    if (!tabla) {
        console.error("No se encontró la tabla #calendario.");
        return;
    }

    const hoy = obtenerFechaActual();

    fetch("birthdays.json")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    `No se pudo cargar birthdays.json. Código HTTP: ${response.status}`
                );
            }

            return response.json();
        })

        .then(data => {

            if (!Array.isArray(data)) {
                throw new Error(
                    "birthdays.json debe contener una lista de cumpleaños."
                );
            }

            limpiarTabla(tabla);

            const cumpleañosValidos = data.filter(cumpleaños => {

                if (!cumpleaños.nombre || !cumpleaños.fecha) {
                    console.warn(
                        "Registro incompleto:",
                        cumpleaños
                    );

                    return false;
                }

                if (!esFechaValida(cumpleaños.fecha)) {
                    console.warn(
                        `Fecha inválida para ${cumpleaños.nombre}: ${cumpleaños.fecha}`
                    );

                    return false;
                }

                return true;
            });


            // ====================================================
            // ORDENAR POR MES Y DÍA
            // ====================================================

            cumpleañosValidos.sort((a, b) => {

                const fechaA = convertirFecha(a.fecha);
                const fechaB = convertirFecha(b.fecha);

                return fechaA.localeCompare(fechaB);
            });


            // ====================================================
            // CREAR LAS FILAS
            // ====================================================

            cumpleañosValidos.forEach(cumpleaños => {

                crearFilaCumpleaños(
                    tabla,
                    cumpleaños,
                    hoy
                );

            });


            // ====================================================
            // REVISAR CONFIRMACIÓN
            // ====================================================

            actualizarConfirmacion(hoy);

        })

        .catch(error => {

            console.error(
                "Error al cargar el calendario:",
                error
            );

            mostrarError(
                tabla,
                error
            );

        });
}


// ============================================================
// OBTENER FECHA ACTUAL
// Formato: MM-DD
// ============================================================

function obtenerFechaActual() {

    const ahora = new Date();

    const mes = String(
        ahora.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        ahora.getDate()
    ).padStart(2, "0");

    return `${mes}-${dia}`;
}


// ============================================================
// CONVERTIR FECHA
//
// birthdays.json:
// DD-MM
//
// Sistema interno:
// MM-DD
//
// Ejemplo:
// 04-10 → 10-04
// ============================================================

function convertirFecha(fecha) {

    if (typeof fecha !== "string") {
        return "";
    }

    const partes = fecha.split("-");

    if (partes.length !== 2) {
        return "";
    }

    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");

    return `${mes}-${dia}`;
}


// ============================================================
// VALIDAR FECHA
// ============================================================

function esFechaValida(fecha) {

    if (typeof fecha !== "string") {
        return false;
    }

    const partes = fecha.split("-");

    if (partes.length !== 2) {
        return false;
    }

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);

    if (isNaN(dia) || isNaN(mes)) {
        return false;
    }

    if (mes < 1 || mes > 12) {
        return false;
    }

    if (dia < 1 || dia > 31) {
        return false;
    }

    return true;
}


// ============================================================
// LIMPIAR TABLA
// Conserva únicamente el encabezado.
// ============================================================

function limpiarTabla(tabla) {

    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
}


// ============================================================
// CREAR FILA DE CUMPLEAÑOS
// ============================================================

function crearFilaCumpleaños(
    tabla,
    cumpleaños,
    hoy
) {

    const fecha = convertirFecha(
        cumpleaños.fecha
    );

    const esHoy = fecha === hoy;

    const fila = document.createElement("tr");


    // ========================================================
    // NOMBRE
    // ========================================================

    const celdaNombre =
        document.createElement("td");

    if (esHoy) {

        celdaNombre.classList.add("hoy");

        celdaNombre.textContent =
            `🎂 ${cumpleaños.nombre}`;

    } else {

        celdaNombre.textContent =
            cumpleaños.nombre;
    }


    // ========================================================
    // FECHA
    // ========================================================

    const celdaFecha =
        document.createElement("td");

    if (esHoy) {

        celdaFecha.classList.add("hoy");

        celdaFecha.textContent =
            `${cumpleaños.fecha} 🎉`;

    } else {

        celdaFecha.textContent =
            cumpleaños.fecha;
    }


    // ========================================================
    // AÑO DE NACIMIENTO
    // ========================================================

    if (cumpleaños.anio) {

        const textoAño =
            document.createElement("span");

        textoAño.textContent =
            ` (${cumpleaños.anio})`;

        celdaFecha.appendChild(
            textoAño
        );
    }


    // ========================================================
    // COLUMNA ACCIÓN
    // ========================================================

    const celdaAccion =
        document.createElement("td");

    if (esHoy) {

        celdaAccion.classList.add("hoy");

        const contenido =
            crearBotonesWhatsApp(
                cumpleaños
            );

        celdaAccion.appendChild(
            contenido
        );
    }


    // ========================================================
    // AGREGAR CELDAS
    // ========================================================

    fila.appendChild(
        celdaNombre
    );

    fila.appendChild(
        celdaFecha
    );

    fila.appendChild(
        celdaAccion
    );

    tabla.appendChild(
        fila
    );
}


// ============================================================
// CREAR VISTA PREVIA Y BOTÓN DE WHATSAPP
// ============================================================

function crearBotonesWhatsApp(cumpleaños) {

    const contenedor =
        document.createElement("div");

    const mensaje =
    "🎉 ¡Hoy celebramos a ${cumpleaños.nombre}! 🎂❤️\n\nToda la Familia Cuenca te desea un día maravilloso, lleno de alegría, salud y muchos momentos felices.\n\n¡Feliz cumpleaños! 🥳🎈\n\nCon cariño,\nFamilia Cuenca";

    // ========================================================
    // VISTA PREVIA
    // ========================================================

    const titulo =
        document.createElement("div");

    titulo.textContent =
        "💬 Mensaje para el grupo:";

    titulo.style.fontWeight =
        "bold";

    titulo.style.marginBottom =
        "6px";


    const vistaPrevia =
        document.createElement("div");

    vistaPrevia.textContent =
        mensaje;

    vistaPrevia.style.background =
        "#ffffff";

    vistaPrevia.style.border =
        "1px solid #ddd";

    vistaPrevia.style.borderRadius =
        "8px";

    vistaPrevia.style.padding =
        "10px";

    vistaPrevia.style.marginBottom =
        "8px";

    vistaPrevia.style.textAlign =
        "left";

    vistaPrevia.style.fontSize =
        "13px";


    // ========================================================
    // BOTÓN WHATSAPP
    // ========================================================

    const botonWhatsApp =
        document.createElement("a");

    botonWhatsApp.href =
        `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

    botonWhatsApp.target =
        "_blank";

    botonWhatsApp.rel =
        "noopener";

    botonWhatsApp.className =
        "btn whatsapp";

    botonWhatsApp.textContent =
        "💬 Abrir WhatsApp";


    // ========================================================
    // DESPUÉS DE ABRIR WHATSAPP
    // ========================================================

    botonWhatsApp.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    mostrarBotonConfirmacion(
                        cumpleaños
                    );

                },
                500
            );

        }
    );


    contenedor.appendChild(
        titulo
    );

    contenedor.appendChild(
        vistaPrevia
    );

    contenedor.appendChild(
        botonWhatsApp
    );

    return contenedor;
}


// ============================================================
// MOSTRAR BOTÓN DE CONFIRMACIÓN
// ============================================================

function mostrarBotonConfirmacion(cumpleaños) {

    const contenedor =
        document.getElementById(
            "mensajeConfirmacion"
        );

    if (!contenedor) {
        return;
    }

    contenedor.style.display =
        "block";

    contenedor.innerHTML = "";


    const texto =
        document.createElement("div");

    texto.textContent =
        `¿Ya enviaste la felicitación de ${cumpleaños.nombre} al grupo Familia Cuenca?`;

    texto.style.marginBottom =
        "10px";


    const boton =
        document.createElement("button");

    boton.className =
        "btn confirmar";

    boton.textContent =
        "✅ Sí, ya la envié";


    boton.addEventListener(
        "click",
        function () {

            confirmarEnvio(
                cumpleaños
            );

        }
    );


    contenedor.appendChild(
        texto
    );

    contenedor.appendChild(
        boton
    );
}


// ============================================================
// CONFIRMAR ENVÍO
// ============================================================

function confirmarEnvio(cumpleaños) {

    const clave =
        obtenerClaveConfirmacion(
            cumpleaños
        );

    localStorage.setItem(
        clave,
        "true"
    );

    mostrarConfirmacionFinal(
        cumpleaños
    );
}


// ============================================================
// MOSTRAR CONFIRMACIÓN FINAL
// ============================================================

function mostrarConfirmacionFinal(cumpleaños) {

    const contenedor =
        document.getElementById(
            "mensajeConfirmacion"
        );

    if (!contenedor) {
        return;
    }

    contenedor.style.display =
        "block";

    contenedor.innerHTML =
        `✅ ¡Perfecto! La felicitación de ${cumpleaños.nombre} fue confirmada como enviada al grupo Familia Cuenca.`;
}


// ============================================================
// REVISAR SI YA SE CONFIRMÓ EL ENVÍO
// ============================================================

function actualizarConfirmacion(hoy) {

    const contenedor =
        document.getElementById(
            "mensajeConfirmacion"
        );

    if (!contenedor) {
        return;
    }

    const filas =
        document.querySelectorAll(
            "#calendario tr"
        );


    filas.forEach(
        function (fila, indice) {

            if (indice === 0) {
                return;
            }

            const nombreCelda =
                fila.cells[0];

            if (!nombreCelda) {
                return;
            }

            if (!nombreCelda.classList.contains("hoy")) {
                return;
            }

            const nombre =
                nombreCelda.textContent
                    .replace("🎂 ", "")
                    .trim();


            const cumpleaños = {
                nombre: nombre
            };


            const clave =
                obtenerClaveConfirmacion(
                    cumpleaños
                );


            if (
                localStorage.getItem(clave) === "true"
            ) {

                mostrarConfirmacionFinal(
                    cumpleaños
                );
            }

        }
    );
}


// ============================================================
// CLAVE PARA LOCALSTORAGE
// ============================================================

function obtenerClaveConfirmacion(cumpleaños) {

    const fecha =
        obtenerFechaActual();

    return (
        "cumpleanos_enviado_" +
        fecha +
        "_" +
        cumpleaños.nombre
    );
}


// ============================================================
// MOSTRAR ERROR EN LA TABLA
// ============================================================

function mostrarError(
    tabla,
    error
) {

    limpiarTabla(tabla);

    const fila =
        document.createElement("tr");

    const celda =
        document.createElement("td");

    celda.colSpan = 3;

    celda.style.color =
        "#c62828";

    celda.style.background =
        "#ffebee";

    celda.style.padding =
        "20px";

    celda.innerHTML = `
        <strong>⚠️ No se pudieron cargar los cumpleaños.</strong>
        <br><br>
        Revisa que el archivo
        <strong>birthdays.json</strong>
        esté en la misma carpeta que
        <strong>index.html</strong>
        y <strong>script.js</strong>.
        <br><br>
        <small>
            ${error.message}
        </small>
    `;

    fila.appendChild(
        celda
    );

    tabla.appendChild(
        fila
    );
}
