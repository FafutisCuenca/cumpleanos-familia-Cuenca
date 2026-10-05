// ============================================================
// CALENDARIO DE CUMPLEAÑOS - FAMILIA CUENCA
// ============================================================
//
// FUENTE MAESTRA DE DATOS:
//
// https://fafutiscuenca.github.io/Familia-Cuenca/data/familia.json
//
// IMPORTANTE:
// Este calendario NO utiliza birthdays.json.
//
// Toda la información se obtiene directamente de la fuente
// maestra de la Familia Cuenca.
//
// FORMATO DE FECHA EN familia.json:
//
// DD-MM
//
// Ejemplos:
// 04-01 = 4 de enero
// 04-09 = 4 de septiembre
// 11-10 = 11 de octubre
// 25-12 = 25 de diciembre
//
// ============================================================


// ============================================================
// INICIO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarCalendario
);


// ============================================================
// CONFIGURACIÓN
// ============================================================

// ------------------------------------------------------------
// FUENTE MAESTRA
// ------------------------------------------------------------

const FUENTE_MAESTRA =
    "https://fafutiscuenca.github.io/Familia-Cuenca/data/familia.json";


// ------------------------------------------------------------
// GRUPO DE WHATSAPP
// ------------------------------------------------------------

const GRUPO_WHATSAPP =
    "https://chat.whatsapp.com/IvI6oayIIoEJ8Wn7EWQxO0?s=cl&p=i&mlu=0";


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let cumpleañosFamilia = [];

let fechaCalendario =
    new Date();

let estadisticasFamilia =
    null;


// ============================================================
// NOMBRES DE LOS MESES
// ============================================================

const nombresMeses = [

    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"

];


// ============================================================
// INICIAR CALENDARIO
// ============================================================

function iniciarCalendario() {

    const calendario =
        document.getElementById(
            "calendario"
        );


    if (!calendario) {

        console.error(
            "No se encontró el elemento #calendario."
        );

        return;

    }


    cargarCumpleaños();

}


// ============================================================
// CARGAR CUMPLEAÑOS
// ============================================================
//
// IMPORTANTE:
//
// Antes:
//
// fetch("birthdays.json")
//
// Ahora:
//
// fetch(FUENTE_MAESTRA)
//
// Esto elimina la duplicidad de información.
//
// ============================================================

async function cargarCumpleaños() {

    try {

        console.log(
            "Cargando datos desde la fuente maestra:"
        );

        console.log(
            FUENTE_MAESTRA
        );


        const respuesta =
            await fetch(
                FUENTE_MAESTRA,
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `No se pudo cargar familia.json (${respuesta.status})`
            );

        }


        const datos =
            await respuesta.json();


        if (!Array.isArray(datos)) {

            throw new Error(
                "El archivo familia.json no contiene una lista válida."
            );

        }


        // ----------------------------------------------------
        // VALIDAR Y PREPARAR REGISTROS
        // ----------------------------------------------------

        cumpleañosFamilia =
            datos.filter(
                persona => {

                    return (

                        persona &&

                        persona.nombre &&

                        persona.fecha &&

                        esFechaValida(
                            persona.fecha
                        )

                    );

                }
            );


        console.log(
            `Calendario: ${cumpleañosFamilia.length} cumpleaños cargados desde familia.json.`
        );


        // ----------------------------------------------------
        // MOSTRAR INFORMACIÓN
        // ----------------------------------------------------

        mostrarCalendario();

        mostrarCumpleanosDeHoy();


        estadisticasFamilia =
            calcularEstadisticas();


        mostrarEstadisticas();


        console.log(
            "Estadísticas Familia Cuenca:",
            estadisticasFamilia
        );


    } catch (error) {

        console.error(
            "Error cargando los datos de la Familia Cuenca:",
            error
        );


        const calendario =
            document.getElementById(
                "calendario"
            );


        if (calendario) {

            calendario.innerHTML = `

                <div class="no-results">

                    <h3>
                        No fue posible cargar
                        el calendario familiar.
                    </h3>

                    <p>
                        Verifica que el archivo maestro
                        de la Familia Cuenca esté disponible.
                    </p>

                </div>

            `;

        }

    }

}


