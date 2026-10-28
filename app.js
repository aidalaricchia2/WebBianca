/* ===== CONFIGURACIÓN =====
   En la web real, sheetCsvUrl apunta a la planilla publicada como CSV
   (Archivo → Compartir → Publicar en la web → CSV), o al link de "Compartir"
   (cualquier persona con el enlace puede ver), que se convierte solo a CSV. Columnas:
   categoria | medida_categoria | nombre | detalle | precio | opciones | foto | disponible
   Si está vacío o falla, se usan los productos de abajo (DATOS).
   Cómo obtener el link: ver DEPLOY.md. Pegalo entre las comillas de sheetCsvUrl. */
const CONFIG = {
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/1Xg2YcJzcWCX3cfJvFA53E8PVbtoyfA0Vp_gDoEapf50/edit?usp=sharing",
  contactos: [
    { nombre: "Bian", tel: "5492616185860", visible: "261 618 5860" },
    { nombre: "Anto", tel: "5492613433445", visible: "261 343 3445" }
  ]
};

const DATOS = [
  ["Tartas","26 cm","Tarta de coco","",32000,"",""],
  ["Tartas","26 cm","Tarta cabsha","",30000,"",""],
  ["Tartas","26 cm","Tarta de durazno","",25000,"",""],
  ["Tartas","26 cm","Tarta de frutillas","",25000,"",""],
  ["Tartas","26 cm","Tarta de ricota","",32000,"",""],
  ["Tartas","26 cm","Turrón alemán","31 cm",32000,"",""],
  ["Tartas","26 cm","Pastafrola","",27000,"",""],
  ["Budines","20 cm","Budín de vainilla clásico","",5000,"",""],
  ["Budines","20 cm","Budín de vainilla con chispas de chocolate y frutos secos","",6500,"",""],
  ["Budines","20 cm","Budín de chocolate","",6000,"",""],
  ["Budines","20 cm","Budín de chocolate con chispas de chocolate","",6500,"",""],
  ["Budines","20 cm","Budín marmolado","",6000,"",""],
  ["Budines","20 cm","Budín de limón clásico","",5500,"",""],
  ["Budines","20 cm","Budín de limón con semillas de amapola","",6500,"",""],
  ["Budines","20 cm","Budín de naranja","",5500,"",""],
  ["Brownies","24 cm","Brownie clásico","",18000,"",""],
  ["Brownies","24 cm","Brownie con oreos","",20000,"",""],
  ["Brownies","24 cm","Brownie con nueces","",20000,"",""],
  ["Alfajores de maicena","","Mini alfajores de maicena","Caja x12",8500,"",""],
  ["Pastelitos dulces","","Mini pastelitos","Caja x12",6500,"Membrillo|Batata",""]
].map(([categoria,medida,nombre,detalle,precio,opciones,foto]) => ({categoria,medida,nombre,detalle,precio,opciones,foto,disponible:true}));

/* Line drawings per category, shown until there's a real photo */
const ICONOS = {
  "Tartas":'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="13.5"/><path d="M14 18l20 12M14 30l20-12M24 10.5v27"/></svg>',
  "Budines":'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22c0-6 7-9 16-9s16 3 16 9"/><path d="M8 22l3 15h26l3-15"/><path d="M15 18c2 2 4 2 6 0M27 18c2 2 4 2 6 0"/><path d="M12 28h24"/></svg>',
  "Brownies":'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="9" y="9" width="30" height="30" rx="3"/><path d="M19 9v30M29 9v30M9 19h30M9 29h30"/></svg>',
  "Alfajores de maicena":'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><ellipse cx="24" cy="20" rx="15" ry="5"/><path d="M9 20v4c0 3 7 5 15 5s15-2 15-5v-4"/><path d="M9 28v4c0 3 7 5 15 5s15-2 15-5v-4"/><path d="M12 26.5c3 1 7 1.5 12 1.5s9-.5 12-1.5" stroke-dasharray="1 2.5"/></svg>',
  "Pastelitos dulces":'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M24 6l5 9 10-1-5 9 5 9-10-1-5 9-5-9-10 1 5-9-5-9 10 1z"/><circle cx="24" cy="24" r="4"/></svg>'
};
const iconoGenerico = ICONOS["Tartas"];

const $ = s => document.querySelector(s);
const pesos = n => "$" + Math.round(n).toLocaleString("es-AR");
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let productos = [];
let pedido = {};          // key -> cantidad ; key = id o id::opcion
let eleccion = {};        // id -> opción elegida
let destino = 0;
const fotosRotas = new Set(); // fotos que no cargaron: se muestra el ícono de la categoría

