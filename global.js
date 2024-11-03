let numEntradas = 0;
let fechaConcerto;
let eventos = [];
const precioBase = 30.25;
const fecha = new Date(Date.now());

//..................................................//
//FUNCIÓN PARA GENERARA ID CONCIERTO (ALEATORIO)
function generarIDConcierto(fechaConcierto, precioBase) {
  const milisegundosFecha = fechaConcierto.getTime();
  const precioMultiplicado = Math.round(precioBase * 1000);
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
//FUNCIÓN PROGRAMAR RECORDATORIO
function programarRecordatorio(evento, diasAntes) {
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
  eventos.forEach((evento) => programarRecordatorio(evento, evento.remember));
}, 1000 * 60 * 60);
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
               <p>Temporada: ${temporada}</p>
               <p class="fecha hora">${evento.hora}</p>
               <p class="evento-descripcion">Descripción: ${
                 evento.descripcion
               }</p>
              <p id="recordatorio-${evento.id}"></p>
            </div>
           <img src="03_Print_A3_Halloween_Deathlight.jpg" alt="Imagen del evento" class="evento-imagen">
           <br><br>
          <button class="evento-boton" onclick="mostrarDescripcion('${
            evento.nombre
          }', '${evento.descripcion}', '${fechaConcierto.toISOString()}', '${
        evento.id
      }')">Más Info</button>
           <p id="descripcionEvento-${
             evento.id
           }" style="margin-top: 20px; font-weight: bold;"></p>  
    <div class="evento-compra">
        <h2>Comprar entradas</h2>
        <form id="formCompra">
            <label for="tipoEntrada">Tipo de Entrada:</label>
            <select class="tipoEntrada">
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
            <input type="number" class="personas" name="personas">
            <br>
            <button type="button" onclick="calcularPrecioEntrada(this)">Ver Precio</button>
            <p class="resultado">Precio Total:</p>
            <button type="button" onclick="compraEntrada(event, ${
              evento.id
            })">Comprar</button>
            <p class="mensajeValidacion"></p>
            <h1 class="mensajeCompra"></h1>
            <button type="button" onclick="calcularIngresosEsperados(this, ${evento.id})">Ver Ingresos</button>
            <p class="mensajeIngreso">Ingreso Total:</p>
        </form>
        </div>
        </div>`;
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
  let recordatorio = document.getElementById("diasAntes").value;

  //Validaciones
  let validacionCapacidad =
    capacidad > 200
      ? "Error: La capacidad no puede exceder 200 personas."
      : true;
  let validacionRecordatorio = validarDiasAntes(recordatorio);

  if (validacionCapacidad !== true) {
    alert(validacionCapacidad);
    return;
  }

  if (validacionRecordatorio !== true) {
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
    remember: recordatorio,
    entradasVendidas: 0,
    listaEntradasVendidas: []
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
  document.querySelector("#diasAntes").value = "";
}

//EVENT LISTENERS
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
function calcularPrecioEntrada(button) {
  let precioFinal = 0;
  const contenedorEvento = button.closest(".evento-compra");
  const tipoEntrada = contenedorEvento.querySelector(".tipoEntrada").value;
  const numPerson = parseInt(contenedorEvento.querySelector(".personas").value);

  if (isNaN(numPerson) || numPerson <= 0) {
    document.querySelector(".resultado").innerHTML =
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

  contenedorEvento.querySelector(
    ".resultado"
  ).innerHTML = `Precio Total: ${precioFinal.toFixed(2)}€`;
}
//document.getElementById("crear-evento").addEventListener("click", crearEvento);

//..................................................//
//FUNCIÓN PRECIO ENT
function precioEnt(tipoEntrada){
  switch (tipoEntrada) {
    case "general":
      return precioBase;
      break;
    case "infantil":
    case "pmr":
    case "carneJoven":
    case "+65anos":
      return (precioBase - precioBase * 0.25);
      break;
    case "packFamiliar3":
    case "packFamiliar4":
      return (precioBase - precioBase * 0.35);
      break;
    case "pack10":
      return (precioBase - precioBase * 0.21);
      break;
    case "club":
      return (precioBase - precioBase * 0.2);
      break;
  }
}

//..................................................//
//FUNCIÓN CALCULAR INGRESOS ESPERADOS
function calcularIngresosEsperados(button, id) {
  const evento = buscarEvento(id);
  const precioBase = 30.25;
  const contenedorEvento = button.closest(".evento-compra");
  const numPerson = parseInt(contenedorEvento.querySelector(".personas").value);

  if (isNaN(numPerson) || numPerson <= 0) {
    contenedorEvento.querySelector(".mensajeIngreso").innerHTML =
      "Error: El número de personas es inválido";
    return;
  }

  let ingresoTotal = 0;

  for (let i = 0; i < evento.listaEntradasVendidas.length; i++) {
    ingresoTotal += precioEnt(evento.listaEntradasVendidas[i]);
  }

  const porcentajeArtista = 0.1;
  const cantidadArtista = Math.round(ingresoTotal * porcentajeArtista);
  const cantidadSala = ingresoTotal - cantidadArtista;
  const ingresoPorAsistente = ingresoTotal / evento.listaEntradasVendidas.length;

  contenedorEvento.querySelector(".mensajeIngreso").innerHTML = `Los ingresos esperados totales son: ${ingresoTotal.toFixed(2)}€ <br>
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
  const contenedorDescripcion = document.getElementById(
    `descripcionEvento-${eventoId}`
  );

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
function gestionComprarEntradas(contenedorEvento, numEntradas) {
  const resultadoValidacion = validarEntradasDisponibles(numEntradas);
  const mensajeElemento = contenedorEvento.querySelector(".mensajeValidacion");

  if (resultadoValidacion === true) {
    const mensajeExito = `Compra exitosa! Has comprado ${numEntradas} tickets.`;
    mensajeElemento.innerHTML = mensajeExito;
    mensajeElemento.style.color = "green";
    return mensajeExito;
  } else {
    mensajeElemento.innerHTML = resultadoValidacion;
    mensajeElemento.style.color = "red";
    return resultadoValidacion;
  }
}

