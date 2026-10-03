document.addEventListener("DOMContentLoaded", iniciarCalendario);


// ============================================================
// CONFIGURACIÓN
// ============================================================

const GRUPO_WHATSAPP =
    "https://chat.whatsapp.com/IvI6oayIIoEJ8Wn7EWQxO0?s=cl&p=i&mlu=0";


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let cumpleañosFamilia = [];

let fechaCalendario = new Date();


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
        document.getElementById("calendario");

    if (!calendario) {

        console.error(
            "No se encontró el calendario."
        );

        return;
    }


    cargarCumpleaños();

}


// ============================================================
// CARGAR BIRTHDAYS.JSON
// ============================================================

function cargarCumpleaños() {

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


            cumpleañosFamilia =
                data.filter(cumpleaños => {

                    if (
                        !cumpleaños.nombre ||
                        !cumpleaños.fecha
                    ) {

                        console.warn(
                            "Registro incompleto:",
                            cumpleaños
                        );

                        return false;
                    }


                    if (
                        !esFechaValida(
                            cumpleaños.fecha
                        )
                    ) {

                        console.warn(
                            `Fecha inválida para ${cumpleaños.nombre}: ${cumpleaños.fecha}`
                        );

                        return false;
                    }


                    return true;

                });


            // Mostrar calendario

            mostrarCalendario();


            // Revisar cumpleaños de hoy

            mostrarCumpleanosDeHoy();


        })

        .catch(error => {

            console.error(
                "Error al cargar los cumpleaños:",
                error
            );

            mostrarError(error);

        });

}


// ============================================================
// MOSTRAR CALENDARIO DEL MES
// ============================================================

function mostrarCalendario() {

    const cuerpo =
        document.getElementById(
            "cuerpoCalendario"
        );

    const titulo =
        document.getElementById(
            "mesActual"
        );


    if (!cuerpo || !titulo) {

        console.error(
            "No se encontraron los elementos del calendario."
        );

        return;
    }


    // Limpiar calendario anterior

    cuerpo.innerHTML = "";


    const año =
        fechaCalendario.getFullYear();

    const mes =
        fechaCalendario.getMonth();


    // Mostrar título

    titulo.textContent =
        `${nombresMeses[mes]} ${año}`;


    // Primer día del mes

    const primerDia =
        new Date(
            año,
            mes,
            1
        );


    // Último día del mes

    const ultimoDia =
        new Date(
            año,
            mes + 1,
            0
        );


    const diasMes =
        ultimoDia.getDate();


    // JavaScript:
    // Domingo = 0
    // Lunes = 1
    //
    // Nosotros queremos:
    // Lunes = 0
    // Domingo = 6

    let primerDiaSemana =
        primerDia.getDay();

    primerDiaSemana =
        primerDiaSemana === 0
            ? 6
            : primerDiaSemana - 1;


    let fila =
        document.createElement("tr");


    // ========================================================
    // ESPACIOS ANTES DEL PRIMER DÍA
    // ========================================================

    for (
        let i = 0;
        i < primerDiaSemana;
        i++
    ) {

        const celda =
            document.createElement("td");

        celda.classList.add(
            "diaVacio"
        );

        fila.appendChild(
            celda
        );

    }


    // ========================================================
    // CREAR DÍAS DEL MES
    // ========================================================

    for (
        let dia = 1;
        dia <= diasMes;
        dia++
    ) {

        const celda =
            crearCeldaDia(
                dia,
                mes + 1,
                año
            );


        fila.appendChild(
            celda
        );


        // Cada domingo cerramos la fila

        if (
            (primerDiaSemana + dia) % 7 === 0
        ) {

            cuerpo.appendChild(
                fila
            );

            fila =
                document.createElement("tr");

        }

    }


    // ========================================================
    // COMPLETAR ÚLTIMA FILA
    // ========================================================

    if (
        fila.children.length > 0
    ) {

        while (
            fila.children.length < 7
        ) {

            const celda =
                document.createElement("td");

            celda.classList.add(
                "diaVacio"
            );

            fila.appendChild(
                celda
            );

        }


        cuerpo.appendChild(
            fila
        );

    }

}


