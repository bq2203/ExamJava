/* ---------- RELOJ EN VIVO ---------- */
// Muestra la fecha y hora actual, y se refresca cada segundo.
const fechaHoraElemento = document.getElementById('fecha-hora');

function actualizarFechaHora() {
  let ahora = new Date();
  fechaHoraElemento.innerText = `${ahora.toLocaleDateString('es-ES')} - ${ahora.toLocaleTimeString('es-ES')}`;
}
actualizarFechaHora(); // se ejecuta una vez al cargar la página
setInterval(actualizarFechaHora, 1000); // y luego cada 1000ms (1 seg)

const contadorTareas = document.getElementById('contador-tareas');

/* ---------- ELEMENTOS DEL DOM ---------- */
// Guardamos referencias a los elementos del HTML que vamos a usar
// varias veces, para no tener que buscarlos cada vez.
const inputTarea = document.getElementById('ingresar-tarea');
const inputResponsable = document.getElementById('ingresar-responsable');
const boton = document.querySelector('button'); // único botón en la página
const listaDeTareas = document.getElementById('lista-de-tareas'); // contenedor padre

/* ---------- EVENTOS PARA AGREGAR TAREA ---------- */
// Se puede agregar una tarea de dos formas: con clic en el botón...
boton.addEventListener('click', agregarTarea);

// ...o presionando Enter mientras se escribe en el input.
inputTarea.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') agregarTarea();
});

/* ---------- CREAR Y AGREGAR UNA TAREA ---------- */
function agregarTarea() {
  // Solo continuamos si ambos campos tienen texto escrito.
  if (inputTarea.value && inputResponsable.value) {

    // Creamos el div contenedor que va a representar toda la tarea.
    let tareaNueva = document.createElement('div');
    tareaNueva.classList.add('tarea');

    // Creamos los párrafos con el texto de la tarea y el responsable.
    let texto = document.createElement('p');
    let responsable = document.createElement('p');
    texto.innerText = 'Tarea: ' + inputTarea.value;
    responsable.innerText = 'Responsable: ' + inputResponsable.value;

    // Creamos la barra de progreso (un slider) junto con el texto
    // que muestra el porcentaje actual al lado.
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

    // Cada vez que el usuario mueve el slider, se actualiza en vivo.
    barraProgreso.addEventListener('input', () => actualizarBarra(barraProgreso));

    // Vamos armando la tarea completa metiendo todo dentro del div principal.
    tareaNueva.appendChild(texto);
    tareaNueva.appendChild(responsable);
    tareaNueva.appendChild(barraContenedor);
    actualizarBarra(barraProgreso); // pinta el 0% inicial apenas se crea

    // Creamos el contenedor de iconos (completar y eliminar).
    let iconos = document.createElement('div');
    iconos.classList.add('iconos');
    tareaNueva.appendChild(iconos);

    // Ícono de completar: al hacer clic, marca/desmarca la tarea.
    let completar = document.createElement('i');
    completar.classList.add('bi', 'bi-check-circle-fill', 'icono-completar');
    completar.addEventListener('click', completarTarea);

    // Ícono de eliminar: al hacer clic, borra la tarea de la lista.
    let eliminar = document.createElement('i');
    eliminar.classList.add('bi', 'bi-trash3-fill', 'icono-eliminar');
    eliminar.addEventListener('click', eliminarTarea);

    iconos.append(completar, eliminar);

    // Insertamos la tarea ya armada dentro de la lista visible en pantalla.
    listaDeTareas.appendChild(tareaNueva);
    actualizarContador();

    // Limpiamos los inputs para que queden listos para la próxima tarea.
    inputTarea.value = '';
    inputResponsable.value = '';

  } else {
    // Si falta algún campo, avisamos con una alerta en vez de crear la tarea.
    alert('Por favor ingresa una tarea y un responsable.');
  }
}

/* ---------- ACTUALIZAR BARRA DE PROGRESO ---------- */
// Se ejecuta al crear la tarea (para pintar el 0%) y cada vez que
// el usuario mueve el slider.
function actualizarBarra(input) {
  let valor = input.value;

  // Busca el texto "X%" (hermano de la barra) y lo actualiza.
  let barraContenedor = input.parentNode;
  barraContenedor.querySelector('.barra-texto').innerText = valor + '%';

  // Si el progreso llega a 100%, marca automáticamente la tarea como completada.
  let tarea = barraContenedor.parentNode;
  tarea.classList.toggle('completada', valor == 100);
}

/* ---------- COMPLETAR TAREA ---------- */
function completarTarea(e) {
  // e.target es el ícono en el que se hizo clic. Subimos dos niveles
  // en el DOM (ícono -> contenedor de iconos -> tarea) para llegar
  // al div completo de la tarea.
  let tarea = e.target.parentNode.parentNode;

  // toggle agrega la clase si no la tiene, o la quita si ya la tiene,
  // así el mismo ícono sirve para marcar y desmarcar.
  tarea.classList.toggle('completada');
}

/* ---------- ELIMINAR TAREA ---------- */
function eliminarTarea(e) {
  // Misma lógica de subir dos niveles hasta encontrar la tarea completa.
  let tarea = e.target.parentNode.parentNode;
  tarea.remove(); // la borra completamente del DOM
  actualizarContador();
}

/* ---------- CONTADOR DE TAREAS ---------- */
function actualizarContador() {
  // Cuenta cuántos hijos (tareas) tiene la lista y actualiza el texto.
  let cantidad = listaDeTareas.children.length;
  contadorTareas.innerText = `Tareas: ${cantidad}`;
}