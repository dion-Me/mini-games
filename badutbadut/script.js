const clownImg = new Image();
clownImg.src = "clown.png";

const peopleImg = new Image();
peopleImg.src = "people.png";

const bgImg = new Image();
bgImg.src = "bg.webp";

const obstacle1 = new Image();
obstacle1.src = "object-tent.png";

const obstacle2 = new Image();
obstacle2.src = "object-bush.png";

// 🔊 Sound
const hitSound = new Audio("hit.wav");
const bgm = new Audio("bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

let sprites = [];
let obstacles = [];
let score = 0;
let timeLeft = 30;
let gameRunning = true;

// 🎯 Sprite Class
class Sprite {
constructor(x, y, vx, vy, type){
this.x = x;
this.y = y;
this.vx = vx;
this.vy = vy;
this.size = 40;
this.type = type;
}

update(){
this.x += this.vx;
this.y += this.vy;
}
}

// 🎯 Spawn Sprite (multi arah + speed clown)
function spawnSprite(){

const side = Math.floor(Math.random() * 4);

let x, y, vx, vy;

const speed = 2 + Math.random()*2;

const isClown = Math.random() < 0.25;
const type = isClown ? "clown" : "normal";

let finalSpeed = speed;

if(type === "clown" && Math.random() < 0.3){
finalSpeed *= 1.5;
}

switch(side){

case 0:
x = -40;
y = Math.random() * canvas.height;
vx = finalSpeed;
vy = 0;
break;

case 1:
x = canvas.width + 40;
y = Math.random() * canvas.height;
vx = -finalSpeed;
vy = 0;
break;

case 2:
x = Math.random() * canvas.width;
y = -40;
vx = 0;
vy = finalSpeed;
break;

case 3:
x = Math.random() * canvas.width;
y = canvas.height + 40;
vx = 0;
vy = -finalSpeed;
break;

}

sprites.push(new Sprite(x, y, vx, vy, type));
}

// 🎯 Obstacle random
function initObstacles(){
obstacles = [
{
x: Math.random() * (canvas.width - 100),
y: Math.random() * (canvas.height - 100),
size: 180,
img: obstacle1
},
{
x: Math.random() * (canvas.width - 100),
y: Math.random() * (canvas.height - 100),
size: 100,
img: obstacle2
}
];
}

// 🎯 Update
function update(){
sprites.forEach(s => s.update());

sprites = sprites.filter(s =>
s.x > -60 &&
s.x < canvas.width + 60 &&
s.y > -60 &&
s.y < canvas.height + 60
);
}

// 🎯 Draw
function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

// background
ctx.globalAlpha = 0.8; // 0.0 - 1.0 (semakin kecil = makin buram)
ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
ctx.globalAlpha = 1; // reset

// sprites
sprites.forEach(s => {

let img = s.type === "clown" ? clownImg : peopleImg;

ctx.save();

// pindahkan origin ke posisi sprite
ctx.translate(s.x, s.y);

// flip horizontal kalau ke kiri
if(s.vx < 0){
ctx.scale(-1, 1);
}

// (optional, biasanya tidak perlu)
// if(s.vy < 0){
// ctx.scale(1, -1);
// }

ctx.drawImage(
img,
- s.size/2,
- s.size/2,
s.size,
s.size
);

ctx.restore();

});

// obstacle (di depan)
obstacles.forEach(o=>{
ctx.drawImage(o.img, o.x, o.y, o.size, o.size);
});

}

// 🎯 Game Loop
function loop(){
if(!gameRunning) return;

update();
draw();

requestAnimationFrame(loop);
}

// 🎯 Click handler
function handleClick(x,y){

// block kalau kena obstacle
for(let o of obstacles){
if(
x > o.x &&
x < o.x + o.size &&
y > o.y &&
y < o.y + o.size
){
return;
}
}

sprites.forEach((s,i)=>{

const dx = x - s.x;
const dy = y - s.y;

if(dx*dx + dy*dy < (s.size/2)*(s.size/2)){

if(s.type === "clown"){
score++;
scoreEl.textContent = score;

// 🔊 sound hit
hitSound.currentTime = 0;
hitSound.play();

sprites.splice(i,1);
}

}

});

}

// 🎯 Input
canvas.addEventListener("click",(e)=>{

// start bgm saat interaksi pertama
bgm.play();

const rect = canvas.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

handleClick(x,y);

});

canvas.addEventListener("touchstart",(e)=>{

bgm.play();

const rect = canvas.getBoundingClientRect();
const x = e.touches[0].clientX - rect.left;
const y = e.touches[0].clientY - rect.top;

handleClick(x,y);

});

// 🎯 Spawn loop
setInterval(spawnSprite,1000);

// 🎯 Timer
setInterval(()=>{

if(!gameRunning) return;

timeLeft--;
timeEl.textContent = timeLeft;

if(timeLeft <= 0){
gameRunning = false;
bgm.pause();
alert("Game Over! Score: " + score);
}

},1000);

// 🚀 INIT
initObstacles();
loop();