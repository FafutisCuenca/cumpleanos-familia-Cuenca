/*

* ============================================================
* 🎂 CALENDARIO DE CUMPLEAÑOS - FAMILIA CUENCA
* ============================================================
*
* Este archivo controla:
*
* 1. Lectura de birthdays.json
* 2. Detección del cumpleaños de hoy
* 3. Ordenamiento de cumpleaños
* 4. Resaltado del cumpleaños actual
* 5. Generación del mensaje de WhatsApp
* 6. Confirmación manual del envío
* 7. Almacenamiento de la confirmación en el navegador
*
* IMPORTANTE:
* Las fechas de birthdays.json deben estar en formato:
*
* DD-MM
*
* Ejemplo:
*
* "04-10" = 4 de octubre
*
* ============================================================
  */

document.addEventListener("DOMContentLoaded", iniciarCalendario);

/*

* ============================================================
* FUNCIÓN PRINCIPAL
* ============================================================
  */

function iniciarCalendario() {

```
const tabla = document.getElementById("calendario");

if (!tabla) {
    console.error("No se encontró la tabla #calendario.");
    return;
}

// Obtener la fecha actual usando la hora LOCAL
// del dispositivo del usuario.
const hoy = obtenerFechaActual();

// Cargar cumpleaños
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

        // Verificar que sea un arreglo
        if (!Array.isArray(data)) {
            throw new Error(
                "birthdays.json debe contener una lista de cumpleaños."
            );
        }

        // Limpiar filas existentes excepto encabezado
        limpiarTabla(tabla);

        // Eliminar datos inválidos
        const cumpleañosValidos = data.filter(c => {

            if (!c.nombre || !c.fecha) {
                console.warn(
                    "Se encontró un registro sin nombre o fecha:",
                    c
                );

                return false;
            }

            if (!esFechaValida(c.fecha)) {
                console.warn(
                    `Fecha inválida para ${c.nombre}: ${c.fecha}`
                );

                return false;
            }

            return true;
        });

        // Ordenar cronológicamente
        cumpleañosValidos.sort((a, b) => {

            const fechaA = convertirFecha(a.fecha);
            const fechaB = convertirFecha(b.fecha);

            return fechaA.localeCompare(fechaB);
        });

        // Crear las filas
        cumpleañosValidos.forEach(c => {

            crearFilaCumpleaños(
                tabla,
                c,
                hoy
            );

        });

        // Revisar si existe una felicitación
        // confirmada anteriormente.
        actualizarConfirmacion(hoy);

    })

    .catch(error => {

        console.error(
            "Error al cargar el calendario:",
            error
        );

        mostrarError(tabla);
    });
```

}

/*

* ============================================================
* OBTENER FECHA ACTUAL
* ============================================================
*
* Devuelve la fecha en formato:
*
* MM-DD
*
* utilizando la hora LOCAL.
*
* NO utilizamos:
*
* new Date().toISOString()
*
* porque convierte la fecha a UTC y puede producir
* problemas alrededor de la medianoche.
  */

function obtenerFechaActual() {

```
const ahora = new Date();

const mes = String(
    ahora.getMonth() + 1
).padStart(2, "0");

const dia = String(
    ahora.getDate()
).padStart(2, "0");

return `${mes}-${dia}`;
```

}

/*

* ============================================================
* CONVERTIR FECHA
* ============================================================
*
* birthdays.json utiliza:
*
* DD-MM
*
* El sistema trabaja internamente con:
*
* MM-DD
*
* Ejemplo:
*
* 04-10 → 10-04
  */

function convertirFecha(fecha) {

```
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
```

}

/*

* ============================================================
* VALIDAR FECHA
* ============================================================
*
* Comprueba que la fecha tenga el formato:
*
* DD-MM
*
* y que día y mes sean válidos.
  */

