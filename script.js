// ============================================================
// FAMILIA CUENCA
// CALENDARIO DE CUMPLEAÑOS Y ESTADÍSTICAS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarCalendario
);


// ============================================================
// CONFIGURACIÓN
// ============================================================

const GRUPO_WHATSAPP =
    "https://chat.whatsapp.com/";


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let cumpleañosFamilia = [];

let fechaCalendario =
    new Date();

let estadisticasFamilia = {};


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

    cargarCumpleaños();

}


// ============================================================
// CARGAR CUMPLEAÑOS
// ============================================================

async function cargarCumpleaños() {

    try {

        const respuesta =
            await fetch("birthdays.json");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar birthdays.json"
            );

        }

        const datos =
            await respuesta.json();


        // --------------------------------------------------------
        // VALIDAR INFORMACIÓN
        // --------------------------------------------------------

        cumpleañosFamilia =
            datos.filter(
                persona =>
                    persona.nombre &&
                    persona.fecha &&
                    esFechaValida(persona.fecha)
            );


        // --------------------------------------------------------
        // CALCULAR ESTADÍSTICAS
        // --------------------------------------------------------

        estadisticasFamilia =
            calcularEstadisticas();


        // --------------------------------------------------------
        // MOSTRAR CALENDARIO
        // --------------------------------------------------------

        mostrarCalendario();


        // --------------------------------------------------------
        // MOSTRAR CUMPLEAÑOS DE HOY
        // --------------------------------------------------------

        mostrarCumpleanosDeHoy();


        // --------------------------------------------------------
        // MOSTRAR ESTADÍSTICAS
        // --------------------------------------------------------

        mostrarEstadisticas();


        // --------------------------------------------------------
        // CONSOLA
        // --------------------------------------------------------

        console.log(
            "INEGI CUENCA:",
            estadisticasFamilia
        );

    }

    catch (error) {

        console.error(
            "Error cargando cumpleaños:",
            error
        );

        mostrarError(
            "No fue posible cargar la información de cumpleaños."
        );

    }

}


// ============================================================
// INDICADOR VISUAL PARA FAMILIARES FINADOS
// ============================================================

function crearIconoFinado() {

    const icono =
        document.createElement("span");

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

function crearNombreConEstatus(cumpleaños) {

    const contenedor =
        document.createElement("span");

    const nombre =
        document.createElement("span");

    nombre.textContent =
        cumpleaños.nombre;

    contenedor.appendChild(
        nombre
    );


    // --------------------------------------------------------
    // SI ESTÁ FINADO, MOSTRAR 🕊️
    // --------------------------------------------------------

    if (
        cumpleaños.estatus === "Finado"
    ) {

        contenedor.appendChild(
            crearIconoFinado()
        );

    }


    return contenedor;

}


// ============================================================
// CALCULAR ESTADÍSTICAS
// ============================================================

function calcularEstadisticas() {

    const estadisticas = {

        total:
            cumpleañosFamilia.length,

        mujeres: 0,

        hombres: 0,

        vivos: 0,

        finados: 0,

        porMes:
            new Array(12).fill(0),

        porPais: {},

        porEstado: {},

        porCiudad: {},

        fechasCompartidas: []

    };


    // --------------------------------------------------------
    // RECORRER FAMILIA
    // --------------------------------------------------------

    cumpleañosFamilia.forEach(
        persona => {


            // ------------------------------------------------
            // GÉNERO
            // ------------------------------------------------

            if (
                persona.genero === "F"
            ) {

                estadisticas.mujeres++;

            }

            else if (
                persona.genero === "M"
            ) {

                estadisticas.hombres++;

            }


            // ------------------------------------------------
            // ESTATUS
            // ------------------------------------------------

            if (
                persona.estatus === "Finado"
            ) {

                estadisticas.finados++;

            }

            else {

                estadisticas.vivos++;

            }


            // ------------------------------------------------
            // MES
            // ------------------------------------------------

            const partes =
                persona.fecha.split("-");

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
                mes >= 1 &&
                mes <= 12
            ) {

                estadisticas.porMes[
                    mes - 1
                ]++;

            }


            // ------------------------------------------------
            // PAÍS
            // ------------------------------------------------

            const pais =
                persona.pais ||
                "No especificado";

            if (
                !estadisticas.porPais[pais]
            ) {

                estadisticas.porPais[pais] =
                    0;

            }

            estadisticas.porPais[pais]++;


            // ------------------------------------------------
            // ESTADO
            // ------------------------------------------------

            const estado =
                persona.estado ||
                "No especificado";

            if (
                !estadisticas.porEstado[estado]
            ) {

                estadisticas.porEstado[estado] =
                    0;

            }

            estadisticas.porEstado[estado]++;


            // ------------------------------------------------
            // CIUDAD
            // ------------------------------------------------

            const ciudad =
                persona.ciudad ||
                "No especificada";

            if (
                !estadisticas.porCiudad[ciudad]
            ) {

                estadisticas.porCiudad[ciudad] =
                    0;

            }

            estadisticas.porCiudad[ciudad]++;

        }
    );


    // ========================================================
    // FECHAS COMPARTIDAS
    // ========================================================

    const fechas = {};


    cumpleañosFamilia.forEach(
        persona => {

            if (
                !fechas[persona.fecha]
            ) {

                fechas[persona.fecha] =
                    [];

            }

            fechas[persona.fecha].push(
                persona
            );

        }
    );


    Object.keys(fechas).forEach(
        fecha => {

            if (
                fechas[fecha].length > 1
            ) {

                estadisticas
                    .fechasCompartidas
                    .push({

                        fecha:
                            fecha,

                        personas:
                            fechas[fecha]

                    });

            }

        }
    );


    return estadisticas;

}


