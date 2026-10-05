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

let estadisticasFamilia = null;


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
// FUNCIÓN VISUAL PARA MOSTRAR EL NOMBRE
// CON 🕊️ CUANDO EL FAMILIAR ES FINADO
// ============================================================

function crearNombreConIconoFinado(cumpleaños) {

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
    // SI EL ESTATUS ES FINADO, AGREGAR 🕊️
    // --------------------------------------------------------

    if (
        cumpleaños.estatus === "Finado"
    ) {

        const icono =
            document.createElement("span");

        icono.textContent =
            " 🕊️";

        icono.style.marginLeft =
            "4px";

        icono.title =
            "Familiar finado";

        icono.setAttribute(
            "aria-label",
            "Familiar finado"
        );

        contenedor.appendChild(
            icono
        );

    }


    return contenedor;

}


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


            // ====================================================
            // VALIDAR REGISTROS
            // ====================================================

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


            // ====================================================
            // MOSTRAR CALENDARIO
            // ====================================================

            mostrarCalendario();


            // ====================================================
            // REVISAR CUMPLEAÑOS DE HOY
            // ====================================================

            mostrarCumpleanosDeHoy();


            // ====================================================
            // CALCULAR ESTADÍSTICAS
            // ====================================================

            estadisticasFamilia = calcularEstadisticas();

            mostrarEstadisticas();


            // ====================================================
            // CONSOLA - INEGI CUENCA
            // ====================================================

            console.log(
                "========================================"
            );

            console.log(
                "        INEGI CUENCA"
            );

            console.log(
                "  Estadísticas de la Familia Cuenca"
            );

            console.log(
                "========================================"
            );

            console.log(
                "Total:",
                estadisticasFamilia.total
            );

            console.log(
                "Mujeres:",
                estadisticasFamilia.mujeres
            );

            console.log(
                "Hombres:",
                estadisticasFamilia.hombres
            );

            console.log(
                "Vivos:",
                estadisticasFamilia.vivos
            );

            console.log(
                "Finados:",
                estadisticasFamilia.finados
            );

            console.log(
                "Por mes:",
                estadisticasFamilia.porMes
            );

            console.log(
                "Por país:",
                estadisticasFamilia.porPais
            );

            console.log(
                "Por estado:",
                estadisticasFamilia.porEstado
            );

            console.log(
                "Por ciudad:",
                estadisticasFamilia.porCiudad
            );

            console.log(
                "Fechas compartidas:",
                obtenerFechasCompartidas(
                    estadisticasFamilia
                )
            );

            console.log(
                "Mes con más cumpleaños:",
                obtenerMesMayor(
                    estadisticasFamilia
                )
            );

            console.log(
                "========================================"
            );

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
// ESTADÍSTICAS — INEGI CUENCA
// ============================================================

