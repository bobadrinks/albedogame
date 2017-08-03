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

/* Sprite object makes it easy to draw new images or patterns on your canvas */
var Sprite = function(filename, is_pattern) {
  
  // Construct the object
  this.image = null;
  this.pattern = null;
  this.TO_RADIANS = Math.PI/180;

  // Check to make sure filename is not undefined
  if (filename != undefined && filename != "" && filename != null) {
    this.image = new Image();
    this.image.src = filename;

    if (is_pattern) {
      this.pattern = Context.context.createPattern(this.image, 'repeat');
    }
  } else {
    console.log("Unable to load sprite.");
  }

  this.draw = function(x, y, w, h) {
    // Is this a Pattern?
    if (this.pattern != null) {
      Context.context.fillStyle = this.pattern;
      Context.context.fillRect(x, y, w, h);
    } else {
      // If not a Pattern, then this is an Image
      if (w != undefined || h != undefined) {
        Context.context.drawImage(this.image, x, y, 
                                  this.image.width,
                                  this.image.height);
      } else {
        // Stretched
        Context.context.drawImage(this.image, x, y, w, h);
      }
    }
  };

  this.rotate = function(x, y, angle) {
    // Save and restore state of our Context
    Context.context.save();
    Context.context.translate(x, y);
    Context.context.rotate(angle * this.TO_RADIANS);
    Context.context.drawImage(this.image, 
                            -(this.image.width/2),
                            -(this.image.height/2));
    Context.context.restore();
  };

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

    /* Image sources */
    var PENGUIN = "assets/penguin.png";
      //"https://raw.githubusercontent.com/joswei/albedogame/master/assets/penguin.png";

    /* Make a new Penguin Sprite */
    var penguinImg = new Sprite(PENGUIN, false);

    /* Penguin's starting position */
    var xPos = canvas.width / 2;
    var yPos = canvas.height / 2;

    /* Penguin Movement */
    var dx = 2;
    var dy = -2;

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
    var iceWidth = 150;
    var iceHeight = 200;

    /* Penguin dimensions */
    var penguinWidth = 150;
    var penguinHeight = 150;

    /* Coins */
    var coinImage = new Image();
    coinImage.src = "assets/coin-sprite-animation.png";

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
      
      penguinImg.draw(xPos, yPos, penguinWidth, penguinHeight);

      drawScore();
      drawTimeElapsed();
      collisionDetection();
      
      //xPos += dx;
      //yPos += dy;

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
      } else if (e.keyCode == '37') {
        leftPressed = false;
      } else if (e.keyCode == '32') {
        paused = !paused;
      }
    }

    /*
     * Draw Paused Message
     */
    function drawPause() {
      Context.context.font = "30px Arial";
      Context.context.fillStyle = "#FFFFFF";
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
