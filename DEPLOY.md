# Puesta en marcha: planilla + publicación de la web

## Archivos del sitio

```
dolce-vita-web/
├── index.html         estructura de la página
├── styles.css         diseño
├── app.js             lógica (carrito, WhatsApp, lectura de la planilla)
├── logo.jpg           logo (también se usa como imagen al compartir el link)
├── productos.csv      productos iniciales, para importar a Google Sheets
├── INSTRUCCIONES.md   guía para la dueña
└── DEPLOY.md          este archivo
```

Si `sheetCsvUrl` está vacío o la planilla falla, la web usa los productos del array
`DATOS` en `app.js` como respaldo, así que nunca queda en blanco.

---

## 1. Crear la planilla en Google Sheets

1. Entrá a [sheets.google.com](https://sheets.google.com) con la cuenta de Google de la pastelería
   y creá una **hoja en blanco**. Ponele de nombre, por ejemplo, *Catálogo Dolce Vita*.
2. **Archivo → Importar → Subir** y elegí `productos.csv`.
3. En el cuadro que aparece:
   - **Ubicación de importación:** *Reemplazar hoja actual*.
   - **Tipo de separador:** *Coma*.
   - **Convertir texto en números, fechas y fórmulas:** dejalo tildado.
4. **Importar datos**. Tiene que quedar la fila de títulos
   (`categoria | medida_categoria | nombre | detalle | precio | opciones | foto | disponible`)
   y un producto por fila.
5. Recomendado: **Ver → Inmovilizar → 1 fila**, para que los títulos queden siempre visibles.

> Si la planilla tiene varias pestañas, la web lee **solo la que publiques** en el paso 2.

## 2. Publicar la planilla como CSV

1. **Archivo → Compartir → Publicar en la web**.
2. En **Vínculo**:
   - En el primer desplegable elegí **la pestaña de los productos** (no "Todo el documento").
   - En el segundo, elegí **Valores separados por comas (.csv)**.
3. Tocá **Publicar** → **Aceptar**.
4. Copiá el link que aparece. Tiene esta forma:

   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
   ```

5. Dejá tildado *"Volver a publicar automáticamente cuando se realicen cambios"*
   (en **Contenido publicado y configuración**). Sin eso, los cambios no llegan a la web.

> Publicar en la web solo expone el contenido de esa pestaña (productos y precios),
> no da permiso para editar la planilla.

## 3. Pegar el link en la web

Abrí `app.js` y pegá el link entre las comillas de `sheetCsvUrl`, al principio del archivo:

```js
const CONFIG = {
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv",
  ...
```

Guardá el archivo. Esto se hace **una sola vez**; después la dueña solo edita la planilla.

Para probar: abrí `index.html` en el navegador, cambiá un precio en la planilla,
esperá ~5 minutos y recargá. (La web ya agrega `&t=...` al link para no quedarse
con una versión vieja en caché; la demora que queda es la de Google al republicar.)

---

## 4. Subir la web a Netlify (gratis)

### Opción A: arrastrando la carpeta (la más simple)

1. Entrá a [app.netlify.com](https://app.netlify.com) y creá una cuenta (se puede con Google o email).
2. Andá a [app.netlify.com/drop](https://app.netlify.com/drop).
3. **Arrastrá la carpeta `dolce-vita-web`** completa a la página.
4. En unos segundos te da un link del tipo `https://nombre-raro-123.netlify.app`.
5. Para cambiarle el nombre: **Site configuration → Change site name** →
   por ejemplo `dolcevita-pasteleria` → queda `https://dolcevita-pasteleria.netlify.app`.

**Para actualizar el código más adelante** (no hace falta para cambiar precios ni productos):
en el sitio, pestaña **Deploys**, arrastrá de nuevo la carpeta al recuadro
*"Need to update your site? Drag and drop your site output folder here"*.

### Opción B: con GitHub + Netlify (se actualiza solo)

1. Creá un repositorio en [github.com](https://github.com/new) (puede ser privado), por ejemplo `dolce-vita-web`.
2. Subí los archivos. Desde la terminal, dentro de la carpeta:

   ```bash
   git init
   git add .
   git commit -m "Catálogo Dolce Vita"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/dolce-vita-web.git
   git push -u origin main
   ```

   (O sin terminal: en la página del repo, **Add file → Upload files** y arrastrás los archivos.)
3. En Netlify: **Add new site → Import an existing project → GitHub**, autorizá y elegí el repo.
4. Configuración de build:
   - **Build command:** dejalo vacío.
   - **Publish directory:** `.` (o vacío)
5. **Deploy**. Cada vez que subas un cambio a `main`, Netlify publica solo.

---

## 5. Después de publicar: arreglar la vista previa del link

WhatsApp, Instagram y Facebook necesitan la **dirección completa** de la imagen.
En `index.html`, reemplazá `https://TU-SITIO.netlify.app` por la dirección real
(son 3 lugares: `og:url`, `og:image` y `twitter:image`):

```html
<meta property="og:url" content="https://dolcevita-pasteleria.netlify.app/">
<meta property="og:image" content="https://dolcevita-pasteleria.netlify.app/logo.jpg">
<meta name="twitter:image" content="https://dolcevita-pasteleria.netlify.app/logo.jpg">
```

Volvé a subir la carpeta (o hacé `git push`).

Para comprobarlo, pegá el link en el
[Depurador de Facebook](https://developers.facebook.com/tools/debug/) y tocá
**Volver a extraer**: muestra cómo se va a ver y obliga a refrescar la vista previa
(WhatsApp e Instagram usan la misma información). WhatsApp guarda en caché las vistas previas,
así que si ya habías mandado el link antes, puede tardar en actualizarse.

---

## Checklist final

- [ ] La planilla está publicada como CSV y con republicación automática.
- [ ] El link está pegado en `sheetCsvUrl` en `app.js`.
- [ ] La web está en Netlify y abre bien en el celu.
- [ ] Los meta `og:` apuntan a la dirección real.
- [ ] Un pedido de prueba abre WhatsApp con el mensaje y el total correctos.
- [ ] La dueña tiene acceso de edición a la planilla y una copia de `INSTRUCCIONES.md`.
