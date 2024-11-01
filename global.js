//..................................................//
//FUNCIÓN IMPRIMIR EVENTOS
function imprimirEventos() {
  const contenedorEventos = document.querySelector("body");

  document.querySelectorAll(".evento").forEach((evento) => evento.remove());

  for (let i = 0; i < eventos.length; i++) {
    const evento = eventos[i];

    const divEvento = document.createElement("div");
    divEvento.className = "evento";

    divEvento.innerHTML = `
<div class="contenedor-form">
           <div class="evento-fecha">
               <p class="fecha dia">${new Date(evento.fecha).getDate()}</p>
               <p class="fecha mes">${new Date(evento.fecha).toLocaleString(
                 "en",
                 { weekday: "long" }
               )}</p>
           </div>
           <div class="evento-info">
               <h1>${evento.nombre}</h1>
               <p class="evento-descripcion">${evento.descripcion}</p>
               <p class="fecha hora">${evento.hora}</p>
           </div>
           <img src="03_Print_A3_Halloween_Deathlight.jpg" alt="Imagen del evento" class="evento-imagen">
           <br><br>
           <button class="evento-boton">Mas Info</button>

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
            <h1 id="mensajeCompra"></h1>
            <button type="button" onclick="calcularIngresosEsperados()">Ver Ingresos</button>
            <p id="mensajeIngreso">Ingreso Total:</p>
        </form>
        </div>
        </div>
       `;

    contenedorEventos.appendChild(divEvento);
  }
}

document
  .querySelector(".CreacionInformacion button")
  .addEventListener("click", crearEvento);

let numEntradas = 0;
const eventos = [];

//..................................................//
//FUNCIÓN CREAR EVENTO
function crearEvento() {
  const nombre = document.querySelector(
    'input[placeholder="Nombre del evento"]'
  ).value;
  const fecha = document.querySelector('input[type="date"]').value;
  const capacidad = document.querySelector(
    'input[placeholder="Capacidad"]'
  ).value;
  const hora = document.querySelector('input[type="time"]').value;
  const artista = document.querySelector(
    'input[placeholder="Nombre Del Artista"]'
  ).value;

  const nuevoEvento = { nombre, fecha, capacidad, descripcion: artista, hora };

  eventos.push(nuevoEvento);

  imprimirEventos();
}

document
  .querySelector(".CreacionInformacion button")
  .addEventListener("click", crearEvento);

const evento = document.getElementById("evento");

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
  const precioBase = 30.25;
  let precioFinal = 0;

  let tipoEntrada = document.getElementById("tipoEntrada").value;
  let numPerson = parseInt(document.getElementById("personas").value);

  if (isNaN(numPerson) || numPerson <= 0) {
    document.getElementById("resultado").innerHTML =
      "Introduce un número válido de personas";
    return;
  }

  numEntradas += numPerson;

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

  precioFinal = Math.round(precioFinal);
  document.getElementById("resultado").innerHTML =
    "El precio de la entrada es: " + precioFinal.toFixed(2) + "€";

  const compraButton = document.querySelector(".evento-boton:last-of-type");
  compraButton.onclick = () => compraEntrada(numEntradas);
}

//..................................................//
//FUNCIÓN CALCULAR INGRESOS ESPERADOS
function calcularIngresosEsperados() {
  const precioBase = 30.25;
  let ingresoTotal = numEntradas * precioBase;

  const porcentajeArtista = 0.1;
  const cantidadArtista = Math.round(ingresoTotal * porcentajeArtista);
  const cantidadSala = ingresoTotal - cantidadArtista;

  document.getElementById(
    "mensajeIngreso"
  ).innerHTML = `Los ingresos esperados totales son: ${ingresoTotal.toFixed(
    2
  )}€ <br>
         Cantidad destinada al artista: ${cantidadArtista.toFixed(2)}€ <br>
         Cantidad destinada a la sala: ${cantidadSala.toFixed(2)}€`;
}

//..................................................//
//FUNCIÓN COMPRAR ENTRADAS
function compraEntrada() {
  if (numEntradas > 0) {
    document.getElementById("mensajeCompra").innerHTML =
      "Gracias por tu compra!";
    alert("El número de entradas vendidas es " + numEntradas);
  } else {
    alert(
      "No has comprado ninguna entrada. Por favor, selecciona un número válido de personas."
    );
  }
}
