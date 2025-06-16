 
// save this file as sketch.js
// Sketch One
var s = function( p ) { // p could be any variable name
    let x = 100;
    let y = 100;
    let rad = 20;
    let xSpeed = 15;
    let ySpeed = 15;
    let speedButton;
    let pauseButton;
    let resumeButton;
    let inputSpeed;
    let xSpeedOld;
    let ySpeedOld;
    let isPaused;

    p.setup = function() {
        p.createCanvas(400, 400);
        speedButton = p.createButton("submit");
        inputSpeed = p.createInput();
        speedButton.mousePressed(changeSpeed);
        
        pauseButton = p.createButton("pause");
        pauseButton.mousePressed(pause)
        
        resumeButton = p.createButton("resume");
        resumeButton.mousePressed(resume);
    
    };
  
    p.draw = function() {
      p.background(100);
      p.circle(x,y,rad);

      x += xSpeed;
      y += ySpeed;

      if(xSpeed != 0){
        xSpeedOld = xSpeed;
        ySpeedOld = ySpeed;
      }

      if(x < rad || x > p.width - rad){
        xSpeed = -xSpeed;
      }

      if(y < rad || y > p.height - rad){
        ySpeed = -ySpeed;
      }
    };

    function changeSpeed(){
      xSpeed = parseInt(inputSpeed.value());
      ySpeed = parseInt(inputSpeed.value());
      inputSpeed.value('');
    }

    function pause(){
      xSpeedOld = xSpeed;
      ySpeedOld = ySpeed;
      xSpeed = 0;
      ySpeed = 0;
    }

    function resume(){
      xSpeed = xSpeedOld;
      ySpeed = ySpeedOld;
    }
  };


  var plainBall = new p5(s, 'c1');
  
  // Sketch Two
  var t = function( p ) { 
    let xEllipse = 100; 
    let yEllipse = 100; 
    let xRect = 100;
    let yRect = 100;
    let widthEllipse = 50;
    let heightEllipse = 50;
    let widthRect = 10;
    let heightRect = 20;
    let speedEllipse = 2.5; 
    let speedRect = 5;
    p.setup = function() {
      p.createCanvas(400, 200);
    };
  
    p.draw = function() {
      p.background(200);
      xEllipse += speedEllipse;
      xRect += speedRect; 
      if(xEllipse > p.width+widthEllipse){
        xEllipse = -widthEllipse; 
      }
      if(xRect > p.width+widthRect){
        xRect = -widthRect;
      }
      p.fill(1);
      p.ellipse(xEllipse,yEllipse,widthEllipse, heightEllipse);
      p.fill(255)
      p.rect(xRect, yRect, widthRect, heightRect);

  
    };
  };
  var myp5 = new p5(t, 'c2');