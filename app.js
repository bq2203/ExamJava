/* ----------------------------------------------------------------
   FECHA Y HORA ACTUAL EN VIVO
   ---------------------------------------------------------------- */
const fechaHoraElemento = document.getElementById('fecha-hora');

function actualizarFechaHora() {
  let ahora = new Date();

  let fecha = ahora.toLocaleDateString('es-ES');

  let hora = ahora.toLocaleTimeString('es-ES');

  fechaHoraElemento.innerText = `${fecha} - ${hora}`;
}
actualizarFechaHora();

// setInterval ejecuta la función cada 1000 ms (1 segundo),
setInterval(actualizarFechaHora, 1000);

//DEFINIR CONSTANTE DE CONTADOR 
const contadorTareas = document.getElementById('contador-tareas');

/*----------------------------------------------------------------
   1. SELECCIONAR LOS ELEMENTOS DEL index.html
   Guardamos en variables los 3 elementos con los que vamos a
   trabajar todo el tiempo, para no tener que buscarlos de nuevo
   cada vez que los necesitemos.
   ---------------------------------------------------------------- */

// getElementById -> porque el <input> tiene un id único: "ingresar-tarea"
const inputTarea = document.getElementById('ingresar-tarea');
const inputResponsable = document.getElementById('ingresar-responsable');

// querySelector('button') -> como solo hay UN <button> en toda la página,
// no hace falta darle un id, basta con buscar la etiqueta.
const boton = document.querySelector('button');

// getElementById -> el <div id="lista-de-tareas"> es el "contenedor padre"
// donde vamos a ir metiendo cada tarea nueva que el usuario cree.
const listaDeTareas = document.getElementById('lista-de-tareas');

/* ----------------------------------------------------------------
   2. EVENTOS QUE DISPARAN LA CREACIÓN DE UNA TAREA
   Queremos que el usuario pueda agregar una tarea de DOS formas:
   a) Haciendo click en el botón "Crear Tarea"
   b) Escribiendo en el input y presionando la tecla Enter
   ---------------------------------------------------------------- */

// a) Click en el botón -> ejecuta la función agregarTarea
//    OJO: aquí se pasa la función SIN paréntesis (agregarTarea, no
//    agregarTarea()). Si le pusiéramos paréntesis, JavaScript
//    ejecutaría la función inmediatamente al cargar la página, en
//    vez de esperar a que el usuario haga click.
boton.addEventListener('click', agregarTarea);

// b) Tecla Enter dentro del input
//    'keydown' se dispara cada vez que el usuario presiona CUALQUIER
//    tecla mientras el input está enfocado. El parámetro "e" (evento)
//    trae información sobre qué tecla fue.
inputTarea.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    // Si la tecla presionada fue "Enter", hacemos exactamente
    // lo mismo que si hubieran dado click en el botón.
    agregarTarea();
  }
});


/* ----------------------------------------------------------------
   3. FUNCIÓN PRINCIPAL: CREAR Y AGREGAR UNA TAREA AL DOM
   ---------------------------------------------------------------- */
