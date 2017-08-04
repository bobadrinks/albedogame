/**
 * Name: joswei
 * File name: 2d.js
 * Description: Draws map and Sprite; controls gameplay.
 * 
 * Sources of Help: 
 * Draw a Gradient - https://developer.mozilla.org/en-US/docs/Web/API/
 *   CanvasRenderingContext2D/createLinearGradient
 * Basic HTML Game Tutorial - https://developer.mozilla.org/en-US/docs/
 *   Games/Tutorials/2D_Breakout_game_pure_JavaScript
 */

/* 
 * Context Object wraps everything nicely; includes func to initialize
 * canvas.
 */
var Context = {
  canvas: null,
  context: null,
  create: function(canvas_tag_id) {
    this.canvas = document.getElementById(canvas_tag_id);
    this.context = this.canvas.getContext("2d");
    return this.context;
  }
};

// Main functionality here
$(document).ready(function() {

    /* "canvas" string - we get Element by ID from the html file */
    Context.create("canvas"); 

    /* Draws background */
    function drawBackground() {
      /* Draw dark blue gradient background */
      var gradient = Context.context.createLinearGradient(0, 0, 300, 0);
      gradient.addColorStop(0, "#19198c");
      gradient.addColorStop(1, "#00004c");
      //gradient.addColorStop(0, "black");
      //gradient.addColorStop(1, "white");
      Context.context.beginPath();
      Context.context.fillStyle = gradient;
      Context.context.fillRect(0, 0, 750, 600);
      Context.context.closePath();
    }

    /* Penguin's starting position */
    var xPadding = 60;
    var yPadding = 150;
    var xPos = canvas.width / 2 - xPadding;
    var yPos = canvas.height / 2 + yPadding;

    /* Bools to check if left/right/spacebar are pressed */
    var rightPressed = false;
    var leftPressed = false;
    /* Is the game paused? */
    var paused = false;

    /* Padding for text */
    var horizPadding = 10;
    var vertPadding = 30;
    
    /* Keeps track of score */
    var score = 0;
    var scoreXPos = 8;
    var scoreYPos = 20;

    /* Time elapsed */
    var timeElapsed = 0;
    var timeXPos = canvas.width - 200;
    var timeYPos = 20;

    /* Variables for ice */
    var iceWidth = 100;
    var iceHeight = 100;
    var iceXPos = 130;
    var iceYPos = 30;

    /* Penguin dimensions */
    var penguinWidth = 130;
    var penguinHeight = 130;

    /* Function draws ice on screen, either white, */
    function drawIce() {
    }

    // loops
    function draw() {
      if (paused) {
        drawPause();
        return;
      }
      drawBackground();

      var cleanIceImg = new Image(iceWidth, iceHeight); 
      cleanIceImg.src = "assets/cleanIce.png";
      Context.context.drawImage(cleanIceImg, iceXPos, iceYPos, 
          iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos - iceWidth, iceYPos, 
          iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos, iceYPos + iceHeight, 
          iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos - iceWidth, iceYPos +
          iceHeight, iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + iceWidth, iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos, iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (2 * iceWidth), iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (3 * iceWidth), iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (4 * iceWidth), iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (4 * iceWidth), iceYPos +
          (3 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (5 * iceWidth), iceYPos +
          (1 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (5 * iceWidth), iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(cleanIceImg, iceXPos + (5 * iceWidth), iceYPos +
          (3 * iceHeight), iceWidth, iceHeight);

      var dirtyIceImg = new Image(iceWidth, iceHeight); 
      dirtyIceImg.src = "assets/dirtyIce.png";
      Context.context.drawImage(dirtyIceImg, iceXPos + iceWidth, iceYPos,
          iceWidth, iceHeight);
      Context.context.drawImage(dirtyIceImg, iceXPos + iceWidth, iceYPos +
          iceHeight, iceWidth, iceHeight);
      Context.context.drawImage(dirtyIceImg, iceXPos - iceWidth, iceYPos +
          (2 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(dirtyIceImg, iceXPos + iceWidth, iceYPos +
          (3 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(dirtyIceImg, iceXPos + iceWidth, iceYPos +
          (4 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(dirtyIceImg, iceXPos + (2 * iceWidth), iceYPos +
          (4 * iceHeight), iceWidth, iceHeight);

      var snowIceImg = new Image(iceWidth, iceHeight);
      snowIceImg.src = "assets/snowIce.png";
      Context.context.drawImage(snowIceImg, iceXPos + (2 * iceWidth), iceYPos,
          iceWidth, iceHeight);
      Context.context.drawImage(snowIceImg, iceXPos + (2 * iceWidth), iceYPos +
          iceHeight, iceWidth, iceHeight);
      Context.context.drawImage(snowIceImg, iceXPos - iceWidth, iceYPos +
          (3 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(snowIceImg, iceXPos, iceYPos +
          (3 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(snowIceImg, iceXPos - iceWidth, iceYPos +
          (4 * iceHeight), iceWidth, iceHeight);
      Context.context.drawImage(snowIceImg, iceXPos, iceYPos +
          (4 * iceHeight), iceWidth, iceHeight);

      var penguinImg = new Image(penguinWidth, penguinHeight); 
      penguinImg.src = "assets/penguin.png";
      Context.context.drawImage(penguinImg, xPos, yPos, 
          penguinWidth, penguinHeight);

      drawScore();
      drawTimeElapsed();
      collisionDetection();
      
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
      if (e.keyCode == '39') {
        rightPressed = true;
      } else if (e.keyCode == '37') {
        leftPressed = true;
      }
    }

    function keyUpHandler(e) {
      if (e.keyCode == '39') {
        rightPressed = false;
        xPos += iceWidth;
      } else if (e.keyCode == '37') {
        leftPressed = false;
        xPos -= iceWidth;
      } else if (e.keyCode == '32') {
        paused = !paused;
      }
    }

    /*
     * Draw Paused Message
     */
    function drawPause() {
      Context.context.font = "30px Arial";
      Context.context.fillStyle = "#FF0000";
      Context.context.fillText("GAME PAUSED", 
          canvas.width / 3, canvas.height / 4);
      Context.context.font = "16px Arial";
      Context.context.fillText("Press Spacebar to Resume",
          canvas.width / 3 + horizPadding, canvas.height / 4 + vertPadding);
    }

    /* Function for collision detection that will loop through bricks and
     * compare each brick's pos with ball's pos
     */
    function collisionDetection() {
    }

    // Function to keep track of and draw lives
    function drawTimeElapsed() {
      Context.context.font = "16px Arial";
      /* White text */
      Context.context.fillStyle = "#FFFFFF";
      Context.context.fillText("Time Elapsed: " + timeElapsed,
          timeXPos, timeYPos);
    }

    // Function to create and update score display
    function drawScore() {
      Context.context.font = "16px Arial";
      /* White text */
      Context.context.fillStyle = "#FFFFFF";
      Context.context.fillText("Score: " + score, scoreXPos, scoreYPos);
    }

    setInterval(draw, 10);

});
