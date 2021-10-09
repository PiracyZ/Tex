var PLAY = 1;

var a = 0, b = 0, c = 0;

var END = 0;
var gameState = PLAY;
var restart, gameOver;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var coinsGroup, coinImage, coin, CoinS;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, coinsScore;

var Life_counter, Vida1, Vida2, Vida3, Heart;

var gameOverImg,restartImg;

var deathS, jumpS, ChackPointS;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  coinImage = loadImage("coin.png");
  
  deathS = loadSound("die.mp3");
  jumpS = loadSound("jump.mp3");
  CheckPointS = loadSound("checkPoint.mp3");
  CoinS = loadSound("CoinSound.mp3");
  
  Heart = loadImage("corazón.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  Vida1 = createSprite(500, 20);
  Vida1.addImage("vida1", Heart);
  Vida1.scale = 0.015;
  
  Vida2 = createSprite(530, 20);
  Vida2.addImage("vida1", Heart);
  Vida2.scale = 0.015;
  
  Vida3 = createSprite(560, 20);
  Vida3.addImage("vida1", Heart);
  Vida3.scale = 0.015;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  coinsGroup = createGroup();
  

  
  trex.setCollider("circle",0,0,40);
  
  Life_counter = 2;
  score = 0;
  coinsScore = 0;
  
}

function draw() {
  
  
  background(255);
  //displaying score
  text("Score: "+ score, 500,50);
  text("Coins collected: " + coinsScore, 10,30);

 
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = Math.round(score + 0.5);
    
     console.log(Life_counter);
    
    trex.changeAnimation("running", trex_running);
    
    if(score % 500 === 0&&score!=0){
      CheckPointS.play();
    }
    
    if(coinsGroup.isTouching(trex)){
      CoinS.play();
      coinsScore = coinsScore+1;
      coinsGroup.destroyEach();
    }
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -13;
        jumpS.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    spawnCoins();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        deathS.play();
    }
  }
   else if (gameState === END) {
     if(Life_counter===2){
       Vida3.visible = false;
     }
     if(Life_counter===1){
       Vida2.visible = false;
     }    
     if(Life_counter===0){
       Vida1.visible = false;
     }
     
     if(mousePressedOver(restart)&&Life_counter>0){
          restartfunction();
          Life_counter = Life_counter - 1;
      }
      

     
      gameOver.visible = true;
      restart.visible = true;
      
           
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     //coinsGroup.setLifetimeEach(-1);
     
     coinsGroup.setVelocityXEach(0);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnCoins(){
  if(frameCount % 140 === 0){
    coin = createSprite(700,160);
    coin.y = Math.round(random(120,160));
    coin.addImage(coinImage);
    coin.scale = 0.05;
    coin.velocityX = -6;
    coin.lifetime = 150;
    
    coinsGroup.add(coin);
  }
  
    
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(700,165,10,40);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(700,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function restartfunction(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinsGroup.destroyEach();
}
   
