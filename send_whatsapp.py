import json
from datetime import datetime
from twilio.rest import Client
import config

def cargar_cumpleanos():
    with open("birthdays.json", "r", encoding="utf-8") as f:
        return json.load(f)

def enviar_whatsapp(mensaje):
    client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
    client.messages.create(
        from_=config.TWILIO_WHATSAPP_NUMBER,
        body=mensaje,
        to=config.WHATSAPP_GROUP_NUMBER
    )

def revisar_cumpleanos():
    hoy = datetime.now().strftime("%d-%m")  # Día-Mes
    cumpleanos = cargar_cumpleanos()
    for persona in cumpleanos:
        if persona["fecha"] == hoy:
            if "anio" in persona:
                edad = datetime.now().year - persona["anio"]
                mensaje = (
                    f"🎉 ¡Hoy celebramos a {persona['nombre']}! 🎂\n"
                    f"Cumple {edad} años 🎈\n"
                    "Que tengas un día lleno de alegría, amor y momentos inolvidables ❤️\n"
                    "De parte de toda la Familia Cuenca 💕"
                )
            else:
                mensaje = (
                    f"🎉 ¡Hoy celebramos a {persona['nombre']}! 🎂\n"
                    "Que tengas un día lleno de alegría, amor y momentos inolvidables ❤️\n"
                    "De parte de toda la Familia Cuenca 💕"
                )
            enviar_whatsapp(mensaje)

if __name__ == "__main__":
    revisar_cumpleanos()
4️⃣
