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
    var iceXPos = 30;
    var iceYPos = 30;
    /* Constants for type of ice or water */
    var WATER = 0;
    var BARE_ICE = 1;
    var SNOW_ICE = 2;
    var DIRTY_ICE = 3;
    /* Number of rows and columns */
    var rows = 7;
    var cols = 7;

    /* Penguin dimensions */
    var penguinWidth = 90;
    var penguinHeight = 90;

    /* Directional arrowkey codes for KeyDown or KeyUp detection */
    var DOWN = 40;
    var RIGHT = 39;
    var UP = 38;
    var LEFT = 37;
    var SPACEBAR = 32;

    /* Ice */ 
    var ice = [];
    for (i = 0; i < cols; i++) {
      ice[i] = [];
      for (j = 0; j < rows; j++) {
        var randomNum = Math.random();
        var iceType = 0;
        /* At start, 0.1 chance of water appearing; increases with time */
        var firstCutoff = 0.1;
        /* Highest probability of bare ice appearing */
        var secondCutoff = 0.65;
        /* At start, 0.2 chance of snow ice */
        var thirdCutoff = 0.85;
        /* At start, 0.15 chance of dirty ice */
        if (randomNum <= firstCutoff) {
          iceType = WATER;
        } else if (randomNum > firstCutoff && randomNum <= secondCutoff) {
          iceType = BARE_ICE;
        } else if (randomNum > secondCutoff && randomNum <= thirdCutoff) {
          iceType = SNOW_ICE;
        } else {
          iceType = DIRTY_ICE;
        }
        ice[i][j] = {x: 0, y: 0, type: iceType};
      }
    }
        
    /* Function draws map on screen */
    function drawIce() {

      /* Create images for clean ice, dirty ice, and snow-covered ice */
      var cleanIceImg = new Image(iceWidth, iceHeight); 
      cleanIceImg.src = "assets/cleanIce.png";
      var dirtyIceImg = new Image(iceWidth, iceHeight); 
      dirtyIceImg.src = "assets/dirtyIce.png";
      var snowIceImg = new Image(iceWidth, iceHeight);
      snowIceImg.src = "assets/snowIce.png";

      /* Based on randomly generated 2d array, draw map */
      for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {

          /* Water, bare ice, snow-covered, or dirty ice */
          if (ice[i][j].type == WATER) {
            /* Draw nothing if this block is water */
            continue;
          } else if (ice[i][j].type == BARE_ICE) {
            /* Draw bare ice at correct (x, y) position on canvas */
            Context.context.drawImage(cleanIceImg, iceXPos + (i * iceWidth), 
                iceYPos + (j * iceHeight), iceWidth, iceHeight);
          } else if (ice[i][j].type == SNOW_ICE) {
            /* Draw snow-covered ice at correct (x, y) position on canvas */
            Context.context.drawImage(snowIceImg, iceXPos + (i * iceWidth), 
                iceYPos + (j * iceHeight), iceWidth, iceHeight);
          } else {
            /* Draw dirty ice at correct (x, y) position on canvas */
            Context.context.drawImage(dirtyIceImg, iceXPos + (i * iceWidth), 
                iceYPos + (j * iceHeight), iceWidth, iceHeight);
          }

        }
      }

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

    //document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    
    // TODO Do you even need a keyDownHandler at the moment?
/*
    function keyDownHandler(e) {
      if (e.keyCode == '39') {
        rightPressed = true;
      } else if (e.keyCode == '37') {
        leftPressed = true;
      }
    }
*/
    function keyUpHandler(e) {
      if (e.keyCode == DOWN) {
        yPos += iceHeight;
      } else if (e.keyCode == RIGHT) {
        xPos += iceWidth;
      } else if (e.keyCode == UP) {
        yPos -= iceHeight;
      } else if (e.keyCode == LEFT) {
        xPos -= iceWidth;
      } else if (e.keyCode == SPACEBAR) {
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

    /* Function for collision detection that will loop through ice blocks and
     * compare each block's position with penguin position; if collided, ice
     * block's type will change
     */
    function collisionDetection() {
      /* If penguin collides with BARE_ICE, change type to WATER */
      /* If penguin collides w/ SNOW_ICE, change type to BARE_ICE */
      /* If penguin collides w/ DIRTY_ICE, change type to BARE_ICE and
       * decrease health */
      /* If penguin collides with WATER, game over */
    }

    // Function to keep track of time elapsed
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

    /* Tells the draw() function to repeat */
    setInterval(draw, 10);

});