function guardar(){ try{ localStorage.setItem("dv-pedido", JSON.stringify({pedido,destino,nombre:$("#nombre").value})); }catch(e){} }
function cargarGuardado(){ try{ const d = JSON.parse(localStorage.getItem("dv-pedido")||"{}"); pedido = d.pedido||{}; destino = d.destino||0; if(d.nombre) $("#nombre").value = d.nombre; }catch(e){} }

/* --- Google Sheets (CSV) --- */
function parseCSV(t){
  t = t.replace(/^﻿/,"");
  const filas=[]; let fila=[], campo="", q=false;
  for(let i=0;i<t.length;i++){ const c=t[i];
    if(q){ if(c=='"'){ if(t[i+1]=='"'){campo+='"';i++;} else q=false; } else campo+=c; }
    else if(c=='"') q=true; else if(c==','){fila.push(campo);campo="";}
    else if(c=='\n'||c=='\r'){ if(c=='\r'&&t[i+1]=='\n')i++; fila.push(campo); filas.push(fila); fila=[]; campo=""; }
    else campo+=c; }
  if(campo||fila.length){fila.push(campo);filas.push(fila);}
  const [enc,...resto]=filas; const k=enc.map(h=>slug(h).replace(/-/g,"_"));
  return resto.filter(r=>r.some(x=>x.trim())).map(r=>Object.fromEntries(k.map((h,i)=>[h,(r[i]||"").trim()])));
}
const limpiar = s => String(s??"").replace(/\s+/g," ").trim();
// "$32.000", "32,000.00", "$ 32.000,00" -> 32000 (drops cents, keeps only digits)
const aNumero = s => Number(limpiar(s).replace(/[.,]\d{1,2}$/,"").replace(/\D/g,"")) || 0;
// "Sí", "SI", "x", "" -> visible ; "no", "No ", "false", "0" -> hidden
const estaDisponible = s => !/^(no|false|0|n)$/.test(slug(limpiar(s)));
// Drive share links -> direct image URL
function urlFoto(s){
  const u = limpiar(s); if(!u) return "";
  const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?(?:.*&)?id=|uc\?(?:.*&)?id=|thumbnail\?(?:.*&)?id=)([\w-]{10,})/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : u;
}
/* Fixes what usually goes wrong when the sheet is edited by hand:
   extra spaces, "TARTAS" vs "Tartas", prices with $ and dots, empty rows,
   medida_categoria filled in only some rows. */