// ============================================================
// CREAR CELDA DE UN DÍA
// ============================================================

function crearCeldaDia(
    dia,
    mes,
    año
) {

    const celda =
        document.createElement("td");


    // ========================================================
    // NÚMERO DEL DÍA
    // ========================================================

    const numero =
        document.createElement("span");

    numero.className =
        "numeroDia";

    numero.textContent =
        dia;

    celda.appendChild(
        numero
    );


    // ========================================================
    // BUSCAR CUMPLEAÑOS DEL DÍA
    // ========================================================

    const cumpleañosDelDia =
        cumpleañosFamilia.filter(
            cumpleaños => {

                const partes =
                    cumpleaños.fecha.split("-");

                const diaCumpleaños =
                    parseInt(
                        partes[0],
                        10
                    );

                const mesCumpleaños =
                    parseInt(
                        partes[1],
                        10
                    );


                return (
                    diaCumpleaños === dia &&
                    mesCumpleaños === mes
                );

            }
        );


    // ========================================================
    // SI HAY CUMPLEAÑOS
    // ========================================================

    if (
        cumpleañosDelDia.length > 0
    ) {

        celda.classList.add(
            "tieneCumpleanos"
        );


        const indicador =
            document.createElement("span");

        indicador.className =
            "indicadorCumpleanos";


        // Mostrar cada persona

        cumpleañosDelDia.forEach(
            cumpleaños => {

                const nombre =
                    document.createElement("div");

                nombre.textContent =
                    `🎂 ${cumpleaños.nombre}`;

                indicador.appendChild(
                    nombre
                );

            }
        );


        celda.appendChild(
            indicador
        );


        // ====================================================
        // DETECTAR SI ES HOY
        // ====================================================

        const hoy =
            new Date();

        const esHoy =
            hoy.getDate() === dia &&
            hoy.getMonth() + 1 === mes &&
            hoy.getFullYear() === año;


        if (esHoy) {

            celda.classList.add(
                "hoy"
            );

        }


        // ====================================================
        // CLICK EN EL DÍA
        // ====================================================

        celda.addEventListener(
            "click",
            function () {

                mostrarDetalleCumpleanos(
                    cumpleañosDelDia,
                    esHoy
                );

            }
        );

    }


    return celda;

}

function calcularEstadisticas() {

    const datos = cumpleañosFamilia;

    const estadisticas = {
        total: datos.length,

        mujeres: datos.filter(p => p.genero === "F").length,
        hombres: datos.filter(p => p.genero === "M").length,

        vivos: datos.filter(p => p.estatus === "Vivo").length,
        finados: datos.filter(p => p.estatus === "Finado").length,

        porMes: {},
        porPais: {},
        porEstado: {},
        porCiudad: {},

        fechasCompartidas: {}
    };

    // ============================================
    // CUMPLEAÑOS POR MES
    // ============================================

    datos.forEach(persona => {

        const [dia, mes] = persona.fecha.split("-");

        if (!estadisticas.porMes[mes]) {
            estadisticas.porMes[mes] = 0;
        }

        estadisticas.porMes[mes]++;

    });


    // ============================================
    // PAÍS
    // ============================================

    datos.forEach(persona => {

        if (!persona.pais) return;

        if (!estadisticas.porPais[persona.pais]) {
            estadisticas.porPais[persona.pais] = 0;
        }

        estadisticas.porPais[persona.pais]++;

    });


    // ============================================
    // ESTADO
    // ============================================

    datos.forEach(persona => {

        if (!persona.estado) return;

        if (!estadisticas.porEstado[persona.estado]) {
            estadisticas.porEstado[persona.estado] = 0;
        }

        estadisticas.porEstado[persona.estado]++;

    });


    // ============================================
    // CIUDAD
    // ============================================

    datos.forEach(persona => {

        if (!persona.ciudad) return;

        if (!estadisticas.porCiudad[persona.ciudad]) {
            estadisticas.porCiudad[persona.ciudad] = 0;
        }

        estadisticas.porCiudad[persona.ciudad]++;

    });


    // ============================================
    // FECHAS COMPARTIDAS
    // ============================================

    datos.forEach(persona => {

        if (!estadisticas.fechasCompartidas[persona.fecha]) {
            estadisticas.fechasCompartidas[persona.fecha] = [];
        }

        estadisticas.fechasCompartidas[persona.fecha].push(persona.nombre);

    });


    return estadisticas;
}

