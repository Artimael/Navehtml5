//Código //objetos importantes de canvas. 
var canvas = document.getElementById('game'); 
var ctx = canvas.getContext('2d'); 
//Crear objeto nave
var nave={
            x:100,
            y:canvas.height-100,
            width:50,
            height:50
}


//Definir variables para las imagenes var fondo; 

//Definicion de funciones 
function loadMedia()
{
    fondo = new Image(); 
    fondo.src = 'space.png'; 
    fondo.onload = function(){ 
        var intervalo =         window.setInterval(frameLoop,1000/55); 
    }
} 

function dibujarFondo()
{ 
    ctx.drawImage(fondo,0,0); 
} 

function dibujarNave()
{
    ctx.save(); // guarda la informacion actual del contexto
    ctx.fillStyle='white';
    ctx.fillRect(nave.x,nave.y,nave.width,nave.height);
    ctx.restore();
}

function frameLoop()
{
    dibujarFondo();
    dibujarNave();
} 

//ejecucion de funciones

loadMedia();