function normalizar(lista){
  const nombresCat = {};   // clave sin mayúsculas/acentos -> nombre a mostrar
  const medidas = {};      // clave -> primera medida no vacía
  Object.keys(ICONOS).forEach(c=>{ nombresCat[slug(c)] = c; });
  const ps = lista.map(f=>{
    const cat = limpiar(f.categoria) || "Otros", clave = slug(cat) || "otros";
    if(!nombresCat[clave]) nombresCat[clave] = cat;
    const medida = limpiar(f.medida);
    if(medida && !medidas[clave]) medidas[clave] = medida;
    return {clave, nombre:limpiar(f.nombre), detalle:limpiar(f.detalle), precio:aNumero(f.precio),
      opciones:String(f.opciones??"").split("|").map(limpiar).filter(Boolean).join("|"),
      foto:urlFoto(f.foto), disponible:f.disponible};
  }).filter(p=>p.nombre && p.disponible);
  return ps.map(({clave,...p})=>({categoria:nombresCat[clave], medida:medidas[clave]||"", ...p}));
}
/* Link de edición/compartir (…/d/ID/edit…) → descarga CSV de esa pestaña. Los publicados (…/d/e/…) quedan igual. */
function urlCsv(url){
  const m = url.match(/docs\.google\.com\/spreadsheets\/d\/([\w-]{20,})/);
  if(!m) return url;
  const gid = url.match(/[#&?]gid=(\d+)/);
  return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv${gid?"&gid="+gid[1]:""}`;
}
async function cargarProductos(){
  const url = urlCsv(limpiar(CONFIG.sheetCsvUrl));
  if(url){
    try{
      const ctrl = new AbortController(); const espera = setTimeout(()=>ctrl.abort(), 10000);
      const r = await fetch(url + (url.includes("?")?"&":"?") + "t=" + Date.now(), {cache:"no-store", signal:ctrl.signal});
      clearTimeout(espera);
      if(!r.ok) throw new Error("HTTP " + r.status);
      const texto = await r.text();
      if(/^\s*</.test(texto)) throw new Error("La planilla devolvió una página, no un CSV (¿está publicada como CSV?)");
      const filas = parseCSV(texto);
      if(!filas.length || !("nombre" in filas[0])) throw new Error("No encontré la columna 'nombre' en la planilla");
      const ps = normalizar(filas.map(f=>({...f, medida:f.medida_categoria, disponible:estaDisponible(f.disponible)})));
      if(ps.length) return ps;
      throw new Error("La planilla no tiene productos disponibles");
    }catch(e){ console.warn("No se pudo leer la planilla, uso datos locales", e); }
  }
  return normalizar(DATOS);
}
function mostrarCargando(){
  $("#catalogo").innerHTML = `<div class="cargando" role="status"><span class="puntos" aria-hidden="true"><i></i><i></i><i></i></span>Cargando productos…</div>`;
}

/* --- Render catálogo --- */
function render(){
  const cats = [...new Set(productos.map(p=>p.categoria))];
  $("#chips").innerHTML = cats.map((c,i)=>`<a class="chip" href="#${slug(c)}" ${i===0?'aria-current="true"':''}>${esc(c)}</a>`).join("");
  $("#catalogo").innerHTML = cats.map(c=>{
    const ps = productos.filter(p=>p.categoria===c);
    return `<section class="cat" id="${slug(c)}">
      <div class="cat-head"><h2>${esc(c)}</h2>${ps[0].medida?`<span class="medida">${esc(ps[0].medida)}</span>`:""}</div>
      <div class="grid">${ps.map(cardHTML).join("")}</div></section>`;
  }).join("");
  observarSecciones();
}
function opcionesDe(p){ return p.opciones ? p.opciones.split("|").map(s=>s.trim()).filter(Boolean) : []; }
function cardHTML(p){
  const ops = opcionesDe(p);
  if(ops.length && !eleccion[p.id]) eleccion[p.id]=ops[0];
  const key = ops.length ? p.id+"::"+eleccion[p.id] : p.id;
  const cant = pedido[key]||0;
  const foto = p.foto && !fotosRotas.has(p.foto) ? `<img src="${esc(p.foto)}" alt="" loading="lazy">` : (ICONOS[p.categoria]||iconoGenerico);
  return `<article class="prod ${cant?'en-pedido':''}" data-id="${p.id}">
    <div class="foto">${foto}</div>
    <div class="info">
      <div class="nombre">${esc(p.nombre)}</div>
      ${p.detalle?`<div class="detalle">${esc(p.detalle)}</div>`:""}
      ${ops.length?`<div class="opciones" role="group" aria-label="Sabor">${ops.map(o=>`<button type="button" class="op" data-op="${esc(o)}" aria-pressed="${o===eleccion[p.id]}">${esc(o)}</button>`).join("")}</div>`:""}
      <div class="fila">
        <span class="precio">${pesos(p.precio)}</span>
        ${cant ? stepperHTML(key,cant) : `<button type="button" class="agregar" data-add="${esc(key)}"><span aria-hidden="true">+</span> Agregar</button>`}
      </div>
    </div></article>`;
}
function stepperHTML(key,cant){
  return `<span class="stepper"><button type="button" data-menos="${esc(key)}" aria-label="Quitar uno">−</button><output>${cant}</output><button type="button" data-mas="${esc(key)}" aria-label="Sumar uno">+</button></span>`;
}
function refrescarCard(id){
  const el = document.querySelector(`.prod[data-id="${id}"]`); if(!el) return;
  const p = productos.find(x=>x.id===id);
  const tmp = document.createElement("div"); tmp.innerHTML = cardHTML(p); el.replaceWith(tmp.firstElementChild);
}

/* --- Pedido --- */
function cambiar(key,delta){
  pedido[key] = Math.max(0,(pedido[key]||0)+delta);
  if(!pedido[key]) delete pedido[key];
  refrescarCard(key.split("::")[0]); actualizarPedido(); guardar();
}
function lineas(){
  return Object.entries(pedido).map(([key,cant])=>{
    const [id,op] = key.split("::"); const p = productos.find(x=>x.id===id); if(!p) return null;
    return {key,cant,p,op,sub:p.precio*cant};
  }).filter(Boolean);
}
function mensaje(){
  const ls = lineas(); const total = ls.reduce((a,l)=>a+l.sub,0);
  const nombre = $("#nombre").value.trim();
  const items = ls.map(l=>`• ${l.cant} × ${l.p.nombre}${l.op?` (${l.op})`:""}${l.p.detalle&&!/x\d+/i.test(l.p.detalle)?` · ${l.p.detalle}`:""} — ${pesos(l.sub)}`).join("\n");
  return `¡Hola${CONFIG.contactos[destino]?" "+CONFIG.contactos[destino].nombre:""}! ${nombre?`Soy ${nombre}. `:""}Quiero hacer un pedido de:\n\n${items}\n\n*Total: ${pesos(total)}*\n\n¿Para qué día lo podrían tener? Así coordinamos la entrega y el pago. ¡Gracias! 🧁`;
}
function actualizarPedido(){
  const ls = lineas(); const total = ls.reduce((a,l)=>a+l.sub,0); const n = ls.reduce((a,l)=>a+l.cant,0);
  $("#barra").dataset.vacia = n? "false":"true";
  $("#cuenta").textContent = n; $("#barraTotal").textContent = pesos(total); $("#total").textContent = pesos(total);
  $("#items").innerHTML = ls.length ? ls.map(l=>`<li>
      <span class="n">${esc(l.p.nombre)}${l.op||l.p.detalle?`<small>${esc([l.op,l.p.detalle].filter(Boolean).join(" · "))} · ${pesos(l.p.precio)} c/u</small>`:`<small>${pesos(l.p.precio)} c/u</small>`}</span>
      <span class="sub">${pesos(l.sub)}</span>
      ${stepperHTML(l.key,l.cant)}
      <button type="button" class="quitar" data-quitar="${esc(l.key)}">Quitar</button></li>`).join("")
    : `<li class="vacio" style="display:block;border:0">Todavía no agregaste nada.</li>`;
  const msg = mensaje();
  $("#preview").textContent = msg;
  const c = CONFIG.contactos[destino];
  $("#enviar").href = `https://wa.me/${c.tel}?text=${encodeURIComponent(msg)}`;
  $("#enviar").setAttribute("aria-disabled", ls.length? "false":"true");
  $("#enviar").style.opacity = ls.length? 1 : .5;
  $("#enviar").style.pointerEvents = ls.length? "auto":"none";
}

/* --- Hoja --- */
function abrir(){ $("#hoja").classList.add("abierto"); $("#velo").classList.add("abierto"); $("#hoja").setAttribute("aria-hidden","false"); $("#cerrar").focus(); }
function cerrar(){ $("#hoja").classList.remove("abierto"); $("#velo").classList.remove("abierto"); $("#hoja").setAttribute("aria-hidden","true"); }

/* --- Chips activos según scroll --- */
function observarSecciones(){
  if(!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){
      document.querySelectorAll(".chip").forEach(ch=>{
        const on = ch.getAttribute("href")==="#"+e.target.id; ch.setAttribute("aria-current",on);
        if(on) ch.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});
      });
    }});
  },{rootMargin:"-30% 0px -60% 0px"});
  document.querySelectorAll("section.cat").forEach(s=>io.observe(s));
}

