//Código //objetos importantes de canvas. 
var canvas = document.getElementById('game'); 
var ctx = canvas.getContext('2d'); 

//Crear objeto nave
var nave=
{
            x:100,
            y:canvas.height-100,
            width:52,
            height:32,
            contador:0
    
};

var juego=
{
            estado:'iniciando'
};

var textoRespuesta=
{
    contador:-1,
    titulo:'',
    subtitulo:''
};

//Definir variables 
var fondo,imgNave,imgEnemigo;
var teclado={};
//arreglo que almacena los disparos
var disparos=[];
var disparosEnemigos=[];
//arreglo que almacena los enemigos
var enemigos=[];
var imagenes= ['space.png','nave.png','enemy.png'];
var preloader;
var SounddisparoNave,SounddisparoEnemigo,SoundmuerteNave,SoundmuerteEnemigo;
//Definicion de funciones 
function loadMedia()
{
    preloader= new PreloadJS();
    preloader.onProgress=progresoCarga;
    cargar();
} 

function cargar()
{
        while(imagenes.length>0)
            {
                var imagen=imagenes.shift();//es sacar el ultimo elemento, y guardarlo en imagen
                preloader.loadFile(imagen);
            }
    }

 function progresoCarga()
{
        console.log(parseInt(preloader.progress *100)+"%");
        if(preloader.progress==1)
            {
                var intervalo=window.setInterval(frameLoop,1000/20);
                fondo= new Image();
                fondo.src='space.png';
                imgNave= new Image();
                imgNave.src='nave.png';
                imgEnemigo=new Image();
                imgEnemigo.src='enemy.png';
                
                SounddisparoNave=document.createElement('audio');
                document.body.appendChild(SounddisparoNave);
                SounddisparoNave.setAttribute('src','disparoNave.wav');
                
                SounddisparoEnemigo=document.createElement('audio');
                document.body.appendChild(SounddisparoEnemigo);
                SounddisparoEnemigo.setAttribute('src','disparoEnemigo.wav');
                
                SoundmuerteNave=document.createElement('audio');
                document.body.appendChild(SoundmuerteNave);
                SoundmuerteNave.setAttribute('src','muertenave.wav');       
                
                SoundmuerteEnemigo=document.createElement('audio');
                document.body.appendChild(SoundmuerteEnemigo);
                SoundmuerteEnemigo.setAttribute('src','muerteenemigo.wav');                  
            }
    }

function dibujarEnemigos()
{
    for(var i in enemigos){
      var enemigo = enemigos[i];
      ctx.save();
      if(enemigo.estado == 'vivo') ctx.fillStyle = 'red';
      if(enemigo.estado == 'muerto') 
          {
            ctx.fillStyle = 'black';
            console.log('pintado negro');
          }
          
      ctx.drawImage(imgEnemigo,enemigo.x,enemigo.y,enemigo.width,enemigo.height);
    }
}

function dibujarFondo()
{ 
    ctx.drawImage(fondo,0,0); 
} 