// ============================================================
// INDICADOR VISUAL PARA FAMILIARES FINADOS
// ============================================================

function crearIconoFinado() {

    const icono =
        document.createElement(
            "span"
        );


    icono.textContent =
        " 🕊️";


    icono.style.marginLeft =
        "5px";


    icono.style.fontSize =
        "16px";


    icono.title =
        "Familiar finado";


    icono.setAttribute(
        "aria-label",
        "Familiar finado"
    );


    return icono;

}


// ============================================================
// MOSTRAR NOMBRE SEGÚN ESTATUS
// ============================================================
//
// Esta función solamente modifica la PRESENTACIÓN visual.
//
// NO modifica el nombre almacenado.
//
// NO modifica el mensaje de WhatsApp.
//
// ============================================================

function crearNombreConEstatus(
    cumpleaños
) {

    const contenedor =
        document.createElement(
            "span"
        );


    const nombre =
        document.createElement(
            "span"
        );


    nombre.textContent =
        cumpleaños.nombre;


    contenedor.appendChild(
        nombre
    );


    if (
        cumpleaños.estatus ===
        "Finado"
    ) {

        contenedor.appendChild(
            crearIconoFinado()
        );

    }


    return contenedor;

}


// ============================================================
// ESTADÍSTICAS
// ============================================================

function calcularEstadisticas() {

    const total =
        cumpleañosFamilia.length;


    const mujeres =
        cumpleañosFamilia.filter(
            persona =>
                persona.genero === "F"
        ).length;


    const hombres =
        cumpleañosFamilia.filter(
            persona =>
                persona.genero === "M"
        ).length;


    const vivos =
        cumpleañosFamilia.filter(
            persona =>
                persona.estatus === "Vivo"
        ).length;


    const finados =
        cumpleañosFamilia.filter(
            persona =>
                persona.estatus === "Finado"
        ).length;


    const porMes = {};


    nombresMeses.forEach(
        mes => {

            porMes[mes] = 0;

        }
    );


    cumpleañosFamilia.forEach(
        persona => {

            if (
                persona.mes &&
                porMes[
                    persona.mes
                ] !== undefined
            ) {

                porMes[
                    persona.mes
                ]++;

            }

        }
    );


    const porPais = {};


    cumpleañosFamilia.forEach(
        persona => {

            const pais =
                persona.pais ||
                "Sin país registrado";


            if (
                !porPais[pais]
            ) {

                porPais[pais] = 0;

            }


            porPais[pais]++;

        }
    );


    const porEstado = {};


    cumpleañosFamilia.forEach(
        persona => {

            const estado =
                persona.estado ||
                "Sin estado registrado";


            if (
                !porEstado[estado]
            ) {

                porEstado[estado] = 0;

            }


            porEstado[estado]++;

        }
    );


    const porCiudad = {};


    cumpleañosFamilia.forEach(
        persona => {

            const ciudad =
                persona.ciudad ||
                "Sin ciudad registrada";


            if (
                !porCiudad[ciudad]
            ) {

                porCiudad[ciudad] = 0;

            }


            porCiudad[ciudad]++;

        }
    );


    // --------------------------------------------------------
    // FECHAS COMPARTIDAS
    // --------------------------------------------------------

    const fechas = {};


    cumpleañosFamilia.forEach(
        persona => {

            if (!fechas[persona.fecha]) {

                fechas[persona.fecha] = [];

            }


            fechas[
                persona.fecha
            ].push(
                persona.nombre
            );

        }
    );


    const fechasCompartidas =
        Object.entries(fechas)
            .filter(
                ([fecha, personas]) =>
                    personas.length > 1
            )
            .map(
                ([fecha, personas]) => ({

                    fecha,

                    personas

                })
            );


    return {

        total,

        mujeres,

        hombres,

        vivos,

        finados,

        porMes,

        porPais,

        porEstado,

        porCiudad,

        fechasCompartidas

    };

}


// ============================================================
// MOSTRAR ESTADÍSTICAS
// ============================================================

function mostrarEstadisticas() {

    mostrarEstadisticasGenerales();

    mostrarEstadisticasPorMes();

    mostrarEstadisticasGeograficas();

    mostrarMesMayor();

    mostrarFechasCompartidas();

}


