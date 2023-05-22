let c = document.getElementById('main');
let ctx = c.getContext('2d');

let start = document.getElementById('start_btn');
start.addEventListener('click', startGame);

let timerID = null;

//player initilization
let p1_x = 50;
let p1_y = 850/2 - 170/2;
let p2_x = 1630;
let p2_y = 850/2 - 170/2;
let p1_score = 0;
let p2_score = 0;

//target initialization
let t_x = 0;
let t_y = 0;
let l = 14;
let direction_flag = 0;
let imp_p1 = 0;
let imp_p2 = 0;

//initial angle range in radians
let a = 1700/2;
let b = 850/2;
let theta = Math.acos(1-(850**2/(2*(a**2 + b**2))));  //law of cosines
let angle = 0;
let dx = 0;
let dy = 0;

moveGoalie(p1_x, p1_y);
moveGoalie(p2_x, p2_y);

function startGame() {
    //initial throw angle and direction
    if(direction_flag == 0){
        angle = theta*(Math.random()-0.5);
    }else{
        angle = Math.PI + theta*(Math.random()-0.5);
    }

    dx = 180*Math.cos(angle)/Math.PI; // x increment
    dy = 180*Math.sin(angle)/Math.PI; // y increment

    //initial target coordinates
    t_x = a-l/2;
    t_y = b-l/2;

    if (timerID == null) {
        timerID = setInterval(moveTarget, 30);
    }
}

function middleLine(){ //draws the middle dashed line
    let x = 1700/2 - 5;
    let y = 0;

    for(let i = 0; i < 20; i++){
        ctx.beginPath();
        ctx.rect(x,y,10,40);
        ctx.fill();
        y += 80;
    }
}

function moveGoalie(x, y) { //player paddle dimensions at x and y coordinates
    ctx.beginPath(); //paddle characteristics
    ctx.fillStyle = 'white';
    ctx.rect(x, y, 20, 170);
    ctx.fill();
}

function moveTarget() { //player movement
    ctx.clearRect(70,0,1560,850);
    middleLine();
    updateScore();
    ctx.beginPath(); //ball characteristics
    ctx.fillStyle = 'white';
    ctx.rect(t_x, t_y, l, l);
    ctx.fill();

    //x and y increments according to the angle
    if(t_y + dy > 850 || t_y + dy < 0){ // vertical bounces
        dy = -dy;
    }

    if(t_x + dx > 1660){
        if(t_y < p2_y || t_y > p2_y + 170){ //player 2 miss
            p1_score += 1
            direction_flag = 1;
            alert('Player 1 scored!');
            startGame();
        }
        else{ //player 2 catch
            dx = -dx*1.05;
            if(imp_p2 == 1){ //catch with upwards impulse
                dy -= dy*1.5;
            }
            else if(imp_p2 == -1){ //catch with downwards impulse
                dy += dy*1.5;
            }
            else{
                dy = dy;
            }
        }
    }
    else if(t_x + dx < 30){ //player 1 miss
        if(t_y < p1_y || t_y > p1_y + 170){
            p2_score += 1
            direction_flag = 0;
            alert('Player 2 scored!');
            startGame();
        }
        else{ //player 1 catch
            dx = -dx*1.05;
            if(imp_p1 == 1){ //catch with upwards impulse
                dy -= dy*1.5;
            }
            else if(imp_p1 == -1){ //catch with downwards impulse
                dy += dy*1.5;
            }
            else{
                dy = dy;
            }
        }
    }

    //normal movement 
    t_x += dx/4;
    t_y += dy/4;
}

function updateScore(){ //displays score on canvas
    ctx.font = '100px PressStart';
    ctx.fillStyle = 'white';
    ctx.fillText(p1_score.toString(), 425, 213);
    ctx.fillText(p2_score.toString(), 1275, 213);
}

document.onkeydown = function (e) { //player controls
    switch (e.key.toUpperCase()) {
        case "W": // p1 UP
            if(p1_y > 0){
                ctx.clearRect(0,0,70,850);
                p1_y -= 20;
                imp_p1 = 1; //set player impulse up
                moveGoalie(p1_x, p1_y);
            }
            break;
        case "S": // p1 DOWN
            if(p1_y < 850 - 170){
                ctx.clearRect(0,0,70,850);
                p1_y += 20;
                imp_p1 = -1; //set player impulse down
                moveGoalie(p1_x, p1_y);
            }
            break;
        case "ARROWUP": // p2 UP
            if(p2_y > 0){
                ctx.clearRect(1630,0,70,850);
                p2_y -= 20;
                imp_p2 = 1; //set player impulse up
                moveGoalie(p2_x, p2_y);
            }
            break;
        case "ARROWDOWN": //p2 DOWN
            if(p2_y < 850 - 170){
                ctx.clearRect(1630,0,70,850);
                p2_y += 20;
                imp_p2 = -1; //set player impulse down
                moveGoalie(p2_x, p2_y);
            }
            break;
    }
};