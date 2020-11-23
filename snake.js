//get canvas elements
const snakeboard = document.getElementById("board");

//return 2d drawing context
const snakeboardContext = snakeboard.getContext("2d");

//colours
const boardBorder = "black";
const boardBackground = "white";
const snakeColour = "lightblue";
const snakeBorder = "darkblue";
const foodColour = "lightgreen";
const foodBorder = "darkgreen";

//snake array
let snake = [{x: 200, y: 200}, {x: 190, y: 200}, {x: 180, y: 200}, {x: 170, y: 200}, {x: 160, y: 200},];

//x and y velocities
let vx = 10;
let vy = 0;

//user's score
let score = 0;

//x and y coordinates of food
let food_x;
let food_y;

//run the game
main();

//generate a food
genFood();

//listen for key presses
document.addEventListener("keydown", changeDirection);


function main(){

  //check if the user has lost
  if (hasGameEnded()) reset();

  //run ontick every 100 milliseconds
  setTimeout(function onTick(){

    //clear the canvas
    clearCanvas();

    //move the snake
    moveSnake();

    //draw the snake
    drawSnake();

    //draw the food
    drawFood();

    //rerun the main function
    main();
  }, 100)
}

//reset the snake and score
function reset(){
  vx = 10;
  vy = 0;
  score = 0;
  document.getElementById("score").innerHTML = score;
  snake = [{x: 200, y: 200}, {x: 190, y: 200}, {x: 180, y: 200}, {x: 170, y: 200}, {x: 160, y: 200},];
}

//draw a snake part (draw an element in the snake array)
function drawSnakePart(snakePart){
  snakeboardContext.fillStyle = snakeColour;
  snakeboardContext.strokeStyle = snakeBorder;
  snakeboardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeboardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

//draw each part of the snake (draw each element in the snake array)
function drawSnake(){
  snake.forEach(drawSnakePart);
}

//clear the canvas
function clearCanvas(){
  snakeboardContext.fillStyle = boardBackground;
  snakeboardContext.strokeStyle = boardBorder;
  snakeboardContext.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboardContext.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}


//move the snake -> increase the front and remove the back of the snake
function moveSnake(){

  //increase the head by the vertical and horizontal velocity
  const head = {x: snake[0].x + vx, y: snake[0].y + vy};

  //insert the head at the front of the snake array
  snake.unshift(head);

  //check if the snake has eaten the food
  const hasEatenFood = snake[0].x === food_x && snake[0].y === food_y;

  //if the user has eaten the food
  if (hasEatenFood){

    //inceate the score
    score += 10;

    //output the new score to the HTML
    document.getElementById("score").innerHTML = score;

    //generate a new food
    genFood();
  } else {

    //remove the end of the snake
    snake.pop();
  }
}

//change the direction of the snake
function changeDirection(){

  //key codes
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  //get the current keycode
  const keyPressed = event.keyCode;

  //check where the snake is currently moving
  const up = vy === -10;
  const down = vy === 10;
  const right = vx === 10;
  const left = vx === -10;

  //if the user presses the left key and the snake isn't moving right (to prevent the snake from moving in the opposite direction)
  if (keyPressed === LEFT_KEY && !right){
    vx = -10; //change the x velocity
    vy = 0; //change the y velocity
  } else if (keyPressed === RIGHT_KEY && !left){
    vx = 10;
    vy = 0;
  } else if (keyPressed === UP_KEY && !down){
    vy = -10;
    vx = 0;
  } else if (keyPressed === DOWN_KEY && !up){
    vy = 10;
    vx = 0;
  }
}

//check if the game has ended
function hasGameEnded(){

  //check if the snake collides with itself
  for (let i = 4; i < snake.length; i++){
    const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hasCollided) return true;
  }


  //check if the snake hits the border of the canvas
  const hitLeft = snake[0].x < 0;
  const hitRight = snake[0].x > snakeboard.width - 10;
  const hitTop = snake[0].y < 0;
  const hitBottom = snake[0].y > snakeboard.height - 10;

  return hitLeft || hitRight || hitTop || hitBottom
}

//create a random number between two numbers
function randomFood(min, max){
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

//generate a food
function genFood(){

  //generate a random x coordinate within the canvas bounds
  food_x = randomFood(0, snakeboard.width-10);
  food_y = randomFood(0, snakeboard.height-10);

  //check if the snake has eaten the food
  const hasEaten = snake[0].x === food_x && snake[0].y === food_y;

  //if the snake has eaten the food, generate a new food
  if (hasEaten) genFood();

}

//draw food on the canvas
function drawFood(){
  snakeboardContext.fillStyle = foodColour;
  snakeboardContext.strokeStyle = foodBorder;
  snakeboardContext.fillRect(food_x, food_y, 10, 10);
  snakeboardContext.strokeRect(food_x, food_y, 10, 10);
}
