# 📒 WhatsApp Notes

Bloc de notas con interfaz estilo WhatsApp.  
Cada chat funciona como un anotador diferente, simulando una conversación pero en realidad es un lugar para tomar notas.

Ideal para quienes quieren escribir en el celular con una experiencia familiar, rápida y sin necesidad de registrarse.

👉 **Probar la app aquí**: [whatsapp-notes.vercel.app](https://whatsapp-notes.vercel.app)

---

## 📌 About

- La app está desarrollada con **Next.js 15 + TypeScript + TailwindCSS + shadcn/ui**.
- Funciona como **PWA (Progressive Web App)**, lo que permite instalarla en el celular desde el navegador.
- No requiere usuarios ni registros: todo se guarda en el **almacenamiento local (localStorage)** del dispositivo.
- Inspirada en el diseño de WhatsApp para una experiencia intuitiva.

---

## ✨ Features

- 📂 Lista de chats como “anotadores” independientes.  
- 💬 Envío de mensajes dentro de cada chat.  
- 📌 Tildes de leído/no leído, hora del último mensaje.  
- 🗂️ Filtros: Todos, No leídos, Favoritos, Grupos.  
- ⬇️ Menú dropdown en headers con opciones de gestión.  
- ➕ Botón flotante para crear nuevos chats.  
- 🎨 Estilo similar a WhatsApp con tema oscuro.  
- 📱 Compatible con **pantallas móviles** (PWA instalable).  

---

## 📱 PWA
Podés instalar la app en tu celular:
1. Abrí la aplicación en Google Chrome (Android) o Safari (iOS).
2. Menú → “Agregar a pantalla de inicio”.
3. La app se abre sin barra del navegador, como una aplicación nativa.

---
## 📝 Changelog

[Ver Changelog](CHANGELOG.md)

---

## ⚙️ Instalación y ejecución

Cloná el repositorio e instalá dependencias:

```bash
git clone https://github.com/tuusuario/whatsapp-notes.git
cd whatsapp-notes
npm install
```

Ejecutar en modo desarrollo:
```bash
npm run dev
```

Abrir en el navegador:
```bash
http://localhost:3000
```

---

## 🚀 Deploy

El proyecto está configurado para desplegarse fácilmente en Vercel.
Solo tenés que conectar el repositorio y cada push a main genera una nueva versión online.
