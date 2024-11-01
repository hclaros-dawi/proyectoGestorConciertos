
const fecha = new Date(Date.now());
//const fechaFormateada = fecha.toLocaleString();
const fechaConcierto = new Date(2024, 11, 22, 14, 30)
const fechaConciertoFormateada = fechaConcierto.toLocaleString();
const [dias, horas] = calculoDias();


function calculoHoras(){
    return Math.ceil((fechaConcierto.getTime() - fecha.getTime())
    /(1000 * 60 * 60));
}
function calculoDias(){
    const totalHoras = calculoHoras();
    const dias = parseInt(totalHoras / 24);
    const horas = totalHoras % 24;
    return [dias, horas];
}
function determinarTemporada(fecha){
    const temporada = ["Invierno", "Primavera", "Verano", "Otoño"];
    const mes = fecha.getMonth();
    let index = parseInt(mes / 3);
    if(fecha.getMonth() % 3 === 2 && fecha.getDate() >= 25){
        index++;
    }
    if(index >= 4){
        index = 0;
    }
    return temporada[index];
}
function programarRecordatorio(diasAntes){
    if(dias < diasAntes){
        console.log(dias < 0 ?  "No puedes poner una fecha anterior"
            : "Queda" + (dias === 1  ? " " +  dias + " dia" :
                dias > 1 ? "n " + dias + " días" :
                    dias === 0 && horas > 1 ? "n" : "") +
            (dias > 0 ? " y" : "") +
            (horas === 1 ? " " + +horas + " hora" :
                horas > 1 ? " " + horas + " horas" : ""))
        console.log("El concierto es el " + fechaConciertoFormateada + " en la estación de " + saberTemporada(fechaConcierto))
    }
}
programarRecordatorio(54)
/*setInterval(function(){
    fecha = new Date(Date.now())
    fechaFormateada = fecha.toLocaleString()
        [dias, horas] = timestamp(fechaConcierto)
    console.log(dias < 0 ?  "No puedes poner una fecha anterior" : "Queda" + (dias === 1  ? " " +  dias + " dia" :
            dias > 1 ? "n " + dias + " días" :
                dias === 0 && horas > 1 ? "n" : "") +
        (dias > 0 ? " y " : "") +
        ( horas === 1 ? " " + + horas + " hora" :
            horas > 1 ? " " + horas + " horas" : ""))

}, 1000 * 60 * 60 * 24)
*/
/*function timestamp(fecha_concierto){
    const dias = Math.ceil((fecha_concierto.getTime() - fecha.getTime())
        / (1000 * 60 * 60 * 24))
    const horas = Math.abs(fecha_concierto.getHours() - fecha.getHours())
    return [dias, horas];
}*/