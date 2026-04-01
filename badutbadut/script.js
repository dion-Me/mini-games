const clownImg = new Image();
clownImg.src = "clown.png";

const peopleImg = new Image();
peopleImg.src = "people.png";

const bgImg = new Image();
bgImg.src = "bg.jpg";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

let sprites = [];
let score = 0;
let timeLeft = 30;
let gameRunning = true;

class Sprite {
constructor(x, y, vx, type){
this.x = x;
this.y = y;
this.vx = vx;
this.size = 40;
this.type = type;
}

update(){
this.x += this.vx;
}

draw(){
	ctx.imageSmoothingEnabled = false;
ctx.fill();
}

}

function spawnSprite(){

const y = Math.random() * (canvas.height - 50) + 25;

const isClown = Math.random() < 0.25;

const type = isClown ? "clown" : "normal";

sprites.push(
new Sprite(-40, y, 2 + Math.random()*2, type)
);

}

function update(){

sprites.forEach(s => s.update());

sprites = sprites.filter(s => s.x < canvas.width + 50);

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

// draw background
ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

// draw sprites
sprites.forEach(s => {

let img = s.type === "clown" ? clownImg : peopleImg;

ctx.drawImage(
img,
s.x - s.size/2,
s.y - s.size/2,
s.size,
s.size
);

});

}

function loop(){

if(!gameRunning) return;

update();
draw();

requestAnimationFrame(loop);

}

function handleClick(x,y){

sprites.forEach((s,i)=>{

const dx = x - s.x;
const dy = y - s.y;
const dist = Math.sqrt(dx*dx + dy*dy);

if(dist < s.size/2){

if(s.type === "clown"){
score++;
scoreEl.textContent = score;
sprites.splice(i,1);
}

}

});

}

canvas.addEventListener("click",(e)=>{

const rect = canvas.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

handleClick(x,y);

});

canvas.addEventListener("touchstart",(e)=>{

const rect = canvas.getBoundingClientRect();

const x = e.touches[0].clientX - rect.left;
const y = e.touches[0].clientY - rect.top;

handleClick(x,y);

});

setInterval(spawnSprite,1000);

setInterval(()=>{

if(!gameRunning) return;

timeLeft--;
timeEl.textContent = timeLeft;

if(timeLeft <= 0){
gameRunning = false;
alert("Game Over! Score: " + score);
}

},1000);

loop();