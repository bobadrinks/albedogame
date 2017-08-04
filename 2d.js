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

var Sprite = function(filename, is_pattern) {

  /* Construct object */
  this.image = null;
  this.pattern = null;
  this.TO_RADIANS = Math.PI/180;

  /* Check to make sure filename is valid */
  if (filename != undefined && filename != "" && fileanme != null) {
    this.image = new Image();
    this.image.src = filename;

    if (is_pattern) {
      this.pattern = Context.context.createPattern(this.image, 'repeat');
    }
  } else {
    console.log("Unable to load sprite.");
  }

  this.draw = function(x, y, w, h) {
    /* Is this a pattern? */
    if (this.pattern != null) {
      Context.context.fillStyle = this.pattern;
      Context.context.fillRect(x, y, w, h);
    } else {
      /* Not a Pattern; is an Image */
      /* Did we specify width/height? */
      if (w != undefined || h != undefined) {
        Context.context.drawImage(this.image, x, y,
            this.image.width, this.image.height);
      } else {
        /* Stretched image */
        Context.context.drawImage(this.image, x, y, w, h);
      }
    }
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

    /* Rotate right function */
    function rotateRight(image) {
      element.className = "rotateRight";
    }

    /* Rotate left function */
    function rotateLeft(image) {
      element.className = "rotateLeft";
    }

    /* Return to normal function */
    function rotateNone(image) {
      element.className = "rotateNone";
    }

    /* Rotate to face downwards */
    function rotateDown(image) {
      element.className = "rotateDown";
    }

    /* Penguin's starting position */
    var xPadding = 40;
    var yPadding = 240;
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
    var penguinWidth = 90;
    var penguinHeight = 90;

    var ice = [];
    for (i = 0; i < rows; i++) {
      ice[i] = [];
      for (j = 0; j < cols; j++) {
        var randomNum = Math.random();
        if (randomNum <= 0.5) {
          type = WATER;
        } else if (randomNum > 0.5 && randomNum <= 0.7) {
          type = BARE_ICE;
        } else if (randomNum > 0.7 && randomNum <= 0.85) {
          type = SNOW_ICE;
        } else {
          type = DIRTY_ICE;
        }
        ice[i][j] = {x: 0, y: 0, iceType: type};
      }
    }
        
    /* Function draws ice on screen, either white, */
    function drawIce() {

      var cleanIceImg = new Image(iceWidth, iceHeight); 
      cleanIceImg.src = "assets/cleanIce.png";

      var dirtyIceImg = new Image(iceWidth, iceHeight); 
      dirtyIceImg.src = "assets/dirtyIce.png";

      var snowIceImg = new Image(iceWidth, iceHeight);
      snowIceImg.src = "assets/snowIce.png";

      // TODO Populate map with blocks of ice, randomly generated

      for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
          ;
        }
      }

      Context.context.drawImage(cleanIceImg, iceXPos, iceYPos - iceHeight, 
          iceWidth, iceHeight);

      Context.context.drawImage(dirtyIceImg, iceXPos + iceWidth, iceYPos,
          iceWidth, iceHeight);

      Context.context.drawImage(snowIceImg, iceXPos + (2 * iceWidth), iceYPos,
          iceWidth, iceHeight);
    }

    // loops
    function draw() {
      if (paused) {
        drawPause();
        return;
      }
      drawBackground();

      drawIce();

      var penguinImg = new Image(penguinWidth, penguinHeight); 
      penguinImg.src = "assets/penguin.png";
      Context.context.drawImage(penguinImg, xPos, yPos, penguinWidth,
          penguinHeight);

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
      if (e.keyCode == '40') {
        yPos += iceHeight;
      } else if (e.keyCode == '39') {
        xPos += iceWidth;
      } else if (e.keyCode == '38') {
        yPos -= iceHeight;
      } else if (e.keyCode == '37') {
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
      /* Red text */
      Context.context.fillStyle = "#FF0000";
      Context.context.fillText("Time Elapsed: " + timeElapsed,
          timeXPos, timeYPos);
    }

    // Function to create and update score display
    function drawScore() {
      Context.context.font = "16px Arial";
      /* Red text */
      Context.context.fillStyle = "#FF0000";
      Context.context.fillText("Score: " + score, scoreXPos, scoreYPos);
    }

    setInterval(draw, 10);

});
