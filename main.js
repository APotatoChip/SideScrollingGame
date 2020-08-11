const gameArea = document.querySelector(".game-area");
const gameStart = document.querySelector(".game-start");
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector(".game-score");
const gamePoints = gameScore.querySelector(".points");

gameStart.addEventListener("click", onGameStart);

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

let keys = {};

let scene = {
    score: 0,
    lastCloudSpawn: 0,
    lastBugSpawn: 0,
    isActiveGame: true
};

let player = {
    x: 150,
    y: 100,
    width: 0,
    height: 0,
    lastTimeFiredFireball: 0,

};

let game = {
    speed: 2,
    movingMultiplier: 4,
    fireBallMultiplier: 5,
    fireInterval: 300,
    cloudSpawnInterval: 3000,
    bugSpawnInterval: 1000,
    bugKillBonus:1

};

function gameAction(timestamp) {

    const wizard = document.querySelector(".wizard");

    let isInAir = (player.y + player.height) <= gameArea.offsetHeight;

    

    if (keys.Space && timestamp - player.lastTimeFiredFireball > game.fireInterval) {
        wizard.classList.add("wizard-fire");
        addFireBall(player);
        player.lastTimeFiredFireball = timestamp;
        
    } else {
        wizard.classList.remove("wizard-fire");
    }

    let fireBalls = document.querySelectorAll(".fire-ball");
    fireBalls.forEach(fireBall => {
        fireBall.x += game.speed * game.fireBallMultiplier;
        fireBall.style.left = fireBall.x + "px";

        if (fireBall.x + fireBall.offsetWidth > gameArea.offsetWidth) {
            fireBall.parentElement.removeChild(fireBall);
        }
    });



    if (timestamp - scene.lastCloudSpawn > game.cloudSpawnInterval + 20000 * Math.random()) {
        let cloud = document.createElement("div");
        cloud.classList.add("cloud");
        cloud.x = gameArea.offsetWidth - 200;
        cloud.style.left = cloud.x + "px";
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + "px";
        gameArea.appendChild(cloud);
        scene.lastCloudSpawn = timestamp;
    }

    let clouds = document.querySelectorAll(".cloud");
    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + "px";
        if (cloud.x + clouds.offsetWidth <= 0) {
            cloud.parentElement.removeChild(cloud);
        }
    });

    if (timestamp - scene.lastBugSpawn > game.bugSpawnInterval + 5000 * Math.random()) {
        let bug = document.createElement("div");
        bug.classList.add("bug");
        bug.x = gameArea.offsetWidth - 60;
        bug.style.left = bug.x + "px";
        bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + "px";
        gameArea.appendChild(bug);
        scene.lastBugSpawn = timestamp;
    }

    let bugs = document.querySelectorAll(".bug");
    bugs.forEach(bug => {
        bug.x -= game.speed * 3;
        bug.style.left = bug.x + "px";
        if (bug.x + bugs.offsetWidth <= 0) {
            bug.parentElement.removeChild(bug);
        }
    });

    if (isInAir) {
        player.y += game.speed;
    }
    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier;
    }
    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowRight && player.x + player.width < gameArea.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }
    wizard.style.top = player.y + "px";
    wizard.style.left = player.x + "px";

    bugs.forEach(bug => {
        if (isCollision(wizard, bug)) {
           gameOverAction();
        }
        fireBalls.forEach(fireBall=>{
            if(isCollision(fireBall,bug)){
                scene.score+=game.bugKillBonus;
                bug.parentElement.removeChild(bug);
                fireBall.parentElement.removeChild(fireBall);
            }
        })
    });
    gamePoints.textContent = scene.score;
    if(scene.isActiveGame){
        window.requestAnimationFrame(gameAction);
    }
   
}

function onGameStart() {
    gameStart.classList.add('hide');

    const wizard = document.createElement("div");
    wizard.classList.add("wizard");
    wizard.style.top = player.y + "px";
    wizard.style.left = player.x + "px";
    gameArea.appendChild(wizard);

    player.width = wizard.offsetWidth;
    player.height = wizard.offsetHeight;
    window.requestAnimationFrame(gameAction);

   
}

function gameOverAction() {
    scene.isActiveGame = false;
    gameOver.classList.remove("hide");
}

function addFireBall() {
    let fireball = document.createElement("div");
    fireball.classList.add("fire-ball");
    fireball.style.top = (player.y + player.height / 3 - 5) + "px";
    fireball.x = player.x + player.width;
    fireball.style.left = fireball.x + "px";

    gameArea.appendChild(fireball);


}

function onKeyDown(e) {
    keys[e.code] = true;
    console.log(keys);
}

function onKeyUp(e) {
    keys[e.code] = false;
    console.log(keys);
}



function isCollision(firstElement, secondElement) {
    let firstRec = firstElement.getBoundingClientRect();
    let secondRec = secondElement.getBoundingClientRect();

    return !(firstRec.top > secondRec.bottom ||
        firstRec.bottom < secondRec.top ||
        firstRec.right < secondRec.left ||
        firstRec.left > secondRec.right);
}