function obtenerMesMayor(estadisticas) {

    let mesMayor = null;
    let cantidadMayor = 0;

    Object.entries(estadisticas.porMes).forEach(([mes, cantidad]) => {

        if (cantidad > cantidadMayor) {
            cantidadMayor = cantidad;
            mesMayor = mes;
        }

    });

    return {
        mes: mesMayor,
        cantidad: cantidadMayor
    };
}

function obtenerFechasCompartidas(estadisticas) {

    return Object.entries(estadisticas.fechasCompartidas)
        .filter(([fecha, personas]) => personas.length > 1)
        .map(([fecha, personas]) => ({
            fecha,
            personas
        }));

}

// ============================================================
// MOSTRAR DETALLE DE CUMPLEAÑOS
// ============================================================

function mostrarDetalleCumpleanos(
    cumpleañosDelDia,
    esHoy = false
) {

    const contenedor =
        document.getElementById(
            "detalleCumpleanos"
        );

    const nombre =
        document.getElementById(
            "detalleNombre"
        );

    const fecha =
        document.getElementById(
            "detalleFecha"
        );

    const boton =
        document.getElementById(
            "detalleBoton"
        );


    if (
        !contenedor ||
        !nombre ||
        !fecha ||
        !boton
    ) {

        return;

    }


    contenedor.style.display =
        "block";


    // Limpiar

    nombre.innerHTML = "";

    boton.innerHTML = "";


    // ========================================================
    // TÍTULO
    // ========================================================

    if (esHoy) {

        nombre.innerHTML =
            "<strong>🎂 ¡Cumpleaños de hoy!</strong>";

    } else {

        nombre.innerHTML =
            "<strong>🎉 Cumpleaños de este día</strong>";

    }


    // ========================================================
    // FECHA
    // ========================================================

    fecha.textContent =
        "Personas que cumplen años:";

    fecha.style.margin =
        "10px 0";


    // ========================================================
    // MOSTRAR PERSONAS
    // ========================================================

    cumpleañosDelDia.forEach(
        cumpleaños => {

            const bloque =
                document.createElement("div");

            bloque.style.margin =
                "12px 0";

            bloque.style.padding =
                "10px";

            bloque.style.background =
                "#fff0f5";

            bloque.style.borderRadius =
                "8px";


            const nombrePersona =
                document.createElement("div");

            nombrePersona.textContent =
                `🎂 ${cumpleaños.nombre}`;

            nombrePersona.style.fontWeight =
                "bold";

            nombrePersona.style.color =
                "#ff4081";

            nombrePersona.style.fontSize =
                "18px";


            bloque.appendChild(
                nombrePersona
            );


            if (
                cumpleaños.anio
            ) {

                const año =
                    document.createElement("div");

                año.textContent =
                    `Año de nacimiento: ${cumpleaños.anio}`;

                año.style.fontSize =
                    "13px";

                año.style.color =
                    "#666";

                bloque.appendChild(
                    año
                );

            }


            // =================================================
            // BOTÓN DE FELICITACIÓN
            // =================================================

            const botonWhatsApp =
                document.createElement("button");

            botonWhatsApp.className =
                "btn felicitar";

            botonWhatsApp.textContent =
                "💬 Preparar felicitación";


            botonWhatsApp.addEventListener(
                "click",
                function () {

                    mostrarMensajeWhatsApp(
                        cumpleaños
                    );

                }
            );


            bloque.appendChild(
                botonWhatsApp
            );


            boton.appendChild(
                bloque
            );

        }
    );


    // ========================================================
    // LLEVAR USUARIO AL DETALLE
    // ========================================================

    contenedor.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ============================================================
// MOSTRAR CUMPLEAÑOS DE HOY
// ============================================================

function mostrarCumpleanosDeHoy() {

    const hoy =
        new Date();


    const dia =
        hoy.getDate();

    const mes =
        hoy.getMonth() + 1;


    const cumpleañosHoy =
        cumpleañosFamilia.filter(
            cumpleaños => {

                const partes =
                    cumpleaños.fecha.split("-");

                const diaCumpleaños =
                    parseInt(
                        partes[0],
                        10
                    );

                const mesCumpleaños =
                    parseInt(
                        partes[1],
                        10
                    );


                return (
                    diaCumpleaños === dia &&
                    mesCumpleaños === mes
                );

            }
        );


    const contenedor =
        document.getElementById(
            "cumpleanosHoy"
        );


    if (
        !contenedor
    ) {

        return;

    }


    // No hay cumpleaños hoy

    if (
        cumpleañosHoy.length === 0
    ) {

        contenedor.style.display =
            "none";

        return;

    }


    contenedor.style.display =
        "block";


    const nombre =
        document.getElementById(
            "nombreCumpleanosHoy"
        );

    const mensaje =
        document.getElementById(
            "mensajeWhatsApp"
        );

    const boton =
        document.getElementById(
            "botonWhatsAppHoy"
        );


    nombre.innerHTML = "";

    mensaje.innerHTML = "";

    boton.innerHTML = "";


    // ========================================================
    // MOSTRAR CADA CUMPLEAÑOS DE HOY
    // ========================================================

    cumpleañosHoy.forEach(
        cumpleaños => {

            const bloque =
                document.createElement("div");

            bloque.style.marginBottom =
                "25px";


            // Nombre

            const nombrePersona =
                document.createElement("div");

            nombrePersona.textContent =
                `🎂 ${cumpleaños.nombre}`;

            nombrePersona.style.fontSize =
                "24px";

            nombrePersona.style.fontWeight =
                "bold";

            nombrePersona.style.color =
                "#ff4081";


            nombre.appendChild(
                nombrePersona
            );


            // Crear mensaje

            const texto =
                crearMensajeCumpleanos(
                    cumpleaños
                );


            // Vista previa

            const vistaPrevia =
                document.createElement("div");

            vistaPrevia.textContent =
                texto;

            vistaPrevia.id =
                "mensajeWhatsAppVista";

            mensaje.appendChild(
                vistaPrevia
            );


            // =================================================
            // BOTÓN WHATSAPP
            // =================================================

            const botonWhatsApp =
                document.createElement("a");

            botonWhatsApp.href =
                `https://wa.me/?text=${encodeURIComponent(texto)}`;

            botonWhatsApp.target =
                "_blank";

            botonWhatsApp.rel =
                "noopener";

            botonWhatsApp.className =
                "btn whatsapp";

            botonWhatsApp.textContent =
                "💬 Abrir WhatsApp";


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


            boton.appendChild(
                botonWhatsApp
            );


            bloque.appendChild(
                nombrePersona
            );

            bloque.appendChild(
                vistaPrevia
            );

            bloque.appendChild(
                botonWhatsApp
            );

        }
    );


    // ========================================================
    // VERIFICAR SI YA SE CONFIRMÓ
    // ========================================================

    actualizarConfirmacionHoy();

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
            "cumpleanosHoy"
        );

    const nombre =
        document.getElementById(
            "nombreCumpleanosHoy"
        );

    const mensaje =
        document.getElementById(
            "mensajeWhatsApp"
        );

    const boton =
        document.getElementById(
            "botonWhatsAppHoy"
        );


    if (
        !contenedor ||
        !nombre ||
        !mensaje ||
        !boton
    ) {

        return;

    }


    contenedor.style.display =
        "block";


    nombre.innerHTML =
        `🎂 ${cumpleaños.nombre}`;


    const texto =
        crearMensajeCumpleanos(
            cumpleaños
        );


    // ========================================================
    // MOSTRAR VISTA PREVIA DEL MENSAJE
    // ========================================================

    mensaje.textContent =
        texto;


    // Limpiar botones anteriores

    boton.innerHTML =
        "";


    // ========================================================
    // CONTENEDOR DE BOTONES
    // ========================================================

    const contenedorBotones =
        document.createElement("div");

    contenedorBotones.style.marginTop =
        "15px";


    // ========================================================
    // BOTÓN 1 - GRUPO FAMILIA CUENCA
    // ========================================================

    const botonGrupo =
        document.createElement("a");


    botonGrupo.href =
        `https://wa.me/?text=${encodeURIComponent(texto)}`;


    botonGrupo.target =
        "_blank";


    botonGrupo.rel =
        "noopener";


    botonGrupo.className =
        "btn whatsapp";


    botonGrupo.textContent =
        "💬 Enviar al grupo Familia Cuenca";


    botonGrupo.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    mostrarBotonConfirmacion(
                        cumpleaños,
                        "grupo"
                    );

                },
                500
            );

        }
    );


    // ========================================================
    // BOTÓN 2 - MENSAJE PERSONAL
    // ========================================================

    const botonPersonal =
        document.createElement("a");


    botonPersonal.href =
        `https://wa.me/?text=${encodeURIComponent(texto)}`;


    botonPersonal.target =
        "_blank";


    botonPersonal.rel =
        "noopener";


    botonPersonal.className =
        "btn felicitar";


    botonPersonal.textContent =
        "👤 Enviar mensaje personal";


    botonPersonal.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    mostrarBotonConfirmacion(
                        cumpleaños,
                        "personal"
                    );

                },
                500
            );

        }
    );


    // ========================================================
    // AGREGAR BOTONES
    // ========================================================

    contenedorBotones.appendChild(
        botonGrupo
    );

    contenedorBotones.appendChild(
        botonPersonal
    );


    boton.appendChild(
        contenedorBotones
    );


    // ========================================================
    // LLEVAR USUARIO AL MENSAJE
    // ========================================================

    contenedor.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}