// ============================================================
// ESTADÍSTICAS GENERALES
// ============================================================

function mostrarEstadisticasGenerales() {

    const elemento =
        document.getElementById(
            "estadisticasGenerales"
        );


    if (!elemento) {
        return;
    }


    elemento.innerHTML = `

        <div class="estadistica-item">

            <strong>
                ${estadisticasFamilia.total}
            </strong>

            <span>
                Familiares
            </span>

        </div>


        <div class="estadistica-item">

            <strong>
                ${estadisticasFamilia.mujeres}
            </strong>

            <span>
                Mujeres
            </span>

        </div>


        <div class="estadistica-item">

            <strong>
                ${estadisticasFamilia.hombres}
            </strong>

            <span>
                Hombres
            </span>

        </div>


        <div class="estadistica-item">

            <strong>
                ${estadisticasFamilia.vivos}
            </strong>

            <span>
                Vivos
            </span>

        </div>


        <div class="estadistica-item">

            <strong>
                ${estadisticasFamilia.finados}
            </strong>

            <span>
                En memoria 🕊️
            </span>

        </div>

    `;

}


// ============================================================
// ESTADÍSTICAS POR MES
// ============================================================

function mostrarEstadisticasPorMes() {

    const elemento =
        document.getElementById(
            "estadisticasPorMes"
        );


    if (!elemento) {
        return;
    }


    elemento.innerHTML =
        nombresMeses
            .map(
                mes => `

                    <div class="estadistica-mes">

                        <span>
                            ${mes}
                        </span>

                        <strong>
                            ${
                                estadisticasFamilia
                                    .porMes[mes]
                            }
                        </strong>

                    </div>

                `
            )
            .join("");

}


// ============================================================
// ESTADÍSTICAS GEOGRÁFICAS
// ============================================================

