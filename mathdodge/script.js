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
iq: 5
};

let blocks = [];

let score = 0;
let facing = 1; // 1 = kanan, -1 = kiri
let gameOver = false;
let activeGoal = goalsList[Math.floor(Math.random()*goalsList.length)];


/* ================= SPAWN BLOCK ================= */

function spawnBlock(){

let op = ops[Math.floor(Math.random()*ops.length)];

blocks.push({
x: Math.random()*(canvas.width-30),
y: -30,
width: 28,
height: 28,
op: op,
speed: 0.9 + score * 0.015,
hit:false
});

}

/* ================= APPLY OPERATION ================= */

function applyOperation(op){

let val = player.iq;

if(op === "+1") val += 1;
if(op === "+2") val += 2;
if(op === "-1") val -= 1;
if(op === "-2") val -= 2;

player.iq = val;

document.getElementById("iq").textContent = val;

checkGoals();
}

/* ================= GOAL CHECK ================= */

function checkGoals(){

if(!activeGoal.check(player.iq)){
gameOver = true;
}

}

function updateGoalUI(){

document.getElementById("rules").textContent =
"Goal: " + activeGoal.text;

}

setInterval(()=>{

if(gameOver) return;

activeGoal = goalsList[Math.floor(Math.random()*goalsList.length)];

updateGoalUI();

},8000);


updateGoalUI();
/* ================= PLAYER CONTROL ================= */

let moveLeft = false;
let moveRight = false;

let lastDirection = 1;
let dashCooldown = false;

function dash(){

if(dashCooldown) return;

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
block.y += block.speed;
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

blocks.splice(i,1); // hapus block

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

/* game over */

if(gameOver){

ctx.fillStyle="red";
ctx.font="28px Arial";
ctx.fillText("GAME OVER",110,250);

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

if(e.code === "Space") dash();

});

document.addEventListener("keyup",e=>{

if(e.key === "ArrowLeft") moveLeft = false;
if(e.key === "ArrowRight") moveRight = false;

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

/* ================= SCORE / SPAWN ================= */

setInterval(()=>{

if(gameOver) return;

score++;

document.getElementById("score").textContent = score;

spawnBlock();

},700);