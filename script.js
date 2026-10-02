document.addEventListener("DOMContentLoaded", () => {

    const tabla = document.getElementById("calendario");

    // Obtener la fecha actual en horario local
    const ahora = new Date();

    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");

    // Formato MM-DD
    const hoy = `${mes}-${dia}`;

    fetch("birthdays.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar birthdays.json");
            }
            return response.json();
        })
        .then(data => {

            // Ordenar cumpleaños por mes y día
            data.sort((a, b) => {
                const fechaA = convertirFecha(a.fecha);
                const fechaB = convertirFecha(b.fecha);

                return fechaA.localeCompare(fechaB);
            });

            data.forEach(c => {

                const fecha = convertirFecha(c.fecha);
                const esHoy = fecha === hoy;

                let textoFecha = c.fecha;

                // Mostrar año si existe
                if (c.anio) {
                    textoFecha += ` (${c.anio})`;
                }

                let accion = "";

                // Si hoy es su cumpleaños
                if (esHoy) {

                    const mensaje = encodeURIComponent(
                        `🎉 ¡Hoy celebramos a ${c.nombre}! 🎂\n\n` +
                        `Que tengas un día lleno de alegría, salud y muchos momentos felices. ❤️\n\n` +
                        `¡Un fuerte abrazo de toda la Familia Cuenca! 🎉🥳`
                    );

                    const enlaceWhatsApp =
                        `https://wa.me/?text=${mensaje}`;

                    accion = `
                        <a class="btn"
                           href="${enlaceWhatsApp}"
                           target="_blank"
                           rel="noopener noreferrer">
                           🎉 Felicitar por WhatsApp
                        </a>
                    `;
                }

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td class="${esHoy ? "hoy" : ""}">
                        ${esHoy ? "🎂 " : ""}${c.nombre}
                    </td>

                    <td class="${esHoy ? "hoy" : ""}">
                        ${textoFecha}
                        ${esHoy ? " 🎉" : ""}
                    </td>

                    <td class="${esHoy ? "hoy" : ""}">
                        ${accion}
                    </td>
                `;

                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error:", error);

            tabla.innerHTML += `
                <tr>
                    <td colspan="3">
                        ⚠️ No se pudieron cargar los cumpleaños.
                    </td>
                </tr>
            `;
        });
});


/*
 * Convierte una fecha DD-MM a MM-DD.
 *
 * Ejemplo:
 * 04-10 → 10-04
 */
function convertirFecha(fecha) {

    const partes = fecha.split("-");

    if (partes.length !== 2) {
        return "";
    }

    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");

    return `${mes}-${dia}`;
}
