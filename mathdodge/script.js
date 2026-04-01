const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

const playerImg = new Image();
playerImg.src = "sprite.png";

let player = {
x: 180,
y: 420,
width: 30,
height: 30,
speed: 4,
iq: 0
};

let goalFlash = {
active: false,
alpha: 0,
scale: 1.5
};

const sfx = {
pickup: new Audio("pickup.wav"),
goal: new Audio("goal.wav"),
dash: new Audio("dash.wav")
};

sfx.pickup.volume = 0.4;
sfx.goal.volume = 0.5;
sfx.dash.volume = 0.4;

function playSound(sound){
if(!audioUnlocked) return;
sound.currentTime = 0;
sound.play().catch(()=>{});
}

let blocks = [];

let score = 0;
let facing = 1;
let gameOver = false;

/* ================= GOAL SYSTEM ================= */

let goal = 0;
let currentSum = 0;
let goalTimer = 10;

function newGoal(){

do {
  goal = Math.floor(Math.random() * 21) - 10;
} while (goal === 0);

currentSum = 0;
goalTimer = 10;

player.iq = 0;

document.getElementById("goal").textContent = goal;
document.getElementById("goalText").textContent = goal;
document.getElementById("timer").textContent = goalTimer;
document.getElementById("iq").textContent = player.iq;

goalFlash.active = true;
goalFlash.alpha = 1;
goalFlash.scale = 1.8;

}

setInterval(()=>{

if(gameOver) return;

goalTimer--;

if(goalTimer <= 0){
goalTimer = 0;
gameOver = true;
}

document.getElementById("timer").textContent = goalTimer;

},1000);

newGoal();

/* ================= SPAWN BLOCK ================= */

function spawnBlock(){

let op = ops[Math.floor(Math.random()*ops.length)];

blocks.push({
x: Math.random()*(canvas.width-30),
y: -30,
width: 28,
height: 28,
op: op,
speed: 2 + Math.sqrt(score) * 0.3,
hit:false
});

}

/* ================= APPLY OPERATION ================= */

function applyOperation(op){

let val = 0;

if(op === "+1") val = 1;
if(op === "+2") val = 2;
if(op === "+3") val = 3;
if(op === "-1") val = -1;
if(op === "-2") val = -2;
if(op === "-3") val = -3;

currentSum += val;

player.iq = currentSum;

document.getElementById("iq").textContent = currentSum;

/* check goal */

if(currentSum === goal){
	
playSound(sfx.goal);

score++;
document.getElementById("score").textContent = score;

newGoal();

}
}

/* ================= PLAYER CONTROL ================= */

let moveLeft = false;
let moveRight = false;
let fastDrop = false;

let lastDirection = 1;
let dashCooldown = false;

function dash(){

if(dashCooldown) return;

playSound(sfx.dash);

dashCooldown = true;

player.x += lastDirection * 70;

setTimeout(()=>{
dashCooldown = false;
},400);

}

/* ================= UPDATE ================= */

function update(){

if(gameOver) return;

/* movement */

if(moveLeft){
player.x -= player.speed;
lastDirection = -1;
facing = -1;
}

if(moveRight){
player.x += player.speed;
lastDirection = 1;
facing= 1;
}

/* keep inside canvas */

if(player.x < 0) player.x = 0;

if(player.x + player.width > canvas.width){
player.x = canvas.width - player.width;
}

/* block movement */

blocks.forEach(block=>{

if(fastDrop){
block.y += block.speed * 4;
}else{
block.y += block.speed;
}

});

blocks = blocks.filter(b=>b.y < canvas.height+50);

/* collision */

for (let i = blocks.length - 1; i >= 0; i--) {

let block = blocks[i];

if(
player.x < block.x + block.width &&
player.x + player.width > block.x &&
player.y < block.y + block.height &&
player.y + player.height > block.y
){

applyOperation(block.op);
playSound(sfx.pickup);

blocks.splice(i,1);

}

}

if(goalFlash.active){
goalFlash.alpha -= 0.03;   // fade speed
goalFlash.scale -= 0.01;   // shrink effect

if(goalFlash.alpha <= 0){
goalFlash.active = false;
}
}

}

/* ================= DRAW ================= */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.save();

if(facing === 1){
ctx.scale(-1,1);
ctx.drawImage(
playerImg,
-player.x - player.width,
player.y,
player.width,
player.height
);
}else{
ctx.drawImage(
playerImg,
player.x,
player.y,
player.width,
player.height
);
}

ctx.restore();

/* blocks */

blocks.forEach(block=>{

ctx.fillStyle = "#020617";
ctx.fillRect(block.x, block.y, block.width, block.height);

ctx.strokeStyle = "#6366f1";
ctx.strokeRect(block.x, block.y, block.width, block.height);

ctx.fillStyle = "white";
ctx.font = "14px Inter";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(
block.op,
block.x + block.width/2,
block.y + block.height/2
);

});
/* ================= DANGER OVERLAY ================= */

if(goalTimer <= 5){

let intensity = (5 - goalTimer) / 5; 
// 0 → normal, 1 → full merah

ctx.save();

ctx.fillStyle = `rgba(255, 0, 0, ${0.3 * intensity})`;
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.restore();
}