// ============================================================
// MOSTRAR BOTÓN DE CONFIRMACIÓN
// ============================================================

function mostrarBotonConfirmacion(
    cumpleaños,
    tipoEnvio = "grupo"
) {

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
        "";


    const texto =
        document.createElement("div");


    if (tipoEnvio === "personal") {

        texto.textContent =
            `¿Ya enviaste el mensaje personal de ${cumpleaños.nombre}?`;

    } else {

        texto.textContent =
            `¿Ya enviaste la felicitación de ${cumpleaños.nombre} al grupo Familia Cuenca?`;

    }


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
                cumpleaños,
                tipoEnvio
            );

        }
    );


    contenedor.appendChild(
        texto
    );


    contenedor.appendChild(
        boton
    );


    contenedor.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}
// ============================================================
// CONFIRMAR ENVÍO
// ============================================================

function confirmarEnvio(
    cumpleaños,
    tipoEnvio = "grupo"
) {

    const clave =
        obtenerClaveConfirmacion(
            cumpleaños,
            tipoEnvio
        );


    localStorage.setItem(
        clave,
        "true"
    );


    mostrarConfirmacionFinal(
        cumpleaños,
        tipoEnvio
    );

}
// ============================================================
// MOSTRAR CONFIRMACIÓN FINAL
// ============================================================