// ============================================================
// OBTENER MES CON MÁS CUMPLEAÑOS
// ============================================================

function obtenerMesMayor() {

    if (
        !estadisticasFamilia.porMes
    ) {

        return null;

    }


    let mayor =
        0;

    let indice =
        0;


    estadisticasFamilia
        .porMes
        .forEach(
            (cantidad, i) => {

                if (
                    cantidad > mayor
                ) {

                    mayor =
                        cantidad;

                    indice =
                        i;

                }

            }
        );


    return {

        mes:
            nombresMeses[indice],

        cantidad:
            mayor

    };

}


// ============================================================
// OBTENER FECHAS COMPARTIDAS
// ============================================================

function obtenerFechasCompartidas() {

    return
        estadisticasFamilia
            .fechasCompartidas ||
        [];

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

        console.warn(
            "No existe el elemento #calendario"
        );

        return;

    }


    calendario.innerHTML =
        "";


    const año =
        fechaCalendario.getFullYear();

    const mes =
        fechaCalendario.getMonth();


    // --------------------------------------------------------
    // TÍTULO DEL MES
    // --------------------------------------------------------

    const tituloMes =
        document.getElementById(
            "mesActual"
        );


    if (tituloMes) {

        tituloMes.textContent =
            `${nombresMeses[mes]} ${año}`;

    }


    // --------------------------------------------------------
    // PRIMER DÍA
    // --------------------------------------------------------

    const primerDia =
        new Date(
            año,
            mes,
            1
        );


    // --------------------------------------------------------
    // NÚMERO DE DÍAS
    // --------------------------------------------------------

    const ultimoDia =
        new Date(
            año,
            mes + 1,
            0
        );


    const diasMes =
        ultimoDia.getDate();


    // --------------------------------------------------------
    // DÍA DE LA SEMANA
    // --------------------------------------------------------

    let diaSemana =
        primerDia.getDay();


    // Convertir domingo = 0
    // a lunes = 0

    diaSemana =
        diaSemana === 0
            ? 6
            : diaSemana - 1;


    // --------------------------------------------------------
    // ESPACIOS ANTES DEL PRIMER DÍA
    // --------------------------------------------------------

    for (
        let i = 0;
        i < diaSemana;
        i++
    ) {

        const espacio =
            document.createElement(
                "div"
            );

        espacio.className =
            "dia vacio";

        calendario.appendChild(
            espacio
        );

    }


    // --------------------------------------------------------
    // CREAR DÍAS
    // --------------------------------------------------------

    for (
        let dia = 1;
        dia <= diasMes;
        dia++
    ) {

        const celda =
            crearCeldaDia(
                dia,
                mes,
                año
            );

        calendario.appendChild(
            celda
        );

    }

}


// ============================================================
// CREAR CELDA DEL DÍA
// ============================================================

