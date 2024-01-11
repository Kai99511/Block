//HTMLの取得

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//キャンバスサイズ
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

//ボールの定義
const ballRadious = 10;//ボールの輪郭
let ballColor = "#0095DD"

//パドルの定義
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

//ブロックの定義
const blockRecCount = 3;
const blockColCount = 5;
const blockWidth = 75;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 30;

//スコア
let score = 0;

//ライフ
let life = 3;

//ブロックの定義
const block = [];
for (let c = 0; c < blockColCount; c++) {
    block[c] = [];
    for (let r = 0; r < blockRecCount; r++) {
        block[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//ボールの移動描画　メイン
function draw() {
    //関数
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlock();
    drawBall();
    drawPaddle();
    collision();
    drawScore();
    drawLife();

    //X軸で壁にぶつかったら跳ね返る
    if (x + dx > canvas.width - ballRadious || x + dx < ballRadious) { //||論理和(または,or)
        dx = -dx;
        changeColor();
    }

    //ボールとパドルの衝突判定
    if (y + dy < ballRadious) {
        dy = -dy;
        changeColor();
    } else if (y + dy > canvas.height - ballRadious) {
        if (x > paddleX && x < paddleX + paddleWidth) { //&&論理積(かつ,AND)
            dy = -dy;
        }
        else {
            life--;
            if (!life) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }

        }
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

//衝突判定
function collision() {
    for (let c = 0; c < blockColCount; c++) {
        for (let r = 0; r < blockRecCount; r++) {
            const b = block[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&               //ボールの x 座標がブロックの x 座標より大きいかつ
                    x < b.x + blockWidth &&  //ボールの x 座標がブロックの x 座標とその幅の和より小さいかつ
                    y > b.y &&               //ボールの y 座標がブロックの y 座標より大きいかつ
                    y < b.y + blockHeight    //ボールの y 座標がブロックの y 座標とその高さの和より小さい
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === blockRecCount * blockColCount) {
                        alert("YOU WIN!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

//ボールの描画
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadious, 0, Math.PI * 2);
    ctx.fillStyle = ballColor
    ctx.fill();
    ctx.closePath();
}
//パドル※操作ボード
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle ="red";
    ctx.fill();
    ctx.closePath();
}

//ブロックの描画
function drawBlock() {
    for (let c = 0; c < blockColCount; c++) {
        for (let r = 0; r < blockRecCount; r++) {
            if (block[c][r].status === 1) {
                const blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
                const blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
                block[c][r].x = blockX;
                block[c][r].y = blockY;
                //ブロックの色
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//スコアの描画
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

//ライフの描画
function drawLife() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Life: ${life}`, canvas.width - 65, 20);
}

//ボールの色を変える関数
function changeColor() {
    ballColor = randomColor();
}

//ランダムな色生成する
function randomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

 //キーボード操作
 function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

//マウス操作
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();
