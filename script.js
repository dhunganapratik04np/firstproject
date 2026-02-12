// ---------- Login Page ----------
const CORRECT_PASSWORD = "guukha";
const wrongSound = document.getElementById("wrongSound");
const correctSound = document.getElementById("correctSound");

document.body.addEventListener("touchstart", () => {
  wrongSound.play().then(()=>{wrongSound.pause();wrongSound.currentTime=0;}).catch(()=>{});
  correctSound.play().then(()=>{correctSound.pause();correctSound.currentTime=0;}).catch(()=>{});
}, {once:true});

function togglePassword(){
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function checkPassword(){
  const input = document.getElementById("password").value.trim();
  const msg = document.getElementById("message");
  const loginCard = document.getElementById("loginCard");
  const gallery = document.getElementById("gallery");

  if(input === CORRECT_PASSWORD){
    msg.textContent="✅ Correct Password!";
    msg.className="msg success";
    correctSound.currentTime=0;
    correctSound.play();
    setTimeout(()=>{
      loginCard.style.display="none";
      gallery.style.display="block";
    }, 1000);
  } else {
    msg.textContent="❌ Wrong Password!";
    msg.className="msg error";
    wrongSound.currentTime=0;
    wrongSound.play();
    if(navigator.vibrate){ navigator.vibrate(200); } // mobile vibration
  }
}

// ---------- Gallery ----------
function playAudio(file){
  const player = document.getElementById("audioPlayer");
  player.src=file;
  player.currentTime=0;
  player.play();
}

// ---------- Flappy Bird ----------
const gameDiv = document.getElementById("gameDiv");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bgMusic = document.getElementById("bgMusic");
const gameOverSound = document.getElementById("gameOverSound");

let bird, pipes, score, gameInterval, frameCount;

function startGame(){
  document.getElementById("gallery").style.display="none";
  gameDiv.style.display="flex";

  bird={x:50, y:canvas.height/2, width:25, height:25, gravity:0.5, lift:-10, velocity:0};
  pipes=[];
  score=0;
  frameCount=0;

  bgMusic.currentTime=0;
  bgMusic.loop=true;
  bgMusic.play();

  gameInterval=setInterval(updateGame,20);
  document.addEventListener("keydown", flap);
  canvas.addEventListener("click", flap);
}

function goBack(){
  gameDiv.style.display="none";
  document.getElementById("gallery").style.display="block";
  clearInterval(gameInterval);
  pipes=[];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  bgMusic.pause();
}

function flap(){ bird.velocity=bird.lift; }

function updateGame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Bird
  bird.velocity+=bird.gravity;
  bird.velocity*=0.98;
  bird.y+=bird.velocity;

  ctx.fillStyle="yellow";
  ctx.fillRect(bird.x,bird.y,bird.width,bird.height);

  // Pipes
  if(frameCount % 90 === 0){
    const gap=120;
    const top=Math.random()*(canvas.height-gap-50)+25;
    pipes.push({x:canvas.width, top:top, bottom:top+gap, width:35});
  }

  ctx.fillStyle="green";
  for(let i=pipes.length-1;i>=0;i--){
    let pipe=pipes[i];
    pipe.x-=2.5;
    ctx.fillRect(pipe.x,0,pipe.width,pipe.top);
    ctx.fillRect(pipe.x,pipe.bottom,pipe.width,canvas.height-pipe.bottom);

    if(bird.x<pipe.x+pipe.width && bird.x+bird.width>pipe.x &&
       (bird.y<pipe.top || bird.y+bird.height>pipe.bottom)){ endGame(); return; }

    if(!pipe.passed && pipe.x+pipe.width<bird.x){ pipe.passed=true; score++; }

    if(pipe.x+pipe.width<0){ pipes.splice(i,1); }
  }

  // Ceiling & floor
  if(bird.y+bird.height>canvas.height || bird.y<0){ endGame(); return; }

  // Score
  ctx.fillStyle="white";
  ctx.font="20px Arial";
  ctx.fillText("Score: "+score,10,25);

  frameCount++;
}

function endGame(){
  clearInterval(gameInterval);
  bgMusic.pause();
  gameOverSound.currentTime=0;
  gameOverSound.play();
  alert("Game Over! Your Score: "+score);
  goBack();
}