function crearCeldaDia(
    dia,
    mes,
    año
) {

    const celda =
        document.createElement(
            "div"
        );

    celda.className =
        "dia";


    // --------------------------------------------------------
    // NÚMERO DEL DÍA
    // --------------------------------------------------------

    const numero =
        document.createElement(
            "div"
        );

    numero.className =
        "numeroDia";

    numero.textContent =
        dia;

    celda.appendChild(
        numero
    );


    // --------------------------------------------------------
    // FECHA EN FORMATO DD-MM
    // --------------------------------------------------------

    const diaTexto =
        String(dia).padStart(
            2,
            "0"
        );

    const mesTexto =
        String(mes + 1).padStart(
            2,
            "0"
        );

    const fecha =
        `${diaTexto}-${mesTexto}`;


    // --------------------------------------------------------
    // BUSCAR CUMPLEAÑOS
    // --------------------------------------------------------

    const cumpleaños =
        cumpleañosFamilia.filter(
            persona =>
                persona.fecha === fecha
        );


    // --------------------------------------------------------
    // MOSTRAR CUMPLEAÑOS
    // --------------------------------------------------------

    if (
        cumpleaños.length > 0
    ) {

        celda.classList.add(
            "tieneCumpleanos"
        );


        const indicador =
            document.createElement(
                "div"
            );

        indicador.className =
            "indicadorCumpleanos";


        cumpleaños.forEach(
            cumpleañosPersona => {

                const nombre =
                    document.createElement(
                        "div"
                    );


                // ------------------------------------------------
                // ICONO DE CUMPLEAÑOS
                // ------------------------------------------------

                const iconoCumpleanos =
                    document.createElement(
                        "span"
                    );

                iconoCumpleanos.textContent =
                    "🎂 ";


                nombre.appendChild(
                    iconoCumpleanos
                );


                // ------------------------------------------------
                // NOMBRE + 🕊️ SI CORRESPONDE
                // ------------------------------------------------

                nombre.appendChild(
                    crearNombreConEstatus(
                        cumpleañosPersona
                    )
                );


                indicador.appendChild(
                    nombre
                );

            }
        );


        celda.appendChild(
            indicador
        );


        // --------------------------------------------------------
        // CLICK EN DÍA
        // --------------------------------------------------------

        celda.style.cursor =
            "pointer";

        celda.addEventListener(
            "click",
            () => {

                mostrarDetalleCumpleanos(
                    cumpleaños,
                    dia,
                    mes,
                    año
                );

            }
        );

    }


    // --------------------------------------------------------
    // MARCAR HOY
    // --------------------------------------------------------

    const hoy =
        new Date();


    if (
        dia === hoy.getDate() &&
        mes === hoy.getMonth() &&
        año === hoy.getFullYear()
    ) {

        celda.classList.add(
            "hoy"
        );

    }


    return celda;

}


// ============================================================
// MOSTRAR DETALLE DE CUMPLEAÑOS
// ============================================================