function agregarTarea() {

  // --- Validación: solo seguimos si el input tiene algo escrito ---
  // input.value es un string; en JavaScript un string vacío ("")
  // se evalúa como "falso" dentro de un if, así que este if es
  // equivalente a escribir: if (inputTarea.value !== "" && inputResponsable.value !== "")
  if (inputTarea.value && inputResponsable.value) {

    /* ----- 3.1 Crear el contenedor de la tarea (el <div class="tarea">) ----- */
    // document.createElement('div') crea un elemento en MEMORIA,
    // todavía no está pegado en el HTML visible.
    let tareaNueva = document.createElement('div');

    // classList.add() le pone la clase CSS "tarea" (definida en
    // styles.css) para que se vea con el fondo azul, bordes, etc.
    tareaNueva.classList.add('tarea');

    /* ----- 3.2 Crear el texto de la tarea (el <p>) ----- */
    let texto = document.createElement('p');
    let responsable = document.createElement('p');

    // innerText = lo que el usuario escribió en el input.
    // Aquí NO leemos innerText del input (los inputs no tienen
    // innerText), leemos su propiedad .value, que es donde vive
    // el texto que el usuario tecleó.
    texto.innerText = 'Tarea: ' + inputTarea.value;
    responsable.innerText = 'Responsable: ' + inputResponsable.value;


    let barraContenedor = document.createElement('div');
    barraContenedor.classList.add('barra-contenedor');

    let barraTexto = document.createElement('span');
    barraTexto.classList.add('barra-texto');
    barraTexto.innerText = '0%';


    let barraProgreso = document.createElement('input');
    barraProgreso.type = 'range';
    barraProgreso.min = 0;
    barraProgreso.max = 100;
    barraProgreso.value = 0;
    barraProgreso.classList.add('barra-progreso');


    barraContenedor.appendChild(barraTexto);
    barraContenedor.appendChild(barraProgreso);

    // 'input' se dispara EN VIVO mientras arrastras (a diferencia de
    // 'change', que solo se dispara cuando sueltas el mouse).
    // Usamos una función flecha corta: le pasamos directo el input
    // que disparó el evento (e.target), sin necesitar un nombre de
    // función aparte ni un parámetro "e" completo.
    barraProgreso.addEventListener('input', () => actualizarBarra(barraProgreso));

    // appendChild() mete el <p> DENTRO del <div class="tarea">.
    // Queda algo como: <div class="tarea"><p>texto...</p></div>
    tareaNueva.appendChild(texto);
    tareaNueva.appendChild(responsable);
    tareaNueva.appendChild(barraContenedor);

    // La barra ya pertenece a la tarea, así que actualizarBarra puede
    // encontrar el contenedor padre y marcar la tarea correctamente.
    actualizarBarra(barraProgreso);

    /* ----- 3.3 Crear el contenedor de los iconos (el <div class="iconos">) ----- */
    let iconos = document.createElement('div');
    iconos.classList.add('iconos');
    tareaNueva.appendChild(iconos);

    /* ----- 3.4 Crear el ícono de "completar" (una palomita verde) ----- */
    // document.createElement('i') crea una etiqueta <i>, que es la
    // que usa Bootstrap Icons para mostrar iconos (son fuentes,
    // no imágenes).
    let completar = document.createElement('i');

    // classList.add() puede recibir VARIAS clases a la vez separadas
    // por comas:
    // - 'bi'                  -> clase base que activa Bootstrap Icons
    // - 'bi-check-circle-fill' -> el ícono específico (palomita)
    // - 'icono-completar'     -> nuestra propia clase, para el color
    //   verde y el hover que definimos en styles.css
    completar.classList.add('bi', 'bi-check-circle-fill', 'icono-completar');

    // Le decimos que, al hacer click en ESTE ícono en particular,
    // se ejecute la función completarTarea (definida más abajo).
    completar.addEventListener('click', completarTarea);

    /* ----- 3.5 Crear el ícono de "eliminar" (un bote de basura) ----- */
    let eliminar = document.createElement('i');
    eliminar.classList.add('bi', 'bi-trash3-fill', 'icono-eliminar');
    eliminar.addEventListener('click', eliminarTarea);

    /* ----- 3.6 Meter los dos iconos dentro del contenedor "iconos" ----- */
    // append() (a diferencia de appendChild) permite insertar VARIOS
    // elementos de una sola vez, separados por comas.
    iconos.append(completar, eliminar);

    /* ----- 3.7 Insertar la tarea completa (ya armada) dentro de la lista ----- */
    // En este punto, "tareaNueva" ya tiene adentro: el texto (<p>) y
    // el contenedor de iconos (<div class="iconos">) con sus 2 <i>.
    // Recién AHORA se hace visible en la página.
    listaDeTareas.appendChild(tareaNueva);
    actualizarContador();

    // Limpiamos el input para que quede listo para la siguiente tarea
    // (buena práctica: si no lo hacemos, el texto anterior se queda
    // escrito ahí y hay que borrarlo a mano).
    inputTarea.value = '';
    inputResponsable.value = '';

  } else {
    // Si el input estaba vacío, no creamos nada: solo avisamos.
    alert('Por favor ingresa una tarea y un responsable.');
  }
}