function mostrarConfirmacionFinal(
    cumpleaños,
    tipoEnvio = "grupo"
) {

    const contenedor =
        document.getElementById(
            "mensajeConfirmacion"
        );


    if (!contenedor) {

        return;

    }


    contenedor.style.display =
        "block";


    if (tipoEnvio === "personal") {

        contenedor.innerHTML =
            `✅ ¡Perfecto! El mensaje personal de ${cumpleaños.nombre} fue confirmado como enviado.`;

    } else {

        contenedor.innerHTML =
            `✅ ¡Perfecto! La felicitación de ${cumpleaños.nombre} fue confirmada como enviada al grupo Familia Cuenca.`;

    }

}

// ============================================================
// REVISAR CONFIRMACIÓN DE HOY
// ============================================================

function actualizarConfirmacionHoy() {

    const hoy =
        new Date();


    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const fecha =
        `${mes}-${dia}`;


    const cumpleañosHoy =
        cumpleañosFamilia.filter(
            cumpleaños => {

                return (
                    convertirFecha(
                        cumpleaños.fecha
                    ) === fecha
                );

            }
        );


    cumpleañosHoy.forEach(
        cumpleaños => {

            const clave =
                obtenerClaveConfirmacion(
                    cumpleaños
                );


            if (
                localStorage.getItem(
                    clave
                ) === "true"
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

function obtenerClaveConfirmacion(
    cumpleaños,
    tipoEnvio = "grupo"
) {

    const fecha =
        obtenerFechaActual();


    return (
        "cumpleanos_enviado_" +
        tipoEnvio +
        "_" +
        fecha +
        "_" +
        cumpleaños.nombre
    );

}

// ============================================================
// OBTENER FECHA ACTUAL
// Formato: MM-DD
// ============================================================

function obtenerFechaActual() {

    const ahora =
        new Date();


    const mes =
        String(
            ahora.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
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

function convertirFecha(
    fecha
) {

    if (
        typeof fecha !== "string"
    ) {

        return "";

    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 2
    ) {

        return "";

    }


    const dia =
        partes[0].padStart(
            2,
            "0"
        );


    const mes =
        partes[1].padStart(
            2,
            "0"
        );


    return `${mes}-${dia}`;

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
// BOTONES PARA CAMBIAR DE MES
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const botonAnterior =
            document.getElementById(
                "mesAnterior"
            );


        const botonSiguiente =
            document.getElementById(
                "mesSiguiente"
            );


        if (botonAnterior) {

            botonAnterior.addEventListener(
                "click",
                function () {

                    fechaCalendario.setMonth(
                        fechaCalendario.getMonth() - 1
                    );


                    mostrarCalendario();

                }
            );

        }


        if (botonSiguiente) {

            botonSiguiente.addEventListener(
                "click",
                function () {

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
    error
) {

    const calendario =
        document.getElementById(
            "calendario"
        );


    if (!calendario) {

        return;

    }


    const cuerpo =
        document.getElementById(
            "cuerpoCalendario"
        );


    if (cuerpo) {

        cuerpo.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        color:#c62828;
                        background:#ffebee;
                        padding:20px;
                    "
                >
                    <strong>
                        ⚠️ No se pudieron cargar los cumpleaños.
                    </strong>

                    <br><br>

                    Revisa que el archivo
                    <strong>birthdays.json</strong>
                    esté en la misma carpeta que
                    <strong>index.html</strong>
                    y
                    <strong>script.js</strong>.

                    <br><br>

                    <small>
                        ${error.message}
                    </small>
                </td>
            </tr>
        `;

    }

}

console.log("===== INEGI CUENCA =====");

const estadisticas = calcularEstadisticas();

console.log("Total:", estadisticas.total);
console.log("Mujeres:", estadisticas.mujeres);
console.log("Hombres:", estadisticas.hombres);
console.log("Vivos:", estadisticas.vivos);
console.log("Finados:", estadisticas.finados);

console.log("Por mes:", estadisticas.porMes);
console.log("Por país:", estadisticas.porPais);
console.log("Por estado:", estadisticas.porEstado);
console.log("Por ciudad:", estadisticas.porCiudad);

console.log(
    "Fechas compartidas:",
    obtenerFechasCompartidas(estadisticas)
)