//..................................................//
//FUNCIÓN BUSCAR EVENTOS
function buscarEvento(id){
  for (let i = 0; i<eventos.length;i++){
    if (eventos[i].id == id){
      return eventos[i]
    }
  }
}

//..................................................//
//FUNCIÓN COMPRAR ENTRADAS
function compraEntrada(event, id) {
  const evento = buscarEvento(id);
  const contenedorEvento = event.target.closest(".evento-compra");

  const numPersonasInput = contenedorEvento.querySelector(".personas").value;
  const tipoEntrada = contenedorEvento.querySelector(".tipoEntrada").value;
  const numPersonas = parseInt(numPersonasInput);
  if (
    numPersonas > 0 &&
    evento.entradasVendidas + numPersonas <= evento.capacidad
  ) {
    numEntradas += numPersonas;
    evento.entradasVendidas += numPersonas;
    for (let i = 0; i < numPersonas; i++) {
      evento.listaEntradasVendidas.push(tipoEntrada);
    }
    const resultadoValidacion = gestionComprarEntradas(
      contenedorEvento,
      numPersonas
    );
    const mensajeCompraElemento =
      contenedorEvento.querySelector(".mensajeCompra");
    mensajeCompraElemento.innerHTML = "Gracias por tu compra!";

    alert(`El número de entradas vendidas para este evento es: ${evento.entradasVendidas}`);
  } else if (evento.entradasVendidas + numPersonas > evento.capacidad) {
    let entradasRestantes = evento.capacidad - evento.entradasVendidas;
    alert(
      `No puedes comprar tantas entradas para este evento, solo quedan ${entradasRestantes} entradas.`
    );
  } else {
    alert(
      "No has comprado ninguna entrada. Por favor, selecciona un número válido de personas."
    );
  }
}