function esFechaValida(fecha) {

```
if (typeof fecha !== "string") {
    return false;
}

const partes = fecha.split("-");

if (partes.length !== 2) {
    return false;
}

const dia = parseInt(partes[0], 10);
const mes = parseInt(partes[1], 10);

if (
    isNaN(dia) ||
    isNaN(mes)
) {
    return false;
}

if (
    mes < 1 ||
    mes > 12
) {
    return false;
}

if (
    dia < 1 ||
    dia > 31
) {
    return false;
}

return true;
```

}

/*

* ============================================================
* LIMPIAR TABLA
* ============================================================
*
* Conserva únicamente el encabezado.
  */

function limpiarTabla(tabla) {

```
while (tabla.rows.length > 1) {
    tabla.deleteRow(1);
}
```

}

/*

* ============================================================
* CREAR FILA DE CUMPLEAÑOS
* ============================================================
  */

function crearFilaCumpleaños(
tabla,
cumpleaños,
hoy
) {

```
const fecha = convertirFecha(
    cumpleaños.fecha
);

const esHoy = (
    fecha === hoy
);

const fila = document.createElement("tr");


/*
 * --------------------------------------------------------
 * COLUMNA NOMBRE
 * --------------------------------------------------------
 */

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


/*
 * --------------------------------------------------------
 * COLUMNA FECHA
 * --------------------------------------------------------
 */

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


/*
 * --------------------------------------------------------
 * AÑO DE NACIMIENTO
 * --------------------------------------------------------
 */

if (cumpleaños.anio) {

    const textoAño =
        document.createElement("span");

    textoAño.textContent =
        ` (${cumpleaños.anio})`;

    celdaFecha.appendChild(
        textoAño
    );
}


/*
 * --------------------------------------------------------
 * COLUMNA ACCIÓN
 * --------------------------------------------------------
 */

const celdaAccion =
    document.createElement("td");

if (esHoy) {

    celdaAccion.classList.add("hoy");

    crearBotonesWhatsApp(
        celdaAccion,
        cumpleaños
    );

}


/*
 * --------------------------------------------------------
 * AGREGAR CELDAS
 * --------------------------------------------------------
 */

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
```

}

/*

* ============================================================
* CREAR BOTONES DE WHATSAPP
* ============================================================
  */

function crearBotonesWhatsApp(cumpleaños) {

    const contenedor = document.createElement("div");

    const mensaje = `🎉 ¡Hoy celebramos a ${cumpleaños.nombre}! 🎂 Que tengas un día lleno de alegría ❤️ - Familia Cuenca`;

    // Vista previa del mensaje
    const vistaPrevia = document.createElement("div");

    vistaPrevia.style.marginTop = "10px";
    vistaPrevia.style.padding = "12px";
    vistaPrevia.style.background = "#f5f5f5";
    vistaPrevia.style.border = "1px solid #ddd";
    vistaPrevia.style.borderRadius = "8px";
    vistaPrevia.style.textAlign = "left";
    vistaPrevia.style.fontSize = "14px";

    vistaPrevia.innerHTML = `
        <strong>💬 Mensaje que se enviará al grupo:</strong>
        <div style="
            margin-top:8px;
            padding:10px;
            background:white;
            border-radius:6px;
            color:#333;
        ">
            ${mensaje}
        </div>
    `;

    // Botón para abrir WhatsApp
    const botonWhatsApp = document.createElement("a");

    botonWhatsApp.href =
        `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

    botonWhatsApp.target = "_blank";
    botonWhatsApp.rel = "noopener";
    botonWhatsApp.className = "btn whatsapp";
    botonWhatsApp.textContent = "💬 Abrir WhatsApp";

    // Cuando se abre WhatsApp mostramos la confirmación
    botonWhatsApp.addEventListener("click", function () {

        setTimeout(() => {
            mostrarBotonConfirmacion(cumpleaños);
        }, 500);

    });

    contenedor.appendChild(vistaPrevia);
    contenedor.appendChild(botonWhatsApp);

    return contenedor;
}
/*
 * ----------------------------------------*
```
