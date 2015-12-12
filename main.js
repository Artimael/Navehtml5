//Objetos importantes canvas
var canvas = document.getElementById('game');
var ctx=canvas.getContext('2d');

//variables para imagenes
var fondo;

//definicion de funciones
function loadMedia()
{
    fondo= new Image();
    fondo.src='space.png';
    fondo.onload = function(){
        var intervalo =window.setInterval(frameLoop,1000/55);
    }
}

function drawBackground()
{
    ctx.drawImage(fondo,0,0);
}

function frameLoop()//actualiza posiciones y dibuja brackground
{
    drawBackground();
}

//ejecucion de funciones
loadMedia();
