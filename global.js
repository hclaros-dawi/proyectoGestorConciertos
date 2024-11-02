let numEntradas = 0;
let fechaConcerto;
let eventos = [];
const precioBase = 30.25;
const fecha = new Date(Date.now());

//..................................................//
//FUNCIÓN PARA GENERARA ID CONCIERTO (ALEATORIO)
function generarIDConcierto(fechaConcierto, precioBase) {
  const milisegundosFecha = fechaConcierto.getTime(); //Fecha a milisegundos
  const precioMultiplicado = Math.round(precioBase * 2000); //Multiplicar el precio base por 2000 por ejemplo
  const idUnico = milisegundosFecha + precioMultiplicado;

  return idUnico;
}

//..................................................//
// FUNCIÓN PARA VALIDAR DÍAS ANTES
function validarDiasAntes(diasAntes) {
  const numDias = parseInt(diasAntes);
  
  if (isNaN(numDias) || numDias < 0) {
    return "Error: El número de días debe ser un número positivo";
  }
  if (numDias > 35) {  
    return "Error: El número máximo de días para recordatorio es 35";
  }
  return true;
}

//..................................................//
//FUNCIÓN CALCULAR HORAS Y DÍAS PARA CONCIERTO
//const fechaFormateada = fecha.toLocaleString();
function calculoHoras(fecha, fechaConcierto) {
  return Math.ceil(
    (fechaConcierto.getTime() - fecha.getTime()) / (1000 * 60 * 60)
  );
}

function calculoDias(fecha, fechaConcierto) {
  const totalHoras = calculoHoras(fecha, fechaConcierto);
  dias = parseInt(totalHoras / 24);
  horas = totalHoras % 24;
  return [dias, horas];
}

//..................................................//
//FUNCIÓN DETERMINAR TEMPORADA
function determinarTemporada(fecha) {
  const temporada = ["Invierno", "Primavera", "Verano", "Otoño"];
  const mes = fecha.getMonth();
  let index = parseInt(mes / 3);
  if (fecha.getMonth() % 3 === 2 && fecha.getDate() >= 21) {
    index++;
  }
  if (index >= 4) {
    index = 0;
  }
  return temporada[index];
}

//..................................................//
//FUNCIÓN PROGRAMAR RECORDATORIOfunction programarRecordatorio(diasAntes){
function programarRecordatorio(evento, diasAntes) {
  //FRANCESC: he modificado esta funcion
  const fecha = new Date(Date.now());
  const [dias, horas] = calculoDias(fecha, new Date(evento.fecha));
  let mensajeRemember = document.getElementById(`recordatorio-${evento.id}`);

  if (dias <= diasAntes && dias >= 0) {
    let mensaje = "Recordatorio: ";

    if (dias === 0 && horas > 0) {
      mensaje += `Quedan ${horas} horas.`;
    } else if (dias === 1) {
      mensaje += `Queda 1 día y ${horas} horas.`;
    } else if (dias > 1) {
      mensaje += `Quedan ${dias} días y ${horas} horas.`;
    } else {
      mensaje = "El evento ya ha pasado.";
    }

    mensajeRemember.textContent = mensaje;
  } else {
    mensajeRemember.textContent = "";
  }
}

setInterval(function () {
  //FRANCESC: he añadido esto
  eventos.forEach((evento) => programarRecordatorio(evento, evento.remember));
}, 1000 * 60);
//.toLocaleString()-->de obj date a string