function calcularEstadisticas() {

    const datos =
        cumpleañosFamilia;


    const estadisticas = {

        // ====================================================
        // TOTAL
        // ====================================================

        total:
            datos.length,


        // ====================================================
        // GÉNERO
        // ====================================================

        mujeres:
            datos.filter(
                persona =>
                    persona.genero === "F"
            ).length,

        hombres:
            datos.filter(
                persona =>
                    persona.genero === "M"
            ).length,


        // ====================================================
        // ESTATUS
        // ====================================================

        vivos:
            datos.filter(
                persona =>
                    persona.estatus === "Vivo"
            ).length,

        finados:
            datos.filter(
                persona =>
                    persona.estatus === "Finado"
            ).length,


        // ====================================================
        // CUMPLEAÑOS POR MES
        // ====================================================

        porMes: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],


        // ====================================================
        // GEOGRAFÍA
        // ====================================================

        porPais: {},

        porEstado: {},

        porCiudad: {},


        // ====================================================
        // FECHAS COMPARTIDAS
        // ====================================================

        fechasCompartidas: {}

    };


    // ========================================================
    // RECORRER FAMILIA
    // ========================================================

    datos.forEach(
        persona => {


            // ==================================================
            // MES
            // ==================================================

            const partes =
                persona.fecha.split("-");


            const mes =
                parseInt(partes[1], 10);


            if (
                mes >= 1 &&
                mes <= 12
            ) {

                estadisticas.porMes[mes - 1]++;

            }


            // ==================================================
            // PAÍS
            // ==================================================

            if (
                persona.pais
            ) {

                if (
                    !estadisticas.porPais[
                        persona.pais
                    ]
                ) {

                    estadisticas.porPais[
                        persona.pais
                    ] = 0;

                }


                estadisticas.porPais[
                    persona.pais
                ]++;

            }


            // ==================================================
            // ESTADO
            // ==================================================

            if (
                persona.estado
            ) {

                if (
                    !estadisticas.porEstado[
                        persona.estado
                    ]
                ) {

                    estadisticas.porEstado[
                        persona.estado
                    ] = 0;

                }


                estadisticas.porEstado[
                    persona.estado
                ]++;

            }


            // ==================================================
            // CIUDAD
            // ==================================================

            if (
                persona.ciudad
            ) {

                if (
                    !estadisticas.porCiudad[
                        persona.ciudad
                    ]
                ) {

                    estadisticas.porCiudad[
                        persona.ciudad
                    ] = 0;

                }


                estadisticas.porCiudad[
                    persona.ciudad
                ]++;

            }


            // ==================================================
            // FECHAS COMPARTIDAS
            // ==================================================

            if (
                !estadisticas.fechasCompartidas[
                    persona.fecha
                ]
            ) {

                estadisticas.fechasCompartidas[
                    persona.fecha
                ] = [];

            }


            estadisticas.fechasCompartidas[
                persona.fecha
            ].push(
                persona.nombre
            );

        }
    );


    return estadisticas;

}


// ============================================================
// OBTENER MES CON MÁS CUMPLEAÑOS
// ============================================================

function obtenerMesMayor(
    estadisticas
) {

    let mesMayor = null;

    let cantidadMayor = 0;


    Object.entries(
        estadisticas.porMes
    ).forEach(
        ([mes, cantidad]) => {

            if (
                cantidad > cantidadMayor
            ) {

                cantidadMayor =
                    cantidad;

                mesMayor =
                    mes;

            }

        }
    );


    return {

        mes:
            mesMayor,

        nombreMes:
            mesMayor
                ? nombresMeses[
                    parseInt(mesMayor, 10) - 1
                  ]
                : "",

        cantidad:
            cantidadMayor

    };

}


// ============================================================
// OBTENER FECHAS COMPARTIDAS
// ============================================================