function mostrarDetalleCumpleanos(
    cumpleaños,
    dia,
    mes,
    año
) {

    const contenedor =
        document.getElementById(
            "detalleCumpleanos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const titulo =
        document.createElement(
            "h3"
        );

    titulo.textContent =
        `🎉 Cumpleaños del ${dia} de ${nombresMeses[mes]}`;

    contenedor.appendChild(
        titulo
    );


    cumpleaños.forEach(
        persona => {


            const nombrePersona =
                document.createElement(
                    "div"
                );


            // ------------------------------------------------
            // ICONO 🎂
            // ------------------------------------------------

            const iconoCumpleanos =
                document.createElement(
                    "span"
                );

            iconoCumpleanos.textContent =
                "🎂 ";


            nombrePersona.appendChild(
                iconoCumpleanos
            );


            // ------------------------------------------------
            // NOMBRE + 🕊️
            // ------------------------------------------------

            nombrePersona.appendChild(
                crearNombreConEstatus(
                    persona
                )
            );


            nombrePersona.style.fontWeight =
                "bold";

            nombrePersona.style.color =
                "#ff4081";

            nombrePersona.style.fontSize =
                "18px";


            contenedor.appendChild(
                nombrePersona
            );


            // ------------------------------------------------
            // AÑO DE NACIMIENTO
            // ------------------------------------------------

            if (
                persona.anio
            ) {

                const añoNacimiento =
                    document.createElement(
                        "div"
                    );

                añoNacimiento.textContent =
                    `Año de nacimiento: ${persona.anio}`;

                añoNacimiento.style.marginBottom =
                    "10px";

                contenedor.appendChild(
                    añoNacimiento
                );

            }


            // ------------------------------------------------
            // BOTÓN WHATSAPP
            // ------------------------------------------------

            const boton =
                document.createElement(
                    "button"
                );

            boton.textContent =
                "📲 Enviar felicitación";

            boton.onclick =
                () => {

                    mostrarMensajeWhatsApp(
                        persona
                    );

                };


            contenedor.appendChild(
                boton
            );


        }
    );

}


// ============================================================
// MOSTRAR CUMPLEAÑOS DE HOY
// ============================================================

function mostrarCumpleanosDeHoy() {

    const contenedor =
        document.getElementById(
            "cumpleanosHoy"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const hoy =
        new Date();


    const fechaHoy =
        `${String(
            hoy.getDate()
        ).padStart(2, "0")}-${String(
            hoy.getMonth() + 1
        ).padStart(2, "0")}`;


    const cumpleañosHoy =
        cumpleañosFamilia.filter(
            persona =>
                persona.fecha === fechaHoy
        );


    if (
        cumpleañosHoy.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No tenemos cumpleaños registrados para hoy.</p>";

        actualizarConfirmacionHoy(
            []
        );

        return;

    }


    const titulo =
        document.createElement(
            "h2"
        );

    titulo.textContent =
        "🎂 ¡Cumpleaños de hoy!";

    contenedor.appendChild(
        titulo
    );


    cumpleañosHoy.forEach(
        cumpleaños => {


            const bloque =
                document.createElement(
                    "div"
                );


            const nombrePersona =
                document.createElement(
                    "div"
                );


            // ------------------------------------------------
            // ICONO 🎂
            // ------------------------------------------------

            const iconoCumpleanos =
                document.createElement(
                    "span"
                );

            iconoCumpleanos.textContent =
                "🎂 ";


            nombrePersona.appendChild(
                iconoCumpleanos
            );


            // ------------------------------------------------
            // NOMBRE + 🕊️
            // ------------------------------------------------

            nombrePersona.appendChild(
                crearNombreConEstatus(
                    cumpleaños
                )
            );


            nombrePersona.style.fontSize =
                "24px";

            nombrePersona.style.fontWeight =
                "bold";

            nombrePersona.style.color =
                "#ff4081";


            bloque.appendChild(
                nombrePersona
            );


            // ------------------------------------------------
            // MENSAJE
            // ------------------------------------------------

            const mensaje =
                crearMensajeCumpleanos(
                    cumpleaños
                );


            const texto =
                document.createElement(
                    "p"
                );

            texto.textContent =
                mensaje;


            bloque.appendChild(
                texto
            );


            // ------------------------------------------------
            // PREVISUALIZACIÓN
            // ------------------------------------------------

            const preview =
                document.createElement(
                    "div"
                );

            preview.className =
                "previewMensaje";

            preview.textContent =
                mensaje;


            bloque.appendChild(
                preview
            );


            // ------------------------------------------------
            // BOTÓN WHATSAPP
            // ------------------------------------------------

            const boton =
                document.createElement(
                    "button"
                );

            boton.textContent =
                "📲 Enviar felicitación por WhatsApp";


            boton.onclick =
                () => {

                    mostrarMensajeWhatsApp(
                        cumpleaños
                    );

                };


            bloque.appendChild(
                boton
            );


            contenedor.appendChild(
                bloque
            );

        }
    );


    actualizarConfirmacionHoy(
        cumpleañosHoy
    );

}


// ============================================================
// CREAR MENSAJE DE CUMPLEAÑOS
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

    const contenedor =
        document.getElementById(
            "mensajeWhatsApp"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    // --------------------------------------------------------
    // NOMBRE VISUAL
    // --------------------------------------------------------

    const nombre =
        document.createElement(
            "div"
        );


    const nombreTitulo =
        document.createElement(
            "div"
        );


    const iconoCumpleanos =
        document.createElement(
            "span"
        );

    iconoCumpleanos.textContent =
        "🎂 ";


    nombreTitulo.appendChild(
        iconoCumpleanos
    );


    nombreTitulo.appendChild(
        crearNombreConEstatus(
            cumpleaños
        )
    );


    nombre.appendChild(
        nombreTitulo
    );


    nombre.style.fontSize =
        "22px";

    nombre.style.fontWeight =
        "bold";

    nombre.style.color =
        "#ff4081";


    contenedor.appendChild(
        nombre
    );


    // --------------------------------------------------------
    // MENSAJE
    // --------------------------------------------------------

    const mensaje =
        crearMensajeCumpleanos(
            cumpleaños
        );


    const texto =
        document.createElement(
            "textarea"
        );

    texto.value =
        mensaje;

    texto.readOnly =
        true;

    texto.style.width =
        "100%";

    texto.style.minHeight =
        "180px";


    contenedor.appendChild(
        texto
    );


    // --------------------------------------------------------
    // BOTÓN
    // --------------------------------------------------------

    const boton =
        document.createElement(
            "button"
        );

    boton.textContent =
        "📲 Abrir WhatsApp";


    boton.onclick =
        () => {

            const url =
                "https://wa.me/?text=" +
                encodeURIComponent(
                    mensaje
                );

            window.open(
                url,
                "_blank"
            );

        };


    contenedor.appendChild(
        boton
    );


    mostrarBotonConfirmacion(
        cumpleaños
    );

}


// ============================================================
// MOSTRAR BOTÓN DE CONFIRMACIÓN
// ============================================================

function mostrarBotonConfirmacion(
    cumpleaños
) {

    const contenedor =
        document.getElementById(
            "confirmacionCumpleanos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const boton =
        document.createElement(
            "button"
        );

    boton.textContent =
        "✅ Marcar felicitación como enviada";


    boton.onclick =
        () => {

            confirmarEnvio(
                cumpleaños
            );

        };


    contenedor.appendChild(
        boton
    );

}


// ============================================================
// CONFIRMAR ENVÍO
// ============================================================

function confirmarEnvio(
    cumpleaños
) {

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

function mostrarConfirmacionFinal(
    cumpleaños
) {

    const contenedor =
        document.getElementById(
            "confirmacionCumpleanos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const mensaje =
        document.createElement(
            "p"
        );

    mensaje.textContent =
        `✅ Felicitación registrada para ${cumpleaños.nombre}.`;

    mensaje.style.color =
        "green";

    mensaje.style.fontWeight =
        "bold";


    contenedor.appendChild(
        mensaje
    );

}


// ============================================================
// ACTUALIZAR CONFIRMACIÓN DE HOY
// ============================================================

function actualizarConfirmacionHoy(
    cumpleaños
) {

    const contenedor =
        document.getElementById(
            "confirmacionesHoy"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    cumpleaños.forEach(
        persona => {

            const clave =
                obtenerClaveConfirmacion(
                    persona
                );


            const enviado =
                localStorage.getItem(
                    clave
                );


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.textContent =
                enviado === "true"
                    ? `✅ ${persona.nombre}`
                    : `⏳ ${persona.nombre}`;


            contenedor.appendChild(
                elemento
            );

        }
    );

}


// ============================================================
// CLAVE DE CONFIRMACIÓN
// ============================================================

function obtenerClaveConfirmacion(
    cumpleaños
) {

    return `cumpleanos_enviado_${cumpleaños.fecha}_${cumpleaños.nombre}`;

}


// ============================================================
// OBTENER FECHA ACTUAL
// ============================================================

function obtenerFechaActual() {

    const hoy =
        new Date();


    return `${String(
        hoy.getDate()
    ).padStart(2, "0")}-${String(
        hoy.getMonth() + 1
    ).padStart(2, "0")}`;

}


// ============================================================
// CONVERTIR FECHA
// ============================================================

function convertirFecha(
    fecha
) {

    const partes =
        fecha.split("-");


    if (
        partes.length !== 2
    ) {

        return null;

    }


    return {

        dia:
            parseInt(
                partes[0],
                10
            ),

        mes:
            parseInt(
                partes[1],
                10
            ) - 1

    };

}


// ============================================================
// VALIDAR FECHA
// ============================================================

function esFechaValida(
    fecha
) {

    if (
        typeof fecha !== "string"
    ) {

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


// ============================================================
// BOTONES DE CAMBIO DE MES
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const botonAnterior =
            document.getElementById(
                "mesAnterior"
            );


        const botonSiguiente =
            document.getElementById(
                "mesSiguiente"
            );


        if (
            botonAnterior
        ) {

            botonAnterior.addEventListener(
                "click",
                () => {

                    fechaCalendario.setMonth(
                        fechaCalendario.getMonth() - 1
                    );

                    mostrarCalendario();

                }
            );

        }


        if (
            botonSiguiente
        ) {

            botonSiguiente.addEventListener(
                "click",
                () => {

                    fechaCalendario.setMonth(
                        fechaCalendario.getMonth() + 1
                    );

                    mostrarCalendario();

                }
            );

        }

    }
);


// ============================================================
// MOSTRAR ERROR
// ============================================================

function mostrarError(
    mensaje
) {

    const contenedor =
        document.getElementById(
            "calendario"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const error =
        document.createElement(
            "div"
        );


    error.textContent =
        mensaje;


    error.style.color =
        "red";

    error.style.padding =
        "20px";

    error.style.textAlign =
        "center";


    contenedor.appendChild(
        error
    );

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

    const total =
        document.getElementById(
            "totalFamilia"
        );

    const mujeres =
        document.getElementById(
            "totalMujeres"
        );

    const hombres =
        document.getElementById(
            "totalHombres"
        );

    const vivos =
        document.getElementById(
            "totalVivos"
        );

    const finados =
        document.getElementById(
            "totalFinados"
        );


    if (total) {

        total.textContent =
            estadisticasFamilia.total;

    }


    if (mujeres) {

        mujeres.textContent =
            estadisticasFamilia.mujeres;

    }


    if (hombres) {

        hombres.textContent =
            estadisticasFamilia.hombres;

    }


    if (vivos) {

        vivos.textContent =
            estadisticasFamilia.vivos;

    }


    if (finados) {

        finados.textContent =
            estadisticasFamilia.finados;

    }

}


// ============================================================
// ESTADÍSTICAS POR MES
// ============================================================

function mostrarEstadisticasPorMes() {

    const contenedor =
        document.getElementById(
            "estadisticasMes"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    estadisticasFamilia
        .porMes
        .forEach(
            (cantidad, indice) => {

                const elemento =
                    document.createElement(
                        "div"
                    );


                elemento.className =
                    "estadisticaMes";


                elemento.innerHTML =
                    `<strong>${nombresMeses[indice]}</strong>: ${cantidad}`;


                contenedor.appendChild(
                    elemento
                );

            }
        );

}


// ============================================================
// ESTADÍSTICAS GEOGRÁFICAS
// ============================================================

function mostrarEstadisticasGeograficas() {

    mostrarListaGeografica(
        "estadisticasPais",
        estadisticasFamilia.porPais
    );


    mostrarListaGeografica(
        "estadisticasEstado",
        estadisticasFamilia.porEstado
    );


    mostrarListaGeografica(
        "estadisticasCiudad",
        estadisticasFamilia.porCiudad
    );

}


// ============================================================
// MOSTRAR LISTA GEOGRÁFICA
// ============================================================

function mostrarListaGeografica(
    id,
    datos
) {

    const contenedor =
        document.getElementById(
            id
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const ordenado =
        Object.entries(
            datos
        ).sort(
            (a, b) =>
                b[1] - a[1]
        );


    ordenado.forEach(
        ([nombre, cantidad]) => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.innerHTML =
                `<strong>${nombre}</strong>: ${cantidad}`;


            contenedor.appendChild(
                elemento
            );

        }
    );

}


// ============================================================
// MOSTRAR MES MAYOR
// ============================================================

function mostrarMesMayor() {

    const contenedor =
        document.getElementById(
            "mesMayor"
        );


    if (!contenedor) {

        return;

    }


    const resultado =
        obtenerMesMayor();


    if (!resultado) {

        contenedor.textContent =
            "Sin información.";

        return;

    }


    contenedor.innerHTML =
        `🎂 <strong>${resultado.mes}</strong> es el mes con más cumpleaños, con <strong>${resultado.cantidad}</strong> familiares.`;

}


// ============================================================
// MOSTRAR FECHAS COMPARTIDAS
// ============================================================

function mostrarFechasCompartidas() {

    const contenedor =
        document.getElementById(
            "fechasCompartidas"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    const fechas =
        estadisticasFamilia
            .fechasCompartidas;


    if (
        !fechas ||
        fechas.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No hay fechas de cumpleaños compartidas.</p>";

        return;

    }


    fechas.forEach(
        fecha => {

            const elemento =
                document.createElement(
                    "div"
                );


            const personas =
                cumpleañosFamilia.filter(
                    persona =>
                        persona.fecha === fecha.fecha
                );


            elemento.innerHTML = `
                <strong>
                    ${formatearFechaEstadistica(fecha.fecha)}
                </strong>

                <div class="personasFecha">
                    ${personas
                        .map(
                            persona => {

                                const icono =
                                    persona.estatus === "Finado"
                                        ? " 🕊️"
                                        : "";

                                return `👤 ${persona.nombre}${icono}`;

                            }
                        )
                        .join("<br>")}
                </div>
            `;


            contenedor.appendChild(
                elemento
            );

        }
    );

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


    if (
        mes < 1 ||
        mes > 12
    ) {

        return fecha;

    }


    return `${dia} de ${nombresMeses[mes - 1]}`;

}