/* ================= HUD BOTTOM ================= */

let hudHeight = 40;

// background bar
ctx.fillStyle = "rgba(0,0,0,0.6)";
ctx.fillRect(0, canvas.height - hudHeight, canvas.width, hudHeight);

// text
ctx.fillStyle = "white";
ctx.font = "14px Inter";
ctx.textAlign = "center";

// posisi horizontal dibagi 4
let section = canvas.width / 4;

ctx.fillText("Time: " + goalTimer, section * 0.5, canvas.height - 15);
ctx.fillText("Goal: " + goal, section * 1.5, canvas.height - 15);
ctx.fillText("" + currentSum, section * 2.5, canvas.height - 15);
ctx.fillText("Score: " + score, section * 3.5, canvas.height - 15);

ctx.strokeStyle = "#6366f1";
ctx.beginPath();
ctx.moveTo(0, canvas.height - hudHeight);
ctx.lineTo(canvas.width, canvas.height - hudHeight);
ctx.stroke();

/* animasi goal */
if(goalFlash.active){

ctx.save();

ctx.globalAlpha = goalFlash.alpha;

ctx.fillStyle = "white";
ctx.font = `${80 * goalFlash.scale}px Inter`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.shadowColor = "blue";
ctx.shadowBlur = 20;

ctx.fillText(
goal,
canvas.width / 2,
canvas.height / 2
);

ctx.restore();
}


/* game over */

if(gameOver){

ctx.fillStyle="red";
ctx.font="28px Arial";
ctx.fillStyle = "red";
ctx.font = "28px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(
  "GAME OVER",
  canvas.width / 2,
  canvas.height / 2
);

}

}

/* ================= GAME LOOP ================= */

function loop(){

update();
draw();

requestAnimationFrame(loop);

}

loop();

/* ================= KEYBOARD ================= */

document.addEventListener("keydown",e=>{

if(e.key === "ArrowLeft") moveLeft = true;
if(e.key === "ArrowRight") moveRight = true;
if(e.key === "ArrowDown") fastDrop = true;

if(e.code === "Space") dash();

});

document.addEventListener("keyup",e=>{

if(e.key === "ArrowLeft") moveLeft = false;
if(e.key === "ArrowRight") moveRight = false;
if(e.key === "ArrowDown") fastDrop = false;

});

/* ================= MOBILE TOUCH ================= */

let lastTap = 0;

canvas.addEventListener("touchstart", e => {

let touchX = e.touches[0].clientX;
let mid = window.innerWidth/2;

if(touchX < mid){
player.x -= player.speed*3;
lastDirection = -1;
}
else{
player.x += player.speed*3;
lastDirection = 1;
}

});

canvas.addEventListener("touchend", () => {

let now = Date.now();

if(now - lastTap < 300){
dash();
}

lastTap = now;

});

canvas.addEventListener("touchstart", () => {
fastDrop = true;
});

canvas.addEventListener("touchend", () => {
fastDrop = false;
});

/* ================= SCORE / SPAWN ================= */

setInterval(()=>{

if(gameOver) return;

spawnBlock();

},350);

/* ================= MOBILE BUTTON CONTROLS ================= */

const leftBtn = document.getElementById("leftBtn");
const dashBtn = document.getElementById("dashBtn");
const rightBtn = document.getElementById("rightBtn");

leftBtn.addEventListener("touchstart", () => {
moveLeft = true;
});

leftBtn.addEventListener("touchend", () => {
moveLeft = false;
});

rightBtn.addEventListener("touchstart", () => {
moveRight = true;
});

rightBtn.addEventListener("touchend", () => {
moveRight = false;
});

dashBtn.addEventListener("touchstart", () => {
dash();
});

dashBtn.addEventListener("mousedown", () => {
dash();
});

dashBtn.addEventListener("touchend", (e) => {
e.preventDefault();
});

/* optional mouse */

leftBtn.addEventListener("mousedown", () => moveLeft = true);
leftBtn.addEventListener("mouseup", () => moveLeft = false);

rightBtn.addEventListener("mousedown", () => moveRight = true);
rightBtn.addEventListener("mouseup", () => moveRight = false);

/* bug ketika tekan down tidak scroll bawah*/
window.addEventListener("keydown", function(e) {
if(["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","Space"].includes(e.code)){
e.preventDefault();
}
}, false);

let audioUnlocked = false;

function unlockAudio(){
if(audioUnlocked) return;
audioUnlocked = true;

Object.values(sfx).forEach(s => {
s.play().then(() => {
s.pause();
s.currentTime = 0;
}).catch(()=>{});
});
}

/* trigger dari berbagai input */
document.addEventListener("keydown", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });
document.addEventListener("mousedown", unlockAudio, { once: true });

const rulesBtn = document.getElementById("rulesBtn");
const rulesModal = document.getElementById("rulesModal");

rulesBtn.addEventListener("click", () => {
rulesModal.style.display = "flex";
});

rulesModal.addEventListener("click", () => {
rulesModal.style.display = "none";
});

rulesBtn.addEventListener("click", () => {
rulesModal.style.display = "flex";
gameOver = true; // pause
});

rulesModal.addEventListener("click", () => {
rulesModal.style.display = "none";
gameOver = false;
});