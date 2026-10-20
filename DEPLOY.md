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

## 4. Publicar la web con GitHub Pages (gratis)

El código está en https://github.com/aidalaricchia2/WebBianca (rama `main`, archivos en la raíz).

1. El repo tiene que ser **público** (con la cuenta gratuita, Pages no publica repos privados):
   *Settings → General →* abajo de todo, *Danger Zone → Change visibility → Make public*.
2. *Settings → Pages*.
3. En **Build and deployment**:
   - **Source:** *Deploy from a branch*.
   - **Branch:** `main` y carpeta `/ (root)` → **Save**.
4. En 1 o 2 minutos la web queda en:

   ```
   https://aidalaricchia2.github.io/WebBianca/
   ```

   (El estado del deploy se ve en la pestaña **Actions** del repo.)

**Para actualizar el código más adelante** (no hace falta para cambiar precios ni productos):

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Cada `push` a `main` vuelve a publicar la web sola.

> Alternativa: Netlify también sirve (y permite repo privado). En Netlify:
> *Add new site → Import an existing project → GitHub*, elegir el repo, build command vacío,
> publish directory `.`. Si se cambia, hay que actualizar los meta `og:` (ver paso 6).

---

## 5. (Opcional) Dominio propio

1. Comprá el dominio: `.com.ar` en [nic.ar](https://nic.ar) (con clave fiscal), o `.com` en
   cualquier registrador.
   - NIC Argentina no administra registros DNS: delegá el dominio a un servicio de DNS
     gratuito como [Cloudflare](https://cloudflare.com) (en *nic.ar → Delegaciones* pegás los
     dos servidores que te da Cloudflare) y cargá los registros ahí.
2. Registros DNS:

   | Tipo | Nombre | Valor |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `aidalaricchia2.github.io` |

3. En el repo, *Settings → Pages → Custom domain*: escribí el dominio → **Save**.
   Cuando el DNS propague (de minutos a 24 h), tildá **Enforce HTTPS**.
4. Recomendado: verificá el dominio en *Settings de tu cuenta → Pages → Add a domain*,
   para que nadie lo pueda usar con otro repo.
5. Actualizá los meta `og:` con el dominio nuevo (paso 6).

---

## 6. Vista previa del link (WhatsApp, Instagram)

WhatsApp, Instagram y Facebook necesitan la **dirección completa** de la imagen.
En `index.html` ya están apuntando a GitHub Pages:

```html
<meta property="og:url" content="https://aidalaricchia2.github.io/WebBianca/">
<meta property="og:image" content="https://aidalaricchia2.github.io/WebBianca/logo.jpg">
<meta name="twitter:image" content="https://aidalaricchia2.github.io/WebBianca/logo.jpg">
```

Si cambiás la dirección (dominio propio u otro hosting), actualizá esas 3 líneas y hacé `git push`.

Para comprobarlo, pegá el link en el
[Depurador de Facebook](https://developers.facebook.com/tools/debug/) y tocá
**Volver a extraer**: muestra cómo se va a ver y obliga a refrescar la vista previa
(WhatsApp e Instagram usan la misma información). WhatsApp guarda en caché las vistas previas,
así que si ya habías mandado el link antes, puede tardar en actualizarse.

---

## Checklist final

- [ ] La planilla está publicada como CSV y con republicación automática.
- [ ] El link está pegado en `sheetCsvUrl` en `app.js`.
- [ ] La web está publicada en GitHub Pages y abre bien en el celu.
- [ ] Los meta `og:` apuntan a la dirección real (si cambiaste a dominio propio).
- [ ] Un pedido de prueba abre WhatsApp con el mensaje y el total correctos.
- [ ] La dueña tiene acceso de edición a la planilla y una copia de `INSTRUCCIONES.md`.
