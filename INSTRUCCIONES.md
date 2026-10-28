# Cómo actualizar el catálogo de Dolce Vita

Todo lo que se ve en la web (productos, precios, fotos) sale de **la planilla de Google Sheets**.
No hace falta tocar ningún archivo de la web: cambiás la planilla y listo.

> ⏱️ **Los cambios se ven al recargar la página** (en el celu, deslizá hacia abajo para
> recargar). Si no lo ves, esperá unos segundos y volvé a recargar.

---

## Cómo está armada la planilla

Cada **fila es un producto**. Las columnas son:

| Columna | Qué va | Ejemplo |
|---|---|---|
| **categoria** | El grupo donde aparece el producto | `Tartas` |
| **medida_categoria** | La medida que se muestra al lado del título de la categoría | `26 cm` |
| **nombre** | El nombre del producto | `Tarta de coco` |
| **detalle** | Un dato extra (opcional) | `Caja x12` |
| **precio** | El precio, solo el número | `32000` |
| **opciones** | Sabores para elegir, separados con una barrita `\|` (opcional) | `Membrillo\|Batata` |
| **foto** | El link de la foto (opcional) | link de Google Drive |
| **disponible** | `si` para mostrarlo, `no` para ocultarlo | `si` |

Los productos y las categorías aparecen en la web **en el mismo orden que en la planilla**.

---

## ⚠️ Lo que NO hay que tocar

- **La primera fila** (la de los títulos: `categoria`, `medida_categoria`, `nombre`…).
  No la borres, no le cambies los nombres y no le agregues columnas en el medio.
  La web usa esos títulos para saber qué es cada cosa.
- No cambies la planilla de lugar ni le cambies cómo está compartida: tiene que seguir en
  *"Cualquier persona con el enlace" → Lector*.
- La pestaña de productos tiene que ser **la primera** (la de más a la izquierda).

Todo lo demás lo podés cambiar tranquila. Si te equivocás, se arregla volviendo a escribir el dato.

---

## Cambiar un precio

1. Buscá la fila del producto.
2. En la columna **precio**, escribí el número nuevo. Por ejemplo `35000`.
3. Listo. En unos minutos aparece en la web.

> Lo ideal es escribir solo el número (`35000`), pero si ponés `$35.000` también funciona.

---

## Agregar un producto

1. Andá a la última fila de la categoría donde lo querés (o al final de la planilla).
2. Si querés que quede junto a los de su categoría: hacé clic derecho sobre el número de fila
   → **Insertar 1 fila debajo**.
3. Completá:
   - **categoria**: escribila **igual** que los otros productos de esa categoría (por ejemplo `Budines`).
   - **nombre**: el nombre del producto.
   - **precio**: el número.
   - **disponible**: `si`.
   - Lo demás es opcional.

**Si tiene sabores para elegir** (como los pastelitos), en **opciones** escribilos separados
con una barrita vertical: `Membrillo|Batata|Dulce de leche`.
La barrita `|` se escribe con **AltGr + 1** en el teclado de la compu.

---

## Ocultar un producto sin borrarlo

Ideal para cuando algo no está disponible por un tiempo:

1. En la columna **disponible**, cambiá `si` por `no`.
2. Desaparece de la web. Cuando vuelva a estar, ponés `si` de nuevo.

Así no perdés el precio ni la foto.

---

## Crear una categoría nueva

1. Agregá una fila (o varias) con el nombre de la categoría nueva en **categoria**.
   Por ejemplo: `Tortas`.
2. Si querés que muestre una medida al lado del título, escribila en **medida_categoria**
   (alcanza con ponerla en la primera fila de esa categoría).
3. La categoría aparece sola en la web, con su botoncito arriba para ir directo.

> Tip: escribí el nombre de la categoría siempre igual en todas sus filas.
> Si una dice `Tortas` y otra `tortas`, la web igual las junta, pero si una dice `Torta`
> (sin la s) va a quedar como otra categoría distinta.

---

## Poner fotos (con Google Drive)

### 1. Subir la foto a Drive

1. Entrá a [drive.google.com](https://drive.google.com).
2. Te conviene crear una carpeta, por ejemplo **Fotos web Dolce Vita**
   (botón **+ Nuevo** → **Carpeta**).
3. Entrá a la carpeta y arrastrá las fotos ahí (o **+ Nuevo** → **Subir archivo**).
   Desde el celu: botón **+** → **Subir**.

> Las fotos se ven en un cuadradito, así que quedan mejor las fotos **cuadradas** o con
> el producto bien al centro.

### 2. Compartirla para que se vea en la web

Esto es **muy importante**: si no lo hacés, la foto no aparece (se ve el dibujito de la categoría).

1. Clic derecho sobre la foto → **Compartir** → **Compartir**.
2. Abajo, en **Acceso general**, donde dice **Restringido**, cambialo a
   **Cualquier persona con el enlace** (que quede como **Lector**).
3. Tocá **Copiar enlace** y después **Listo**.

> Atajo: si hacés esto mismo con **la carpeta entera**, todas las fotos que subas ahí
> ya quedan compartidas.

### 3. Pegar el link en la planilla

Pegá el link que copiaste en la columna **foto** del producto. Va a ser algo así:

`https://drive.google.com/file/d/1AbCdEfGh.../view?usp=sharing`

No hace falta modificarlo, la web lo acomoda sola.

**Si la foto no aparece:** casi siempre es porque no quedó compartida como
"Cualquier persona con el enlace". Revisá el paso 2.

---

## Si algo sale mal

- **La web muestra productos viejos:** recargá la página. Si siguen igual, revisá que la
  planilla siga compartida con *"Cualquier persona con el enlace"* y que la pestaña de
  productos sea la primera.
- **Desapareció un producto:** fijate que en **disponible** diga `si` y que tenga **nombre**.
- **Un precio aparece en $0:** revisá que la columna **precio** tenga un número.
- **Se rompió algo de la planilla:** en Google Sheets, **Archivo → Historial de versiones →
  Ver historial de versiones** te deja volver a como estaba antes.
