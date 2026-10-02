# 🎂 Calendario de Cumpleaños - Familia Cuenca

Este proyecto muestra un calendario gráfico de cumpleaños en **GitHub Pages** y envía mensajes automáticos por WhatsApp usando **GitHub Actions** y Twilio.

## 🚀 Cómo usar
1. Edita `birthdays.json` para agregar o quitar cumpleaños.
   - Formato obligatorio: `"DD-MM"`
   - Año opcional: `"anio": 1990`
2. Configura tus credenciales de Twilio en **Settings → Secrets and variables → Actions**:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
3. Activa GitHub Pages en **Settings → Pages** para ver el calendario.
4. El mensaje se enviará automáticamente todos los días a las 08:00 UTC si hay cumpleaños.

## 📂 Estructura
- `index.html` → Página web del calendario.
- `birthdays.json` → Lista editable de cumpleaños.
- `send_whatsapp.py` → Script para enviar mensajes.
- `.github/workflows/send.yml` → Automatización con GitHub Actions.

## 🌐 URL del calendario
Cuando actives GitHub Pages, estará disponible en:
https://TU_USUARIO.github.io/cumpleanos-familia-Cuenca