function obtenerFechasCompartidas(
    estadisticas
) {

    return Object.entries(
        estadisticas.fechasCompartidas
    )

        .filter(
            ([fecha, personas]) =>
                personas.length > 1
        )

        .map(
            ([fecha, personas]) => ({

                fecha:
                    fecha,

                personas:
                    personas

            })
        );

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


    if (
        !cuerpo ||
        !titulo
    ) {

        console.error(
            "No se encontraron los elementos del calendario."
        );

        return;

    }


    // ========================================================
    // LIMPIAR CALENDARIO
    // ========================================================

    cuerpo.innerHTML =
        "";


    const año =
        fechaCalendario.getFullYear();

    const mes =
        fechaCalendario.getMonth();


    // ========================================================
    // TÍTULO
    // ========================================================

    titulo.textContent =
        `${nombresMeses[mes]} ${año}`;


    // ========================================================
    // PRIMER DÍA
    // ========================================================

    const primerDia =
        new Date(
            año,
            mes,
            1
        );


    // ========================================================
    // ÚLTIMO DÍA
    // ========================================================

    const ultimoDia =
        new Date(
            año,
            mes + 1,
            0
        );


    const diasMes =
        ultimoDia.getDate();


    // ========================================================
    // DÍA DE LA SEMANA
    //
    // JavaScript:
    // Domingo = 0
    // Lunes = 1
    //
    // Nosotros:
    // Lunes = 0
    // Domingo = 6
    // ========================================================

    let primerDiaSemana =
        primerDia.getDay();


    primerDiaSemana =
        primerDiaSemana === 0
            ? 6
            : primerDiaSemana - 1;


    let fila =
        document.createElement(
            "tr"
        );


    // ========================================================
    // ESPACIOS ANTES DEL PRIMER DÍA
    // ========================================================

    for (
        let i = 0;
        i < primerDiaSemana;
        i++
    ) {

        const celda =
            document.createElement(
                "td"
            );


        celda.classList.add(
            "diaVacio"
        );


        fila.appendChild(
            celda
        );

    }


    // ========================================================
    // CREAR DÍAS
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


        // ====================================================
        // CERRAR FILA CADA DOMINGO
        // ====================================================

        if (
            (primerDiaSemana + dia) % 7 === 0
        ) {

            cuerpo.appendChild(
                fila
            );


            fila =
                document.createElement(
                    "tr"
                );

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
                document.createElement(
                    "td"
                );


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
        document.createElement(
            "td"
        );


    // ========================================================
    // NÚMERO DEL DÍA
    // ========================================================

    const numero =
        document.createElement(
            "span"
        );


    numero.className =
        "numeroDia";


    numero.textContent =
        dia;


    celda.appendChild(
        numero
    );


    // ========================================================
    // BUSCAR CUMPLEAÑOS
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
            document.createElement(
                "span"
            );


        indicador.className =
            "indicadorCumpleanos";


        // ====================================================
        // MOSTRAR PERSONAS
        // ====================================================

        cumpleañosDelDia.forEach(
            cumpleaños => {

                const nombre =
                    document.createElement(
                        "div"
                    );


                // ------------------------------------------------
                // 🎂 + NOMBRE + 🕊️ SI ES FINADO
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


                nombre.appendChild(
                    crearNombreConIconoFinado(
                        cumpleaños
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


        // ====================================================
        // DETECTAR SI ES HOY
        // ====================================================

        const hoy =
            new Date();


        const esHoy =
            hoy.getDate() === dia &&
            hoy.getMonth() + 1 === mes &&
            hoy.getFullYear() === año;


        if (
            esHoy
        ) {

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


    nombre.innerHTML =
        "";

    boton.innerHTML =
        "";


    // ========================================================
    // TÍTULO
    // ========================================================

    if (
        esHoy
    ) {

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
                document.createElement(
                    "div"
                );


            bloque.style.margin =
                "12px 0";


            bloque.style.padding =
                "10px";


            bloque.style.background =
                "#fff0f5";


            bloque.style.borderRadius =
                "8px";


            const nombrePersona =
                document.createElement(
                    "div"
                );


            // ------------------------------------------------
            // 🎂 + NOMBRE + 🕊️
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


            nombrePersona.appendChild(
                crearNombreConIconoFinado(
                    cumpleaños
                )
            );


            nombrePersona.style.fontWeight =
                "bold";


            nombrePersona.style.color =
                "#ff4081";


            nombrePersona.style.fontSize =
                "18px";


            bloque.appendChild(
                nombrePersona
            );


            // =================================================
            // AÑO
            // =================================================

            if (
                cumpleaños.anio
            ) {

                const año =
                    document.createElement(
                        "div"
                    );


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
                document.createElement(
                    "button"
                );


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


    // ========================================================
    // NO HAY CUMPLEAÑOS
    // ========================================================

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


    nombre.innerHTML =
        "";


    mensaje.innerHTML =
        "";


    boton.innerHTML =
        "";


    // ========================================================
    // MOSTRAR CADA CUMPLEAÑOS DE HOY
    // ========================================================

    cumpleañosHoy.forEach(
        cumpleaños => {

            const bloque =
                document.createElement(
                    "div"
                );


            bloque.style.marginBottom =
                "25px";


            // ==================================================
            // NOMBRE
            // ==================================================

            const nombrePersona =
                document.createElement(
                    "div"
                );


            // ------------------------------------------------
            // 🎂 + NOMBRE + 🕊️
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


            nombrePersona.appendChild(
                crearNombreConIconoFinado(
                    cumpleaños
                )
            );


            nombrePersona.style.fontSize =
                "24px";


            nombrePersona.style.fontWeight =
                "bold";


            nombrePersona.style.color =
                "#ff4081";


            nombre.appendChild(
                nombrePersona
            );


            // ==================================================
            // MENSAJE
            // ==================================================

            const texto =
                crearMensajeCumpleanos(
                    cumpleaños
                );


            // ==================================================
            // VISTA PREVIA
            // ==================================================

            const vistaPrevia =
                document.createElement(
                    "div"
                );


            vistaPrevia.textContent =
                texto;


            vistaPrevia.id =
                "mensajeWhatsAppVista";


            mensaje.appendChild(
                vistaPrevia
            );


            // ==================================================
            // BOTÓN WHATSAPP
            // ==================================================

            const botonWhatsApp =
                document.createElement(
                    "a"
                );


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
    // VERIFICAR CONFIRMACIÓN
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


    // --------------------------------------------------------
    // NOMBRE VISUAL
    // --------------------------------------------------------

    nombre.innerHTML =
        "";


    const nombreVisual =
        document.createElement(
            "span"
        );


    nombreVisual.appendChild(
        document.createTextNode(
            "🎂 "
        )
    );


    nombreVisual.appendChild(
        crearNombreConIconoFinado(
            cumpleaños
        )
    );


    nombre.appendChild(
        nombreVisual
    );


    const texto =
        crearMensajeCumpleanos(
            cumpleaños
        );


    // --------------------------------------------------------
    // MENSAJE
    // --------------------------------------------------------

    mensaje.textContent =
        texto;


    boton.innerHTML =
        "";


    // ========================================================
    // CONTENEDOR DE BOTONES
    // ========================================================

    const contenedorBotones =
        document.createElement(
            "div"
        );


    contenedorBotones.style.marginTop =
        "15px";


    // ========================================================
    // BOTÓN GRUPO
    // ========================================================

    const botonGrupo =
        document.createElement(
            "a"
        );


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
    // BOTÓN PERSONAL
    // ========================================================

    const botonPersonal =
        document.createElement(
            "a"
        );


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
    // SCROLL
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


    if (
        !contenedor
    ) {

        return;

    }


    contenedor.style.display =
        "block";


    contenedor.innerHTML =
        "";


    const texto =
        document.createElement(
            "div"
        );


    if (
        tipoEnvio === "personal"
    ) {

        texto.textContent =
            `¿Ya enviaste el mensaje personal de ${cumpleaños.nombre}?`;

    } else {

        texto.textContent =
            `¿Ya enviaste la felicitación de ${cumpleaños.nombre} al grupo Familia Cuenca?`;

    }


    texto.style.marginBottom =
        "10px";


    const boton =
        document.createElement(
            "button"
        );


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


    if (
        !contenedor
    ) {

        return;

    }


    contenedor.style.display =
        "block";


    if (
        tipoEnvio === "personal"
    ) {

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
// FORMATO: MM-DD
// ============================================================

function obtenerFechaActual() {

    const ahora =
        new Date();


    const mes =
        String(
            ahora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            ahora.getDate()
        ).padStart(
            2,
            "0"
        );


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


        if (
            botonAnterior
        ) {

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


        if (
            botonSiguiente
        ) {

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


    if (
        !calendario
    ) {

        return;

    }


    const cuerpo =
        document.getElementById(
            "cuerpoCalendario"
        );


    if (
        cuerpo
    ) {

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


// ============================================================
// MOSTRAR ESTADÍSTICAS EN LA PÁGINA
// ============================================================

function mostrarEstadisticas() {

    if (!estadisticasFamilia) {

        console.warn(
            "No existen estadísticas para mostrar."
        );

        return;

    }


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
            "statTotal"
        );

    const mujeres =
        document.getElementById(
            "statMujeres"
        );

    const hombres =
        document.getElementById(
            "statHombres"
        );

    const vivos =
        document.getElementById(
            "statVivos"
        );

    const finados =
        document.getElementById(
            "statFinados"
        );


    if (
        !total ||
        !mujeres ||
        !hombres ||
        !vivos ||
        !finados
    ) {

        console.warn(
            "No se encontraron todos los elementos de estadísticas."
        );

        return;

    }


    total.textContent =
        estadisticasFamilia.total;

    mujeres.textContent =
        estadisticasFamilia.mujeres;

    hombres.textContent =
        estadisticasFamilia.hombres;

    vivos.textContent =
        estadisticasFamilia.vivos;

    finados.textContent =
        estadisticasFamilia.finados;

}


// ============================================================
// CUMPLEAÑOS POR MES
// ============================================================

function mostrarEstadisticasPorMes() {

    const contenedor =
        document.getElementById(
            "estadisticaPorMes"
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        "";


    const maximo =
        Math.max(
            ...estadisticasFamilia.porMes
        );


    estadisticasFamilia.porMes.forEach(
        (cantidad, indice) => {

            const porcentaje =
                maximo > 0
                    ? (cantidad / maximo) * 100
                    : 0;


            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "barraMes";


            fila.innerHTML = `
                <div class="barraMesNombre">
                    <span>${nombresMeses[indice]}</span>
                    <strong>${cantidad}</strong>
                </div>

                <div class="barraMesFondo">
                    <div
                        class="barraMesValor"
                        style="width:${porcentaje}%">
                    </div>
                </div>
            `;


            contenedor.appendChild(
                fila
            );

        }
    );

}


// ============================================================
// ESTADÍSTICAS GEOGRÁFICAS
// ============================================================

function mostrarEstadisticasGeograficas() {

    mostrarListaGeografica(
        "estadisticaPorPais",
        estadisticasFamilia.porPais
    );


    mostrarListaGeografica(
        "estadisticaPorEstado",
        estadisticasFamilia.porEstado
    );


    mostrarListaGeografica(
        "estadisticaPorCiudad",
        estadisticasFamilia.porCiudad
    );

}


// ============================================================
// LISTA GEOGRÁFICA
// ============================================================

function mostrarListaGeografica(
    id,
    datos
) {

    const contenedor =
        document.getElementById(
            id
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        "";


    const entradas =
        Object.entries(datos);


    if (
        entradas.length === 0
    ) {

        contenedor.innerHTML =
            "<li>Sin información disponible</li>";

        return;

    }


    entradas
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .forEach(
            ([nombre, cantidad]) => {

                const elemento =
                    document.createElement(
                        "li"
                    );


                elemento.innerHTML = `
                    <span>${nombre}</span>
                    <span class="cantidad">${cantidad}</span>
                `;


                contenedor.appendChild(
                    elemento
                );

            }
        );

}


// ============================================================
// MES CON MÁS CUMPLEAÑOS
// ============================================================

function mostrarMesMayor() {

    const resultado =
        obtenerMesMayor(
            estadisticasFamilia
        );


    const elemento =
        document.getElementById(
            "mesMayorEstadistica"
        );


    if (
        !elemento ||
        !resultado
    ) {

        return;

    }


    elemento.textContent =
        `${resultado.nombreMes} — ${resultado.cantidad}`;

}


// ============================================================
// FECHAS COMPARTIDAS
// ============================================================

function mostrarFechasCompartidas() {

    const contenedor =
        document.getElementById(
            "estadisticaFechasCompartidas"
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        "";


    const fechas =
        obtenerFechasCompartidas(
            estadisticasFamilia
        );


    if (
        !fechas ||
        fechas.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No hay fechas compartidas.</p>";

        return;

    }


    fechas.forEach(
        fecha => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "fechaCompartida";


            const personas =
                cumpleañosFamilia.filter(
                    persona =>
                        persona.fecha === fecha.fecha
                );


            // =================================================
            // CONSTRUIR LA LISTA DE PERSONAS
            // =================================================

            const listaPersonas =
                document.createElement(
                    "div"
                );


            listaPersonas.className =
                "personasFecha";


            personas.forEach(
                persona => {

                    const personaElemento =
                        document.createElement(
                            "div"
                        );


                    // 👤
                    const iconoPersona =
                        document.createElement(
                            "span"
                        );


                    iconoPersona.textContent =
                        "👤 ";


                    personaElemento.appendChild(
                        iconoPersona
                    );


                    // NOMBRE + 🕊️ SI ES FINADO
                    personaElemento.appendChild(
                        crearNombreConIconoFinado(
                            persona
                        )
                    );


                    listaPersonas.appendChild(
                        personaElemento
                    );

                }
            );


            // =================================================
            // FECHA
            // =================================================

            const tituloFecha =
                document.createElement(
                    "strong"
                );


            tituloFecha.textContent =
                formatearFechaEstadistica(
                    fecha.fecha
                );


            elemento.appendChild(
                tituloFecha
            );


            elemento.appendChild(
                listaPersonas
            );


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


    return `${dia} de ${nombresMeses[mes]}`;

}
