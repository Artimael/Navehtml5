//Código //objetos importantes de canvas. 
var canvas = document.getElementById('game'); 
var ctx = canvas.getContext('2d'); 
//Crear objeto nave
var nave={
            x:100,
            y:canvas.height-100,
            width:30,
            height:50
}

var teclado={
    
}

//Definir variables para las imagenes var fondo; 

var fondo;
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


function agregarEventosTeclado()
{
    agregarEvento(document,"keydown",function(e){
       //ponemos en true la tecla presionada
        teclado[e.keyCode]=true;    
    });
    
    agregarEvento(document,"keyup",function(e){
       //ponemos en true la tecla que dejo de ser presionada
        teclado[e.keyCode]=false;    
    });
    
        function agregarEvento(elemento,nombreEvento,funcion)
        {
            if(elemento.addEventListener)// si existe utilizalo chrome firefox opera
            {
                elemento.addEventListener(nombreEvento,funcion,false);
            }
            else if(elemento.attachEvent))// Internet explorer
            {
                elemento.attachEvent(nombreEvento,funcion);
            }

        }

}

function frameLoop()
{
    dibujarFondo();
    dibujarNave();
} 

//ejecucion de funciones

loadMedia();
agregarEventosTeclado();