/* ----------------------------------------------------------------
   3.8 PINTAR EL RELLENO DE LA BARRA SEGÚN SU VALOR
   Un <input type="range"> no se rellena de color solo: por defecto
   toda la barra se ve del mismo color. Para simular el "relleno
   verde hasta donde vas", generamos un gradiente CSS en cada cambio:
   verde desde 0% hasta el valor actual, y gris desde ahí hasta 100%.
   ---------------------------------------------------------------- */
/* ----------------------------------------------------------------
   3.8 ACTUALIZAR (Y PINTAR) LA BARRA DE PROGRESO
   Una sola función que hace todo: repinta el gradiente, actualiza
   el texto "X%" y marca la tarea como completada si llega a 100%.
   Se usa en DOS momentos:
   a) Al crear la tarea (para pintar el 0% inicial)
   b) En cada 'input' mientras el usuario arrastra el control
   ---------------------------------------------------------------- */
function actualizarBarra(input) {
  let valor = input.value; // ej: "35"

  // Pinta el gradiente: verde hasta "valor", gris el resto.
  input.style.background = `linear-gradient(to right, rgb(15,231,65) ${valor}%, #e0e0e0 ${valor}%)`;

  // Actualiza el texto "X%" que está al lado (mismo padre: barraContenedor).
  let barraContenedor = input.parentNode;
  barraContenedor.querySelector('.barra-texto').innerText = valor + '%';

  // Si llega a 100%, marca la tarea como completada automáticamente.
  let tarea = barraContenedor.parentNode;
  tarea.classList.toggle('completada', valor == 100);
}


/* ----------------------------------------------------------------
   4. MARCAR UNA TAREA COMO COMPLETADA
   Esta función se ejecuta cada vez que el usuario hace click en el
   ícono de la palomita (✓) de CUALQUIER tarea de la lista.
   ---------------------------------------------------------------- */
function completarTarea(e) {

  // "e" es el objeto del evento click. e.target es EXACTAMENTE el
  // elemento sobre el que se hizo click: en este caso, el <i> de
  // la palomita.
  //
  // Recordemos la estructura que armamos:
  // <div class="tarea">              <- lo que queremos encontrar
  //   <p>texto</p>
  //   <div class="iconos">           <- el papá directo del ícono
  //     <i class="icono-completar">  <- e.target (donde se hizo click)
  //     <i class="icono-eliminar">
  //   </div>
  // </div>
  //
  // e.target.parentNode        -> nos da el <div class="iconos">
  // e.target.parentNode.parentNode -> nos da el <div class="tarea">
  // Por eso hay que subir DOS niveles para llegar a la tarea completa.
  let tarea = e.target.parentNode.parentNode;

  // classList.toggle('completada'):
  // - Si la tarea NO tiene la clase "completada", se la AGREGA.
  // - Si la tarea YA tiene la clase "completada", se la QUITA.
  // Así, con el mismo botón, podemos marcar y desmarcar la tarea
  // (aplica el tachado y el fondo negro que definimos en styles.css).
  tarea.classList.toggle('completada');
}


/* ----------------------------------------------------------------
   5. ELIMINAR UNA TAREA
   Misma lógica de "subir hasta encontrar la tarea", pero esta vez
   para borrarla por completo del DOM.
   ---------------------------------------------------------------- */
function eliminarTarea(e) {
  // Igual que en completarTarea: subimos 2 niveles desde el ícono
  // de la basura hasta llegar al <div class="tarea"> completo.
  let tarea = e.target.parentNode.parentNode;

  // remove() elimina el elemento directamente del DOM.
  // A diferencia de ocultarlo con CSS (display: none), remove()
  // lo borra de verdad: ya no existe en el árbol del documento.
  tarea.remove();
  actualizarContador();
}

function actualizarContador() {
  let cantidad = listaDeTareas.children.length; 
  contadorTareas.innerText = `Tareas: ${cantidad}`;
}