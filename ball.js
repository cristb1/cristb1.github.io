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

function setup() {
  createCanvas(400, 400);
  background(100);
  speedButton = createButton("submit");
  inputSpeed = createInput();
  speedButton.mousePressed(changeSpeed);
  
  pauseButton = createButton("pause");
  pauseButton.mousePressed(pause)
  
  resumeButton = createButton("resume");
  resumeButton.mousePressed(resume);

}

function draw() {
  circle(x,y,rad);
  
  x += xSpeed;
  y += ySpeed;
  if(xSpeed != 0){
    xSpeedOld = xSpeed;
    ySpeedOld = ySpeed;
  }
  
  if(x < rad || x > width - rad){
    xSpeed = -xSpeed;
  }
  
  if(y < rad || y > height - rad){
    ySpeed = -ySpeed;
  }
}

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