//..................................................//
//FUNCIÓN IMPRIMIR EVENTOS
function imprimirEventos() {
  const contenedorEventos = document.getElementById("eventos");
  contenedorEventos.innerHTML = "";

  eventos.forEach((evento) => {
    const fechaConcierto = new Date(evento.fecha);
    const [diasRestantes, horasRestantes] = calculoDias(fecha, fechaConcierto);
    const temporada = determinarTemporada(fechaConcierto);
    if (diasRestantes >= 0) {
      //FRANCESC: he añadido un if else que se asegura de que no pongan dias anteriores al actual
      const divEvento = document.createElement("div");
      divEvento.className = "evento";

      divEvento.innerHTML = `
<div class="contenedor-form">
           <div class="evento-fecha">
               <h3>ID: ${evento.id}</h3>
               <p class="fecha dia">${fechaConcierto.getDate()}</p>
               <p class="fecha mes">${fechaConcierto.toLocaleString("en", {
                 weekday: "long",
               })}
           </div>
           <div class="evento-info">
               <h1>${evento.nombre}</h1>
               <p id="recordatorio-${evento.id}"></p>
               <p class="evento-descripcion">Descripción: ${
                 evento.descripcion
               }</p>
               <p class="fecha hora">${evento.hora}</p>
               <p>Faltan ${diasRestantes} día(s) y ${horasRestantes} h para el evento.</p>
               <p>Temporada: ${temporada}</p>
           </div>
           <img src="03_Print_A3_Halloween_Deathlight.jpg" alt="Imagen del evento" class="evento-imagen">
           <br><br>
          <button class="evento-boton" onclick="mostrarDescripcion('${evento.nombre}', '${evento.descripcion}', '${fechaConcierto.toISOString()}', '${evento.id}')">Más Info</button>
           <p id="descripcionEvento-${evento.id}" style="margin-top: 20px; font-weight: bold;"></p>  
    <div class="evento-compra">
        <h2>Comprar entradas</h2>
        <form id="formCompra">
            <label for="tipoEntrada">Tipo de Entrada:</label>
            <select id="tipoEntrada" name="tipoEntrada">
                <option value="general">General</option>
                <option value="infantil">Infantil (4-12 años)</option>
                <option value="pmr">Movilidad Reducida</option>
                <option value="carneJoven">Carné Joven</option>
                <option value="+65anos">Mayor de 65 años</option>
                <option value="packFamiliar3">Pack Familiar (3 personas, 2 niños mínimo)</option>
                <option value="packFamiliar4">Pack Familiar (4 personas, 2 niños mínimo)</option>
                <option value="pack10">Grupo (10+ personas)</option>
                <option value="club">Socios</option>
            </select>
            <br><br>
            <label for="numPersonas">Número de Personas:</label>
            <input type="number" id="personas" name="personas">
            <br>
            <button type="button" onclick="calcularPrecioEntrada()">Ver Precio</button>
            <p id="resultado">Precio Total:</p>
            <button type="button" onclick="compraEntrada()">Comprar</button>
            <p id="mensajeValidacion"></p>
            <h1 id="mensajeCompra"></h1>
            <button type="button" onclick="calcularIngresosEsperados(document.querySelector('#personas').value)">Ver Ingresos</button>
            <p id="mensajeIngreso">Ingreso Total:</p>
        </form>
        </div>
        </div>
       `;

      contenedorEventos.appendChild(divEvento);
    } else {
      alert("No puedes crear eventos en fechas pasadas");
      eventos.splice(eventos.indexOf(evento), 1);
    }
  });
}

//..................................................//
//FUNCIÓN CREAR EVENTO
function crearEvento() {
  //Creo objecto fecha con hora
  const hora = document.querySelector('input[type="time"]').value;
  const fecha = document.querySelector("#fechaConcierto").value;
  fechaConcierto = new Date(`${fecha}T${hora}:00`);
  let nombre = document.querySelector(
    'input[placeholder="Nombre del evento"]'
  ).value;
  nombre = formatearNombreConcierto(nombre);
  const capacidad = document.querySelector(
    'input[placeholder="Capacidad"]'
  ).value;
  let artista = document.querySelector(
    'input[placeholder="Nombre Del Artista"]'
  ).value;
  artista = validarNombreArtista(artista);
  let recordatorio = document.getElementById("diasAntes").value; //FRANCESC: necesitaba esto para programar recordatorio
  
  //Validación input recordatorio
  let validacionRecordatorio = validarDiasAntes(recordatorio);
  if (validacionRecordatorio != true){ 
    alert(validacionRecordatorio);
    return;
  }
  const idConcierto = generarIDConcierto(fechaConcierto, precioBase);
  const nuevoEvento = {
    id: idConcierto,
    nombre,
    fecha: fechaConcierto,
    capacidad,
    descripcion: artista,
    hora,
    remember: recordatorio, //FRANCESC: esto tambien
  };

  eventos.push(nuevoEvento);
  imprimirEventos();

  programarRecordatorio(nuevoEvento, nuevoEvento.remember);

  //Limpiar los campos del formulario
  document.querySelector('input[placeholder="Nombre del evento"]').value = "";
  document.querySelector('input[placeholder="Capacidad"]').value = "";
  document.querySelector('input[placeholder="Nombre Del Artista"]').value = "";
  document.querySelector('input[type="time"]').value = "";
  document.querySelector("#fechaConcierto").value = "";
  document.querySelector("#personas").value = "";
  document.querySelector("#diasAntes").value = "";
}

//EVENT LISTENERS
document
  .querySelector(".CreacionInformacion button")
  .addEventListener("click", crearEvento);
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("crear-evento")
    .addEventListener("click", crearEvento);
  const botonSticky = document.querySelector(".boton-sticky");
  const formulario = document.querySelector(".CreacionInformacion");
  botonSticky.addEventListener("click", () => {
    formulario.classList.toggle("visible");
  });
});