/* --- Eventos --- */
document.addEventListener("click", e=>{
  const t = e.target.closest("button,a"); if(!t) return;
  if(t.dataset.add){ cambiar(t.dataset.add,1); }
  else if(t.dataset.mas){ cambiar(t.dataset.mas,1); }
  else if(t.dataset.menos){ cambiar(t.dataset.menos,-1); }
  else if(t.dataset.quitar){ cambiar(t.dataset.quitar,-pedido[t.dataset.quitar]); }
  else if(t.dataset.op){ const id = t.closest(".prod").dataset.id; eleccion[id]=t.dataset.op; refrescarCard(id); }
  else if(t.id==="abrir"){ abrir(); }
  else if(t.id==="cerrar"){ cerrar(); }
  else if(t.id==="copiar"){
    const msg = mensaje();
    const ok = ()=>{ t.textContent="Mensaje copiado"; setTimeout(()=>t.textContent="Copiar el mensaje",2000); };
    try{ navigator.clipboard.writeText(msg).then(ok).catch(()=>seleccionar()); }catch(_){ seleccionar(); }
  }
});
function seleccionar(){ const r=document.createRange(); r.selectNodeContents($("#preview")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); }
// Si una foto no carga (link mal compartido, borrado, etc.), mostrar el ícono de la categoría
document.addEventListener("error", e=>{
  const img = e.target; if(img.tagName!=="IMG" || !img.closest(".foto")) return;
  const p = productos.find(x=>x.id===img.closest(".prod").dataset.id);
  fotosRotas.add(img.getAttribute("src"));
  img.parentElement.innerHTML = (p && ICONOS[p.categoria]) || iconoGenerico;
}, true);
$("#velo").addEventListener("click",cerrar);
document.addEventListener("keydown",e=>{ if(e.key==="Escape") cerrar(); });
$("#nombre").addEventListener("input",()=>{ actualizarPedido(); guardar(); });

(async function iniciar(){
  cargarGuardado();
  mostrarCargando();
  productos = (await cargarProductos()).map(p=>({...p,id:slug(p.categoria+"-"+p.nombre)}));
  // descartar del pedido guardado productos que ya no existen
  Object.keys(pedido).forEach(k=>{ if(!productos.some(p=>p.id===k.split("::")[0])) delete pedido[k]; });
  $("#quien").innerHTML = CONFIG.contactos.map((c,i)=>`<label><input type="radio" name="destino" id="destino-${i}" value="${i}" ${i===destino?"checked":""}><span>${esc(c.nombre)}<small>${esc(c.visible)}</small></span></label>`).join("");
  $("#quien").addEventListener("change",e=>{ destino=Number(e.target.value); actualizarPedido(); guardar(); });
  render(); actualizarPedido();
})();