function dibujarNave()
{
    ctx.save(); // guarda la informacion actual del contexto
    ctx.drawImage(imgNave,nave.x,nave.y,nave.width,nave.height);
    //cambiar a Imagen borrar fillstyle y fillrect
    //ctx.fillStyle='red';
   // ctx.fillRect(nave.x,nave.y,nave.width,nave.height);
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

function dibujarDisparosEnemigos()
{
    for (var i in disparosEnemigos)
        {
            var disparo=disparosEnemigos[i];
            ctx.save();
            ctx.fillStyle='yellow';
            ctx.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
            ctx.restore();

        }
}

function agregarEventosTeclado()
{
  agregarEvento(document,"keydown",function(e){
    //Ponemos en true la tecla presionada
    teclado[e.keyCode] = true;
  });
  agregarEvento(document,"keyup",function(e){
    //Ponemos en true la tecla que dejo de ser presionado
    teclado[e.keyCode] = false;
  });
  function agregarEvento(elemento,nombreEvento,funcion){
         if(elemento.addEventListener)
         {
                     //Navegadores de verdad
                     elemento.addEventListener(nombreEvento,funcion,false);
         }
         else if(elemento.attchEvent){
              //intenet explorer
              elemento.attchEvent(nombreEvento,funcion);
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

function moverNave()
{
    if(teclado[37]){
      //movimiento a la izquierda
      nave.x -= 6;
      if(nave.x <0) nave.x=0;
    }
    if(teclado[39]){
      //movimiento a la derecha
      var limite = canvas.width - nave.width;
      nave.x += 6;
      if(nave.x >limite) nave.x = limite;
    }
    if(teclado[32]){
      //Disparos
      if(!teclado.fire){
          fire();
          teclado.fire = true;
      }
    }
    else teclado.fire = false;
    
    if(nave.estado=='hit')
        {
            nave.contador++;
            if(nave.contador>=20)
                {
                    nave.contador=0;
                    nave.estado='muerto';
                    juego.estado='perdido';
                    textoRespuesta.titulo='GameOver';
                    textoRespuesta.subtitulo='Presiona la tecla R para continuar';
                    textoRespuesta.contador=0;
                }
        }

  }

function moverDisparosEnemigos()
{
    for(var i in disparosEnemigos){
      var disparo = disparosEnemigos[i];
      disparo.y += 3;
    }
    disparosEnemigos = disparosEnemigos.filter(function(disparo){
      return disparo.y < canvas.height-50;
    });
  }

function actualizaEnemigos()
{
      function agregarDisparosEnemigos(enemigo){
        return {
          x: enemigo.x,
          y: enemigo.y,
          width: 10,
          height: 33,
          contador: 0
        }
      }
     if(juego.estado == 'iniciando'){
          for(var i =0;i<10;i++)
          {
            enemigos.push({
              x: 10 + (i*50),
              y: 10,
              height: 32,
              width: 44,
              estado: 'vivo',
              contador: 0
            });
          } 
          juego.estado = 'jugando';

     }
     for(var i in enemigos)
        {
            var enemigo = enemigos[i];
            if(!enemigo) continue;
            if(enemigo && enemigo.estado == 'vivo'){
              enemigo.contador++;
              enemigo.x += Math.sin(enemigo.contador * Math.PI /90)*1.5;

             if(aleatorio(0,enemigos.length * 10) == 4)
             {
                SounddisparoEnemigo.pause();
                SounddisparoEnemigo.currentTime=0;
                SounddisparoEnemigo.play();
              disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
             }
        }
        if(enemigo && enemigo.estado == 'hit'){
             enemigo.contador++;
             if(enemigo.contador >= 20){
              enemigo.estado = 'muerto';
              enemigo.contador = 0;
             }
        }
     }
     enemigos = enemigos.filter(function(enemigo){
      if(enemigo && enemigo.estado != 'muerto' ) return true;
      return false;
     });
  }

function aleatorio(inferior,superior)
{
    var posibilidades= superior-inferior;
    var a = Math.random() * posibilidades;
    a= Math.floor(a);
    return parseInt(inferior)+a;
}

function fire()
{
    SounddisparoNave.pause();
    SounddisparoNave.currentTime=0;
    SounddisparoNave.play();
    disparos.push({
       x:nave.x+20,
       y:nave.y-10,
       width:10,
       height:25
    });
}

function hit(a,b)
{
    var hit=false;   
    
    if(b.x + b.width>= a.x && b.x <a.x + a.width)//colision horizontal
    {
        if(b.y+b.height >= a.y && b.y  < a.y + a.height)//colision vertical
        {
            hit=true;
        }
    }
    if(b.x <= a.x && b.x + b.width >= a.x+ a.width)//colision de a con b
    {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height)
            {
                hit=true;
            }
    }
    if(a.x <= b.x && a.x + a.width >= b.x + b.width)
    {
        if(a.y <= b.y && a.y + a.height >= b.y + b.height)
        {
            hit=true;
        }
    }
    return hit;
}

function verificarContacto()
{
    for(var i in disparos) // Hit al enemigo
        {
            var disparo=disparos[i];
            for(j in enemigos)
                {
                    var enemigo=enemigos[j];
                    if(hit(disparo,enemigo))
                        {
                            SoundmuerteEnemigo.pause();
                            SoundmuerteEnemigo.currentTime=0;
                            SoundmuerteEnemigo.play();
                            enemigo.estado='hit';
                            enemigo.contador=0;
                            
                        }
                }
        }
    
    if(nave.estado=='hit' || nave.estado=='muerto')
        {
            return;
        }
    
    for(var i in disparosEnemigos)
        {
            var disparo =disparosEnemigos[i];
            if(hit(disparo,nave))
                {
                    SoundmuerteNave.pause();
                    SoundmuerteNave.currentTime=0;
                    SoundmuerteNave.play();
                    nave.estado='hit';
                    console.log('tocaron la nave');
                }
        }
}

function dibujaTexto()
{
  if(textoRespuesta.contador == -1) return;
  var alpha = textoRespuesta.contador/50.0;
  if(textoRespuesta.contador>1){
    for(var i in enemigos)
    {
      delete enemigos[i];
        
    }
    for(var i in disparosEnemigos)
    {
      delete disparosEnemigos[i];
    }
    for(var i in disparos)
    {
      delete disparos[i];        
    }
  }
    
  ctx.save();
  ctx.globalAlpha = alpha;
  if(juego.estado == 'perdido'){
    ctx.fillStyle = 'white';
    ctx.font = 'Bold 40pt Arial';
    ctx.fillText(textoRespuesta.titulo, 140,200);
    ctx.font = '14pt Arial';
    ctx.fillText(textoRespuesta.subtitulo, 190,250);
  }
  if(juego.estado == 'victoria'){
    ctx.fillStyle = 'white';
    ctx.font = 'Bold 40pt Arial';
    ctx.fillText(textoRespuesta.titulo, 140,200);
    ctx.font = '14pt Arial';
    ctx.fillText(textoRespuesta.subtitulo, 190,250);
  }
    ctx.globalAlpha = 1;
}

function actualizarEstadoJuego()
{
  if(juego.estado == 'jugando' && enemigos.length == 0){
        juego.estado = 'victoria';
        textoRespuesta.titulo = 'Derrotaste a los enemigos';
        textoRespuesta.subtitulo = 'Presiona la tecla R para reiniciar';
        textoRespuesta.contador = 0;
  }
  if(textoRespuesta.contador >= 0){
      textoRespuesta.contador++;
  }
  if((juego.estado == 'perdido' || juego.estado == 'victoria') && teclado[82]){
         juego.estado = 'iniciando';
         nave.estado = 'vivo';
         textoRespuesta.contador = -1;
  }
}

function frameLoop()
{
    actualizarEstadoJuego();
    moverNave();
    moverDisparos();
    moverDisparosEnemigos();
    dibujarFondo();
    verificarContacto();
    actualizaEnemigos();
    dibujarEnemigos();
    dibujarDisparosEnemigos();
    dibujarDisparos();
    dibujaTexto();
    dibujarNave();
} 


//ejecucion de funciones
window.addEventListener('load',init);

function init()
{
 loadMedia();
 agregarEventosTeclado();   
}
