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

var teclado={}
var disparos=[];

//Definir variables para las imagenes var fondo; 

var fondo,imgNave;
//Definicion de funciones 
function loadMedia()
{
    fondo = new Image(); 
    fondo.src = 'space.png'; 
    fondo.onload = function(){ 
        var intervalo =         window.setInterval(frameLoop,1000/55); 
    }
    imgNave= new Image();
    imgNave.src ='nave.png';
} 

function dibujarFondo()
{ 
    ctx.drawImage(fondo,0,0); 
} 

function dibujarNave()
{
    ctx.save(); // guarda la informacion actual del contexto
    ctx.fillStyle='white';
    ctx.drawImage(imgNave,nave.x,nave.y,nave.width,nave.height);
    ctx.restore();
}

function dibujarDisparos()
{
    ctx.save();
    ctx.fillStyle='white';
    for (var i in disparos)
        {
            var disparo = disparos[i];
            ctx.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
        }
    ctx.restore();
}

function agregarEventosTeclado()
{
    agregarEvento(document,"keydown",function(e){
       //ponemos en true la tecla presionada
        teclado[e.keyCode]=true;   
        console.log(e.keyCode);
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
            else if(elemento.attachEvent)// Internet explorer
            {
                elemento.attachEvent(nombreEvento,funcion);
            }

        }

}


function moverDisparos()
{
    for(var i in disparos)
        {
          var disparo=disparos[i]; 
            disparo.y -=2;
        }
    disparos = disparos.filter(function(disparo){
        return disparo.y >0;
    }); // devolver un arreglo que cumpla con cierta condicion
}

function fire()
{
    disparos.push({
       x:nave.x+20,
       y:nave.y-10,
       width:10,
       height:30
    });
}

function moverNave()
{
    if(teclado[37])//IZQUIERDA
    {
        nave.x -=6;//VELOCIDAD DE LA NAVE
        if(nave.x<0)
            nave.x=0;
    }
    
    if(teclado[39])//DERECHA
    {
        var limite = canvas.width - nave.width;
        nave.x +=6;
        if(nave.x>limite)
            nave.x=limite;
    }
    
    if(teclado[32]) //BARRA ESPACIADORA
        {
            if(!teclado.fire)
                {
                  fire();
                    teclado.fire =true;
                }

        }
    else 
        {
            teclado.fire=false;
        }
    
}

function frameLoop()
{
    moverNave();
    moverDisparos();
    dibujarFondo();
    dibujarDisparos();
    dibujarNave();
} 

//ejecucion de funciones

loadMedia();
agregarEventosTeclado();