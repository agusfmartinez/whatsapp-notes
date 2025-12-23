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

### v1.0.0 - 2025-12-23
- Actializacion del .readme
- Limpieza y organización inicial: se elimina stubs vacíos y carpeta backup.
- Unificación de estado: nos quedamos con useChats.ts como fuente de verdad única.
- Reestructuración de vistas: page.tsx ahora orquesta contenedores (ChatListView, ChatScreen, NewChatScreen, EditChatScreen).
- UI reutilizable: se extrae ChatListItem, se crea OptionsMenu, evita lógica duplicada en listas/dropdowns.
- UX móvil: autoscroll al fondo, separadores Hoy/Ayer/fecha, mensajes vacíos en listas y chats.
- PWA básico: sw.js (cache network-first/navigate, cache-first GET) y registro en ServiceWorkerClient.
- Accesibilidad/i18n: diccionario es.ts, aria-label en botones/inputs, íconos decorativos, placeholders unificados.
- Hydration fixes: inputs con type por defecto, valores controlados; se identificó impacto de extensiones (Dark Reader/LanguageTool).
- Datos/formatos: utilidades en lib/time, timestamps normalizados, validación de imágenes (image/*, ≤5 MB).
- Estilos: tokens centralizados en globals.css, uso de bg-background/text-foreground en vistas, limpieza de hex ad-hoc.
- Calidad: ESLint en 0 warnings; handlers con useCallback; <img> migrados a next/image.

### v0.12.2 - 2025-12-23
- Warnings resueltos:
-- page.tsx: los handlers ahora usan useCallback, cerrando los avisos de react-hooks/exhaustive-deps.
-- Reemplazadas las etiquetas <img> por next/image (sin deshabilitar reglas) en:
--- NewChatForm.tsx
--- EditChatForm.tsx
--- AvatarCropperModal.tsx
--- ImageViewerModal.tsx
-- input.tsx mantiene type por defecto "text".

### v0.12.1 - 2025-12-23
- Se Centraliza la paleta y se limpia clases ad‑hoc:
-- globals.css: definí un set de tokens (background, foreground, primary, muted, border, etc.) en modo light/dark alineados al esquema oscuro que usabas (#0b1014, verde primario, azul de acento). Se mantienen variables sidebar/chart para compatibilidad.
-- input.tsx: type ahora default "text" para evitar type indefinido.
-- Componentes clave usan tokens en vez de hex manuales:
--- ChatListView: fondos/bordes/colores desde bg-background, text-foreground, text-muted-foreground, border-border.
--- ChatList usa bg-background text-foreground.
--- ChatView usa strings.emptyMessages.
--- SearchBar ahora con type="search", valor controlado (value ?? ""), readOnly cuando no hay onChange, placeholder de strings, aria-label estable.
--- ChatHeader, Composer, FloatingActionButton ya tomaban strings/aria de la iteración anterior; los mantuve.
-- time.ts se mantiene; validación de imágenes (≤5 MB y tipo image/*) en page.tsx se conserva.

### v0.12.0 - 2025-12-23
- Nueva utilidad en time.ts:
-- formatTime (hh:mm).
-- formatDayLabel (Hoy/Ayer/fecha corta).
- ChatView usa formatDayLabel para las etiquetas de fecha.
- Validación básica de imágenes en page.tsx: solo acepta archivos image/* de hasta 5 MB al subir avatar (nuevo/editar).
- Restaura type="text" por defecto en input.tsx para evitar type indefinido.

### v0.11.1 - 2025-12-19
- Actualizacion de Nextjs y React a versiones:
-- Next@15.5.9 & React@19.1.2

### v0.11.0 - 2025-12-19
- Accesibilidad e i18n aplicado:
-- Nuevo diccionario es.ts con textos centralizados (títulos, placeholders, menús, mensajes vacíos, etc.).
-- Componentes actualizados para usar los textos del diccionario y mejorar a11y:
--- ChatList, ChatListItem: mensajes vacíos e alt descriptivo para avatares.
--- ChatListView: títulos/menú principal desde strings, aria-label en cámara.
--- SearchBar: placeholder centralizado, aria-label en input y aria-hidden en el ícono.
--- FilterTabs: labels desde strings.
--- ChatHeader: textos del menú desde strings.
--- Composer: placeholders, aria-label en input y botones de adjuntar/cámara/enviar/guardar.
--- FloatingActionButton: aria-label para el botón “+”.
-- Mensajes vacíos siguen presentes en lista y chat.

### v0.10.0 - 2025-12-04
- Implementación de capa PWA básica:
-- Registro de SW: nuevo componente ServiceWorkerClient.tsx se monta en page.tsx para registrar sw.js.
-- Service worker: sw.js con caché simple (whatsapp-notes-v1), precarga de rutas básicas, network-first para navegaciones y cache-first para GETs, con invalidación de versiones.
-- Sin tocar el manifest (ya existía); funciona en modo standalone cuando se instala.

### v0.9.0 - 2025-12-03
- Mejoras de UX móvil aplicadas:
-- Scroll automático: ChatView ahora desplaza al final al abrir un chat o al agregar/editar mensajes.
-- Separadores de fecha: se insertan etiquetas “Hoy”, “Ayer” o fecha corta en la lista de mensajes.
-- Estados vacíos: ChatList muestra un mensaje cuando no hay chats; ChatView muestra un placeholder cuando no hay mensajes.
-- Ajuste de scroll: se centralizó scrollToBottom y se reutiliza para envío/edición, manteniendo el offset del teclado.

### v0.8.2 - 2025-12-03
- Reutilización de dropdowns: se crea OptionsMenu.tsx con items tipados. Lo usan:
-- ChatHeader.tsx (menú de acciones del chat).
-- ChatListView.tsx (menú principal).
- Reutilización de items de lista ya estaba cubierta con ChatListItem; ChatList quedó sólo ordenando y delegando el render.
- Código limpio/tipado: no hay any ni imports de DropdownMenu sueltos.
- Se Actualiza el useMemo de page.tsx para incluir todas las dependencias de los handlers (back, delete, edit, toggle, long-press, etc.). Con esto se evita el warning de react-hooks/exhaustive-deps.

### v0.8.1 - 2025-12-03
- Refactor de componentes UI: se extrae el item de lista a un componente tipado y se elimina duplicación en la lista de chats.
-- ChatListItem.tsx: nuevo componente reutilizable para cada chat (avatar, estado de último mensaje, pins/flags), con props tipadas.
-- ChatList.tsx: ahora sólo ordena chats y delega el render al ChatListItem, sin lógica duplicada ni JSX repetido.

### v0.8.0 - 2025-12-03
- Reestructuracion de las vistas para que page.tsx quede como orquestador y la UI se separe en contenedores claros.
- Nuevos contenedores en components/views/:
-- ChatListView.tsx para la lista de chats + header, filtros, FAB y visor de imágenes.
-- ChatScreen.tsx para la vista de chat (usa ChatView) con modal de imagen y confirmación de borrado.
-- NewChatScreen.tsx y EditChatScreen.tsx para los formularios + cropper.
- page.tsx ahora sólo gestiona el estado (reducer UI + hooks) y delega la presentación a esos contenedores.
- El store sigue siendo el hook useChats.ts

### v0.7.1 - 2025-12-03
- Se unificó la fuente de verdad quedándonos sólo con useChats.ts
- Se elimina el store duplicado ChatsProvider.tsx (no tenía usos).

### v0.7.0 - 2025-12-03
- Limpiar/organizar el repo: se elimina folder backup/, y stubs vacíos (ChatListItem.tsx, ChatDropdown.tsx, ChatListDropdown.tsx, StickyBottomBar.tsx, storage.ts, time.ts)

### v0.6.1 - 2025-10-15
- Fix en Pagina para editar chat (imagen de perfil y nombre)
- Fix en modal para confirmacion de eliminar chat

### v0.6.0 - 2025-09-09
- Refactorizacion en componentes
- Pagina para editar chat (imagen de perfil y nombre)
- Al eliminar un chat, modal para confirmar y al aceptar que vuelva a la lista de chats

### v0.5.0 - 2025-09-04
- Pagina para crear nuevo chat (imagen de perfil), permite seleccionar una imagen del dispositivo
- Modal para recortar la imagen 
- Compresor a webp, guardar imagen en localstorage:
-- Usuario elige imagen original en el <input type="file">.
-- Abre el modal de recorte (cropper).
-- Al confirmar el recorte, se toma el recorte (x, y, size)
-- Se dibuja en un <canvas> cuadrado (ej: 256×256).
-- Se exporta como WebP (canvas.toDataURL("image/webp", calidad)) y, si el browser no soporta WebP, exporta a JPEG.
-- El resultado es un Data URL (string data:image/...;base64,...).
-- Guarda ese Data URL en el estado avatarPreview y al crear el chat se guarda en el objeto del chat.
-- useEffect que persiste chats ya lo manda a localStorage.

### v0.4.0 - 2025-09-03
- Pagina para crear nuevo chat (nombre)

### v0.3.0 - 2025-09-02
- Switch entre enviar y recibir mensajes
- Mantener presionado el mensaje para activar modo seleccion
- En modo seleccion se habilita editar mensaje
- En modo seleccion se habilita eliminar mensaje
- 
### v0.2.1 - 2025-09-02
- Ajuste visual para seccion chat, ajuste en desplazamiento de teclado vista mobile

### v0.2.0 - 2025-08-27
- Ajustes de colores y botones.
- Se agregó dropdown en los headers.
- Mejoras en el diseño del input de mensajes.
- Nueva función para eliminar chats desde el menú.

### v0.1.0 - 2025-08-26

- Versión inicial de la aplicación.
- Lista de chats con estilo WhatsApp.
- Vista de mensajes dentro de cada chat.
- Guardado de mensajes y chats en `localStorage`.
- Soporte básico para PWA (manifest.json e instalación en móviles).

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