//..................................................//
//FUNCIÓN CALCULAR PRECIO ENTRADA
function calcularPrecioEntrada() {
  let precioFinal = 0;
  const tipoEntrada = document.querySelector("#tipoEntrada").value;
  const numPerson = parseInt(document.querySelector("#personas").value);

  if (isNaN(numPerson) || numPerson <= 0) {
    document.querySelector("#resultado").innerHTML =
      "Introduce un número válido de personas";
    return;
  }

  switch (tipoEntrada) {
    case "general":
      precioFinal = precioBase * numPerson;
      break;
    case "infantil":
    case "pmr":
    case "carneJoven":
    case "+65anos":
      precioFinal = (precioBase - precioBase * 0.25) * numPerson;
      break;
    case "packFamiliar3":
    case "packFamiliar4":
      precioFinal = (precioBase - precioBase * 0.35) * numPerson;
      break;
    case "pack10":
      precioFinal = (precioBase - precioBase * 0.21) * numPerson;
      break;
    case "club":
      precioFinal = (precioBase - precioBase * 0.2) * numPerson;
      break;
  }

  document.querySelector(
    "#resultado"
  ).innerHTML = `Precio Total: ${precioFinal.toFixed(2)}€`;
  numEntradas += numPerson; //Actualiza el total de entradas compradas
}

document.getElementById("crear-evento").addEventListener("click", crearEvento);

//..................................................//
//FUNCIÓN CALCULAR INGRESOS ESPERADOS
function calcularIngresosEsperados(numPerson) {
  const precioBase = 30.25;

  if (isNaN(numPerson) || numPerson <= 0) {
    document.getElementById("mensajeIngreso").innerHTML =
      "Error: El número de personas es inválido";
    return;
  }

  const ingresoTotal = numPerson * precioBase;
  const porcentajeArtista = 0.1;
  const cantidadArtista = Math.round(ingresoTotal * porcentajeArtista);
  const cantidadSala = ingresoTotal - cantidadArtista;
  const ingresoPorAsistente = ingresoTotal / numPerson;

  document.getElementById(
    "mensajeIngreso"
  ).innerHTML = `Los ingresos esperados totales son: ${ingresoTotal.toFixed(
    2
  )}€ <br>
         Los ingresos por asistente son: ${ingresoPorAsistente.toFixed(2)}€ <br>
         Cantidad destinada al artista: ${cantidadArtista.toFixed(2)}€ <br>
         Cantidad destinada a la sala: ${cantidadSala.toFixed(2)}€`;
}

//..................................................//
//FUNCIÓN FORMATEAR NOMBRE
function formatearNombreConcierto(nombre) {
  return nombre
    .toLowerCase() //Convierte todo el texto a minúsculas
    .split(" ") //Divide el texto en palabras
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1)) //Convierte la primera letra a mayúscula
    .join(" "); //Une las palabras con un espacio
}

//..................................................//
//FUNCIÓN PARA CREAR Y MOSTRAR DESCRIPCIÓN (+ INFO)
function mostrarDescripcion(nombreConcierto, nombreArtista, fecha, eventoId) {
  const descripcion = crearDescripcionEvento(
    nombreConcierto,
    nombreArtista,
    fecha
  );
  const contenedorDescripcion = document.getElementById(`descripcionEvento-${eventoId}`);

  contenedorDescripcion.innerHTML = descripcion;
}

function crearDescripcionEvento(nombreConcierto, nombreArtista, fecha) {
  const opcionesFecha = { day: "numeric", month: "long" };
  const fechaFormateada = new Date(fecha).toLocaleDateString(
    "es-ES",
    opcionesFecha
  );

  return `Concierto de ${nombreConcierto} con ${nombreArtista} el ${fechaFormateada}.`;
}

//..................................................//
//FUNCIÓN PARA VALIDAR NOMBRE ARTISTA
function validarNombreArtista(nombre) {
  let nombreFormateado = nombre.trim(); //Elimina espacios en blanco al principio y al final
  nombreFormateado = nombreFormateado.replace(/\s+/g, " "); //Elimina espacios duplicados en el medio

  return nombreFormateado;
}

//..................................................//
//FUNCIÓN PARA VALIDAR NÚMERO DE ENTRADAS
const maxEntradas = 200;
function validarEntradasDisponibles() {
  if (numEntradas < 0) {
    return "Error: El número de entradas ingresadas no es válido.";
  }
  if (numEntradas > maxEntradas) {
    return "Error: Ya no hay entradas disponibles.";
  }
  return true;
}

//..................................................//
// FUNCIÓN GESTIONAR COMPRA DE ENTRADAS
function gestionComprarEntradas() {
  const resultadoValidacion = validarEntradasDisponibles();

  const mensajeElemento = document.getElementById("mensajeValidacion");
  if (resultadoValidacion === true) {
    mensajeElemento.innerHTML =
      "Compra exitosa! Has comprado " + numEntradas + " tickets.";
    mensajeElemento.style.color = "green";
  } else {
    mensajeElemento.innerHTML = resultadoValidacion;
    mensajeElemento.style.color = "red";
  }
}

//..................................................//
//FUNCIÓN COMPRAR ENTRADAS
function compraEntrada() {
  if (numEntradas > 0) {
    gestionComprarEntradas();
    document.getElementById("mensajeCompra").innerHTML =
      "Gracias por tu compra!";
    alert("El número de entradas vendidas es " + numEntradas);
  } else {
    alert(
      "No has comprado ninguna entrada. Por favor, selecciona un número válido de personas."
    );
  }
}