function mostrarEstadisticasGeograficas() {

    const elemento =
        document.getElementById(
            "estadisticasGeograficas"
        );


    if (!elemento) {
        return;
    }


    const paises =
        Object.entries(
            estadisticasFamilia.porPais
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    elemento.innerHTML =
        paises
            .map(
                ([pais, cantidad]) => `

                    <div class="estadistica-geografica">

                        <span>
                            ${pais}
                        </span>

                        <strong>
                            ${cantidad}
                        </strong>

                    </div>

                `
            )
            .join("");

}


// ============================================================
// LISTA GEOGRÁFICA
// ============================================================

function mostrarListaGeografica(
    datos
) {

    if (!datos) {
        return "";
    }


    return Object.entries(datos)
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .map(
            ([nombre, cantidad]) => `

                <div class="lista-geografica-item">

                    <span>
                        ${nombre}
                    </span>

                    <strong>
                        ${cantidad}
                    </strong>

                </div>

            `
        )
        .join("");

}


// ============================================================
// MES CON MAYOR CANTIDAD DE CUMPLEAÑOS
// ============================================================

function mostrarMesMayor() {

    const elemento =
        document.getElementById(
            "mesMayor"
        );


    if (!elemento) {
        return;
    }


    let mayor =
        null;


    nombresMeses.forEach(
        mes => {

            const cantidad =
                estadisticasFamilia
                    .porMes[mes];


            if (
                mayor === null ||
                cantidad > mayor.cantidad
            ) {

                mayor = {

                    mes,

                    cantidad

                };

            }

        }
    );


    if (!mayor) {
        return;
    }


    elemento.innerHTML = `

        <strong>
            ${mayor.mes}
        </strong>

        <span>
            ${mayor.cantidad}
            cumpleaños
        </span>

    `;

}


// ============================================================
// FECHAS COMPARTIDAS
// ============================================================

function mostrarFechasCompartidas() {

    const elemento =
        document.getElementById(
            "fechasCompartidas"
        );


    if (!elemento) {
        return;
    }


    if (
        !estadisticasFamilia
            .fechasCompartidas.length
    ) {

        elemento.innerHTML = `

            <p>
                No hay fechas de cumpleaños
                compartidas registradas.
            </p>

        `;

        return;

    }


    elemento.innerHTML =
        estadisticasFamilia
            .fechasCompartidas
            .map(
                fecha => {

                    const personas =
                        cumpleañosFamilia
                            .filter(
                                persona =>
                                    persona.fecha ===
                                    fecha.fecha
                            );


                    return `

                        <div class="fecha-compartida">

                            <strong>
                                ${
                                    formatearFechaEstadistica(
                                        fecha.fecha
                                    )
                                }
                            </strong>


                            <div class="personasFecha">

                                ${
                                    personas
                                        .map(
                                            persona => {

                                                const icono =
                                                    persona.estatus ===
                                                    "Finado"
                                                        ? " 🕊️"
                                                        : "";

                                                return `👤 ${
                                                    persona.nombre
                                                }${icono}`;

                                            }
                                        )
                                        .join("<br>")
                                }

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


// ============================================================
// FORMATEAR FECHA PARA ESTADÍSTICAS
// ============================================================

function formatearFechaEstadistica(
    fecha
) {

    const partes =
        fecha.split("-");


    if (
        partes.length !== 2
    ) {

        return fecha;

    }


    const dia =
        parseInt(
            partes[0],
            10
        );


    const mes =
        parseInt(
            partes[1],
            10
        );


    return `${dia} de ${
        nombresMeses[mes - 1]
    }`;

}


// ============================================================
// MOSTRAR CALENDARIO
// ============================================================

function mostrarCalendario() {

    const calendario =
        document.getElementById(
            "calendario"
        );


    if (!calendario) {
        return;
    }


    const ano =
        fechaCalendario.getFullYear();


    const mes =
        fechaCalendario.getMonth();


    const primerDia =
        new Date(
            ano,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        );


    const diasMes =
        ultimoDia.getDate();


    let inicioSemana =
        primerDia.getDay();


    // Convertir domingo = 0
    // a lunes = 0

    inicioSemana =
        inicioSemana === 0
            ? 6
            : inicioSemana - 1;


    let html = `

        <div class="calendario-header">

            <button
                type="button"
                id="mesAnterior"
            >
                ‹
            </button>


            <h2>
                ${nombresMeses[mes]}
                ${ano}
            </h2>


            <button
                type="button"
                id="mesSiguiente"
            >
                ›
            </button>

        </div>


        <div class="calendario-grid">

            <div class="dia-semana">
                L
            </div>

            <div class="dia-semana">
                M
            </div>

            <div class="dia-semana">
                M
            </div>

            <div class="dia-semana">
                J
            </div>

            <div class="dia-semana">
                V
            </div>

            <div class="dia-semana">
                S
            </div>

            <div class="dia-semana">
                D
            </div>

    `;


    // --------------------------------------------------------
    // ESPACIOS ANTERIORES
    // --------------------------------------------------------

    for (
        let i = 0;
        i < inicioSemana;
        i++
    ) {

        html += `
            <div class="dia calendario-vacio"></div>
        `;

    }


    // --------------------------------------------------------
    // DÍAS DEL MES
    // --------------------------------------------------------

    for (
        let dia = 1;
        dia <= diasMes;
        dia++
    ) {

        html +=
            crearCeldaDia(
                dia,
                mes + 1,
                ano
            );

    }


    html += `

        </div>

    `;


    calendario.innerHTML =
        html;


    // --------------------------------------------------------
    // EVENTOS DE NAVEGACIÓN
    // --------------------------------------------------------

    const anterior =
        document.getElementById(
            "mesAnterior"
        );


    const siguiente =
        document.getElementById(
            "mesSiguiente"
        );


    if (anterior) {

        anterior.addEventListener(
            "click",
            () => {

                fechaCalendario =
                    new Date(
                        ano,
                        mes - 1,
                        1
                    );


                mostrarCalendario();

            }
        );

    }


    if (siguiente) {

        siguiente.addEventListener(
            "click",
            () => {

                fechaCalendario =
                    new Date(
                        ano,
                        mes + 1,
                        1
                    );


                mostrarCalendario();

            }
        );

    }

}


// ============================================================
// CREAR CELDA DEL CALENDARIO
// ============================================================

function crearCeldaDia(
    dia,
    mes,
    ano
) {

    const fecha =
        `${String(dia).padStart(2, "0")}-${String(mes).padStart(2, "0")}`;


    const cumpleaños =
        cumpleañosFamilia.filter(
            persona =>
                persona.fecha === fecha
        );


    const hoy =
        new Date();


    const esHoy =
        hoy.getDate() === dia &&
        hoy.getMonth() + 1 === mes &&
        hoy.getFullYear() === ano;


    let html = `

        <div
            class="dia ${
                esHoy
                    ? "dia-hoy"
                    : ""
            } ${
                cumpleaños.length
                    ? "dia-con-cumpleanos"
                    : ""
            }"
        >

            <div class="numero-dia">

                ${dia}

            </div>

    `;


    cumpleaños.forEach(
        cumpleañosPersona => {

            const esFinado =
                cumpleañosPersona.estatus ===
                "Finado";


            html += `

                <div
                    class="cumpleanos-persona ${
                        esFinado
                            ? "cumpleanos-finado"
                            : ""
                    }"
                    title="${
                        esFinado
                            ? "Familiar finado"
                            : "Cumpleaños"
                    }"
                >

                    🎂
                    ${cumpleañosPersona.nombre}

                    ${
                        esFinado
                            ? " 🕊️"
                            : ""
                    }

                </div>

            `;

        }
    );


    html += `

        </div>

    `;


    return html;

}


// ============================================================
// MOSTRAR DETALLE DE CUMPLEAÑOS
// ============================================================

function mostrarDetalleCumpleanos(
    cumpleaños
) {

    const detalle =
        document.getElementById(
            "detalleCumpleanos"
        );


    if (!detalle) {
        return;
    }


    detalle.innerHTML = "";


    const nombrePersona =
        document.createElement(
            "div"
        );


    const iconoCumpleanos =
        document.createElement(
            "span"
        );


    iconoCumpleanos.textContent =
        "🎂 ";


    nombrePersona.appendChild(
        iconoCumpleanos
    );


    nombrePersona.appendChild(
        crearNombreConEstatus(
            cumpleaños
        )
    );


    detalle.appendChild(
        nombrePersona
    );

}


// ============================================================
// CUMPLEAÑOS DE HOY
// ============================================================

function mostrarCumpleanosDeHoy() {

    const hoy =
        new Date();


    const dia =
        String(
            hoy.getDate()
        ).padStart(
            2,
            "0"
        );


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const fechaHoy =
        `${dia}-${mes}`;


    const cumpleañosHoy =
        cumpleañosFamilia.filter(
            persona =>
                persona.fecha ===
                fechaHoy
        );


    const contenedor =
        document.getElementById(
            "cumpleanosHoy"
        );


    if (!contenedor) {
        return;
    }


    if (
        !cumpleañosHoy.length
    ) {

        contenedor.innerHTML = `

            <div class="sin-cumpleanos-hoy">

                <p>
                    Hoy no tenemos cumpleaños
                    registrados.
                </p>

            </div>

        `;

        return;

    }


    contenedor.innerHTML =
        "";


    cumpleañosHoy.forEach(
        cumpleaños => {

            const nombrePersona =
                document.createElement(
                    "div"
                );


            const iconoCumpleanos =
                document.createElement(
                    "span"
                );


            iconoCumpleanos.textContent =
                "🎂 ";


            nombrePersona.appendChild(
                iconoCumpleanos
            );


            nombrePersona.appendChild(
                crearNombreConEstatus(
                    cumpleaños
                )
            );


            contenedor.appendChild(
                nombrePersona
            );

        }
    );

}


// ============================================================
// MENSAJE DE CUMPLEAÑOS PARA WHATSAPP
// ============================================================
//
// MUY IMPORTANTE:
//
// Aquí NO agregamos 🕊️ al nombre.
//
// El nombre debe permanecer limpio porque este texto
// será enviado a WhatsApp.
//
// ============================================================

function crearMensajeCumpleanos(
    cumpleaños
) {

    return `🎉 ¡Hoy celebramos a ${cumpleaños.nombre}! 🎂❤️

Toda la Familia Cuenca te desea un día maravilloso, lleno de alegría, salud y muchos momentos felices.

¡Feliz cumpleaños! 🥳🎈

Con cariño,
Familia Cuenca`;

}


// ============================================================
// MOSTRAR MENSAJE DE WHATSAPP
// ============================================================

function mostrarMensajeWhatsApp(
    cumpleaños
) {

    const modal =
        document.getElementById(
            "whatsappModal"
        );


    if (!modal) {
        return;
    }


    const nombre =
        modal.querySelector(
            ".whatsapp-nombre"
        );


    const mensaje =
        modal.querySelector(
            ".whatsapp-mensaje"
        );


    if (nombre) {

        nombre.innerHTML =
            "";


        const nombreTitulo =
            document.createElement(
                "div"
            );


        nombreTitulo.appendChild(
            document.createTextNode(
                "🎂 "
            )
        );


        nombreTitulo.appendChild(
            crearNombreConEstatus(
                cumpleaños
            )
        );


        nombre.appendChild(
            nombreTitulo
        );

    }


    if (mensaje) {

        mensaje.textContent =
            crearMensajeCumpleanos(
                cumpleaños
            );

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    mostrarBotonConfirmacion(
        cumpleaños
    );

}


// ============================================================
// BOTÓN DE CONFIRMACIÓN
// ============================================================

function mostrarBotonConfirmacion(
    cumpleaños
) {

    const boton =
        document.getElementById(
            "confirmarWhatsApp"
        );


    if (!boton) {
        return;
    }


    boton.onclick =
        () => {

            confirmarEnvio(
                cumpleaños
            );

        };

}


// ============================================================
// CONFIRMAR ENVÍO
// ============================================================

function confirmarEnvio(
    cumpleaños
) {

    const mensaje =
        crearMensajeCumpleanos(
            cumpleaños
        );


    const url =
        `https://wa.me/?text=${encodeURIComponent(
            mensaje
        )}`;


    window.open(
        url,
        "_blank"
    );


    mostrarConfirmacionFinal(
        cumpleaños
    );

}


// ============================================================
// CONFIRMACIÓN FINAL
// ============================================================

function mostrarConfirmacionFinal(
    cumpleaños
) {

    const elemento =
        document.getElementById(
            "confirmacionFinal"
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        `Mensaje preparado para ${cumpleaños.nombre}.`;

}


// ============================================================
// CONFIRMACIÓN DE ENVÍO DEL DÍA
// ============================================================

function actualizarConfirmacionHoy() {

    const clave =
        obtenerClaveConfirmacion();


    if (
        localStorage.getItem(
            clave
        )
    ) {

        return true;

    }


    return false;

}


// ============================================================
// CLAVE DE CONFIRMACIÓN
// ============================================================

function obtenerClaveConfirmacion() {

    const hoy =
        new Date();


    return `cumpleanos-confirmado-${
        hoy.getFullYear()
    }-${
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0")
    }-${
        String(
            hoy.getDate()
        ).padStart(2, "0")
    }`;

}


// ============================================================
// FECHA ACTUAL
// ============================================================

function obtenerFechaActual() {

    const hoy =
        new Date();


    return {

        dia:
            hoy.getDate(),

        mes:
            hoy.getMonth() + 1,

        año:
            hoy.getFullYear()

    };

}


// ============================================================
// CONVERTIR FECHA
// ============================================================
//
// Convierte DD-MM a objeto Date.
//
// ============================================================

function convertirFecha(
    fecha
) {

    if (!fecha) {
        return null;
    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 2
    ) {

        return null;

    }


    const dia =
        parseInt(
            partes[0],
            10
        );


    const mes =
        parseInt(
            partes[1],
            10
        ) - 1;


    if (
        isNaN(dia) ||
        isNaN(mes)
    ) {

        return null;

    }


    return new Date(
        2000,
        mes,
        dia
    );

}


// ============================================================
// VALIDAR FECHA
// ============================================================

function esFechaValida(
    fecha
) {

    if (!fecha) {
        return false;
    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 2
    ) {

        return false;

    }


    const dia =
        parseInt(
            partes[0],
            10
        );


    const mes =
        parseInt(
            partes[1],
            10
        );


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

}
