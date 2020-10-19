var video, data;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let poseNet;
let poses = [];
const poseArray = [];
const newobj = [];
const pontArr = [];
const arrState = [];
var bgroud = [];
var posees = [];
let leftArm, legS, nose, lball, rball, smSkirt;
let LWXint = 0; let lWYint = 0; let lEXint = 0; let lEYint = 0; let rWXint = 0; let rWYint = 0; let rEXint = 0; let rEYint = 0;
let lSXint = 0; let lSYint = 0; let rSXint = 0; let rSYint = 0; let lHXint = 0; let lHYint = 0; let rHXint = 0; let rHYint = 0;
let lKXint = 0; let lKYint = 0; let rKXint = 0; let rKYint = 0; let lAXint = 0; let lAYint = 0; let rAXint = 0; let rAYint = 0;
let nOXint = 0; let nOYint = 0;
let lEaXint = 0; let lEaYint = 0; let rEaXint = 0; let rEaYint = 0;
let lunafxone, lunafxtwo, lunafxthree, lunaimg, bgx, psx;
let musicrest, musictrans, bang;
let startplaying = false;
let bgplaying = false;
let start = false;
let stepone = false;
let steponeplay = false;
let steptwo = false;
let steptwoplay = false;
let stepthree = false;
let stepthreeplay = false;
let skirtplay = false;
var startcount = 0;

function preload(){
   //all the overlays
  leftArm = loadImage('images/outfit/arm.png');
  smTop = loadImage('images/outfit/top.png');
  legS = loadImage('images/outfit/leg.png');
  nose = loadImage('images/hair/cresent.png');
  lball = loadImage('images/hair/leftball.png');
  rball = loadImage('images/hair/rightball.png');
  //taking cat
  lunafxone = loadSound('sound/step1.mp3');
  lunafxtwo = loadSound('sound/step2.mp3');
  lunafxthree = loadSound('sound/step3.mp3');
  lunaimg = createVideo('images/luna/lunatest.webm');
  lunaimg.addClass('helper-cat');
  //sound FX & music
  musicrest = loadSound('sound/bgmusic.mp3');
  musictrans = loadSound('sound/tf_main.mp3');
  bang = loadSound('sound/whip.mp3');

  data = loadJSON('poselist.json');
}


function setup() { // important video things
  pixelDensity(1);
  const canvas = createCanvas(window.innerWidth, window.innerWidth*.75);
  canvas.parent('videoContainer');
  video = createCapture(VIDEO);
  video.size(width, height);
   video.hide();

 // bground
  bgroud = [createVideo('images/bakground/city.webm') , createVideo('images/bakground/Loop_1.webm'), createVideo('images/bakground/Loop_2.webm'), createVideo('images/bakground/Loop_3.webm') ];
  bgx = 0;

  smSkirt = createVideo('images/outfit/skirttest.webm');
  let mainOptions = {
    flipHorizontal: true,
    architecture: 'MobileNetV1',
    inputResolution: 513,
    outputStride: 16,
    multiplier: 1.01,
    decodingMethod: 'single-person',
    imageScaleFactor: 0.3,
    minConfidence: 0.9,
    maxPoseDetections: 1,
    }
  poseNet = ml5.poseNet(video, mainOptions, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });

}

function draw() {
    background(255,255,255);
    image(bgroud[bgx], 0, 0, width,height);

    push();
    scale(-1.0,1.0);
  image(video, -width, 0, width, height);
    pop();

  //drawKeypoints();
  greenScreen();
  checkResults();
  if(startcount == 4){
    classify();
  }
  

// drawCresent();
// drawHairBalls();
// drawHands();
// drawBody();
// drawSkirt();
// drawFeet();
}

function toggleBG() {
  bgroud[bgx].loop();
  bgplaying = false;
}

function skitplay(){
  smSkirt.play();
  skirtplay = false;
}

function starter(){
  startcount++;
  if(startcount == 1){
    jQuery('.intro-wrap img').attr("src", "/images/tutorial/tutor1.gif");
    jQuery('.intro-wrap h1').html('Step back so you see your whole body on the screen.');
  }
  if(startcount == 2){
    jQuery('.intro-wrap img').attr("src", "/images/tutorial/tutor2.gif");
    jQuery('.intro-wrap h1').html('To see the animated backgrounds stand in front of a white wall');
  }
  if(startcount == 3){
    jQuery('.intro-wrap img').attr("src", "/images/tutorial/tutor3.gif");
    jQuery('.intro-wrap h1').html('Match the poses that appear on the right to transform.');
  }
  if(startcount == 4){
    jQuery('.intro-text').css("display" , "none");
  }
}


function checkResults(){
updateBG();
if(stepone ){
    bgx= 1;
    musicrest.pause();
    drawHands();
    drawHairBalls();

      if( jQuery('.pose-overlay').hasClass('posetwo') ){}else{
      jQuery('.pose-overlay').removeClass('.poseon');
      jQuery('.pose-overlay').addClass('posetwo');
      lunafxtwo.play();
      lunaimg.loop();
      lunafxtwo.onended(pauseLuna);
      bang.play();
      musictrans.loop();

    }
    if(!steponeplay){
       toggleBG();
      steponeplay = true;
    } 
  }
  if(stepone && steptwo){
    bgx=2;
    drawFeet();
    drawSkirt();
      if( jQuery('.pose-overlay').hasClass('posethree') ){}else{
      jQuery('.pose-overlay').removeClass('.posetwo');
      jQuery('.pose-overlay').addClass('posethree');
      lunafxthree.play();
      lunaimg.loop();
      lunafxthree.onended(pauseLuna);
      bang.play();
      musictrans.setVolume(0.6);
    }
  if(!steptwoplay){
       toggleBG();
      steptwoplay = true;
    } 
    
  }
  if(stepone && steptwo && stepthree){
    bgx = 3;
    drawBody();
    drawCresent();
    if( jQuery('.pose-overlay').hasClass('posefinal') ){}else{
      jQuery('.pose-overlay').removeClass('.posethree');
      jQuery('.helper-cat').addClass('finalplayer');
      jQuery('.pose-overlay').addClass('posefinal');
      bang.play();
      musictrans.setVolume(0.8);
    }
    if(!stepthreeplay){
       toggleBG();
      stepthreeplay = true;
    }
  }
  if(!stepone && !steptwo && !stepthree){
    if( !musicrest.isPlaying() ){ 
    musicrest.loop();
    musicrest.setVolume(0.4);
    }
  }
   
}

function updateBG(){
  if(start){
    if( jQuery('.helper-cat').hasClass('player') ){}else{
      jQuery('.helper-cat').addClass('player');
      lunafxone.play();
      lunaimg.loop();
      lunafxone.onended(pauseLuna);

      if( jQuery('.pose-overlay').hasClass('poseon') ){}else{
      jQuery('.pose-overlay').addClass('poseon');
    }
    }
    if(!bgplaying){
       toggleBG();
      bgplaying = true;
    } 
   
  }else{
    bgx = 0;
    lunafxone.stop();
    lunaimg.removeClass('player');
    jQuery('.pose-overlay').removeClass('poseon');
    jQuery('.pose-overlay').removeClass('posetwo');
    jQuery('.pose-overlay').removeClass('posethree');
    jQuery('.helper-cat').removeClass('finalplayer');
    musictrans.setVolume(0.4);
    musictrans.stop();
    lunaimg.pause();
    if(jQuery('.pose-overlay').hasClass('posefinal') ){
      jQuery('.pose-overlay').removeClass('posefinal') 
    }
  }
}
function pauseLuna(){
  lunaimg.pause();
  //jQuery('.helper-cat').removeClass('player')
  
}


function modelReady(){
  $('.loading').hide();
  let loadarry = Object.entries(data);
  for(i = 0; i < loadarry.length; i++){
    if( i % 2 == 0){
        pontArr.push(loadarry[i][1]);
    }else{
        arrState.push(loadarry[i][1]);
    } 
  }
  for(m = 0; m < pontArr.length; m++){
    knnClassifier.addExample(pontArr[m], arrState[m]);
  }
  musicrest.setVolume(0.4);
  musictrans.setVolume(0.4);


}



function classify() {
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.log('what you doing???');
    return;
  }
if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
const poseArray = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);
  knnClassifier.classify(poseArray, gotResults);
  start = true;
    }else{
    //console.log("Help Me!!");
    start = false;
    stepone = false;
    steptwo = false;
    stepthree = false;
  }
}



function gotResults(err, result) {
  if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
  if (err) {
    console.error(err);
  }
  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    if (result.label) {
      if(result.label == "Step 1"){
        stepone = true;
      }
      if(result.label == "Step 2" && stepone){
        steptwo = true;
      }
      if(result.label == "Step 3" && stepone && steptwo){
        stepthree = true;
      }
    } 
  }
}
}



function drawKeypoints()  {
  if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}


function adjustForAngle(hypot, angel){
  var adjust = hypot * ( Math.sin(angel ) );
  return adjust / 75;
}

function drawHands(){
     if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {

          var lWX = pose.keypoints[9].position.x;
         LWXint = lerp(LWXint, lWX, 0.085);
        var lWY = pose.keypoints[9].position.y;
         lWYint = lerp(lWYint, lWY, 0.085);
        var lEX = poses[0].pose.keypoints[7].position.x;
         lEXint = lerp(lEXint, lEX, 0.085);
        var lEY = poses[0].pose.keypoints[7].position.y;
         lEYint = lerp(lEYint, lEY, 0.085);
        var rWX = poses[0].pose.keypoints[10].position.x;
         rWXint = lerp(rWXint, rWX, 0.085);
        var rWY = poses[0].pose.keypoints[10].position.y;
         rWYint = lerp(rWYint, rWY, 0.085);
        var rEX = poses[0].pose.keypoints[8].position.x;
         rEXint = lerp(rEXint, rEX, 0.085);
        var rEY = poses[0].pose.keypoints[8].position.y;
         rEYint = lerp(rEYint, rEY, 0.085);

      var leftWrist = createVector(LWXint, lWYint);
      var leftElbo = createVector(lEXint, lEYint);
      var rightWrist = createVector(rWXint, rWYint);
      var rightElbo = createVector(rEXint, rEYint);

      angleMode(DEGREES);
        //left arm
        if(leftElbo){
        push();
        translate(leftElbo.x, leftElbo.y);
        let fixedand = createVector(leftWrist.x - leftElbo.x, leftWrist.y - leftElbo.y);
        rotate(Math.round(fixedand.heading()) - 90);
        //tint(255, 0);
        image(leftArm, 0 - ((leftWrist.dist(leftElbo)+30) * 0.4)/2, 0, (leftWrist.dist(leftElbo)+30) * 0.4 , leftWrist.dist(leftElbo)+30);
        pop();
}
        if(rightElbo){
        //right arm
        push();
        translate(rightElbo.x, rightElbo.y);
        let fixedandO = createVector(rightWrist.x - rightElbo.x, rightWrist.y - rightElbo.y);
        rotate(Math.round(fixedandO.heading()) - 90);
        //tint(255, 0);
        image(leftArm, 0 - ((leftWrist.dist(leftElbo)+30) * 0.4)/2, 0, (leftWrist.dist(leftElbo)+30) * 0.4 , leftWrist.dist(leftElbo)+30);
        pop();
}
      }
  }
}
}

function drawCresent(){
  if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {
        var nOX = poses[0].pose.keypoints[0].position.x;
         nOXint = lerp(nOXint, nOX, 0.085);
        var nOY = poses[0].pose.keypoints[0].position.y;
         nOYint = lerp(nOYint, nOY, 0.085);
         var lEaX = poses[0].pose.keypoints[3].position.x;
         lEaXint = lerp(lEaXint, lEaX, 0.085);
        var lEaY = poses[0].pose.keypoints[3].position.y;
         lEaYint = lerp(lEaYint, lEaY, 0.085);
        var rEaX = poses[0].pose.keypoints[4].position.x;
         rEaXint = lerp(rEaXint, rEaX, 0.085);
        var rEaY = poses[0].pose.keypoints[4].position.y;
         rEaYint = lerp(rEaYint, rEaY, 0.085);
    
        var leftEar = createVector(lEaXint, lEaYint);
        var rightEar = createVector(rEaXint, rEaYint);
        var disRatio = rightEar.dist(leftEar);

         var noooose = createVector(nOXint, nOYint);


         
         angleMode(DEGREES);

         console.log(); 
         if(noooose){
          push();
          translate(rightEar.x, rightEar.y);
          let fixedangel = createVector(rightEar.x - leftEar.x, rightEar.y - leftEar.y);
          let fixednose = createVector(noooose.x - rightEar.x, noooose.y - rightEar.y );
          var newadjust = adjustForAngle( fixednose.y - disRatio * .7, Math.round(fixedangel.heading()) - 180);
          rotate(Math.round(fixedangel.heading()) - 180);
          //tint(255, 0);
          image(nose, fixednose.x - (disRatio * 0.25 / 2) , fixednose.y - (disRatio * .7),  disRatio * 0.25, disRatio * 0.25);
          pop();
         }
       }
     }
  }
}

function drawHairBalls(){
  if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {
        var lEaX = poses[0].pose.keypoints[3].position.x;
         lEaXint = lerp(lEaXint, lEaX, 0.085);
        var lEaY = poses[0].pose.keypoints[3].position.y;
         lEaYint = lerp(lEaYint, lEaY, 0.085);
        var rEaX = poses[0].pose.keypoints[4].position.x;
         rEaXint = lerp(rEaXint, rEaX, 0.085);
        var rEaY = poses[0].pose.keypoints[4].position.y;
         rEaYint = lerp(rEaYint, rEaY, 0.085);
         
         var leftEar = createVector(lEaXint, lEaYint);
         var rightEar = createVector(rEaXint, rEaYint);

         var disRatio = rightEar.dist(leftEar);
         angleMode(DEGREES);
        push();
        translate(leftEar.x, leftEar.y);
        let fixedlEar = createVector(leftEar.x - rightEar.x, leftEar.y - rightEar.y);
        rotate(Math.round(fixedlEar.heading()) );
        //tint(255, 0);
        image(lball, 0 - disRatio * 0.1, 0 - disRatio * 0.9, (disRatio * .337)*5, disRatio * 5);
        pop();

        push();
        translate(rightEar.x, rightEar.y);
        let fixedrEar = createVector(rightEar.x - leftEar.x, rightEar.y - leftEar.y);
        rotate(Math.round(fixedrEar.heading()) - 180 );
        //tint(255, 0);
        image(rball, disRatio * 0.1 -(disRatio * .293)*5, 0 - disRatio * 0.9, (disRatio * .293)*5, disRatio * 5);
        pop();
         
       }
     }
  }

}

function drawFeet(){

    if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {

    var lKX = poses[0].pose.keypoints[13].position.x;
         lKXint = lerp(lKXint, lKX, 0.085);
        var lKY = poses[0].pose.keypoints[13].position.y;
         lKYint = lerp(lKYint, lKY, 0.085);
        var rKX = poses[0].pose.keypoints[14].position.x;
         rKXint = lerp(rKXint, rKX, 0.085); 
        var rKY = poses[0].pose.keypoints[14].position.y;
         rKYint = lerp(rKYint, rKY, 0.085);
        var lAX = poses[0].pose.keypoints[15].position.x;
         lAXint = lerp(lAXint, lAX, 0.085);
        var lAY = poses[0].pose.keypoints[15].position.y;
         lAYint = lerp(lAYint, lAY, 0.085);
        var rAX = poses[0].pose.keypoints[16].position.x;
         rAXint = lerp(rAXint, rAX, 0.085);
        var rAY = poses[0].pose.keypoints[16].position.y;
         rAYint = lerp(rAYint, rAY, 0.085);

      var leftKnee = createVector(lKXint, lKYint);
      var rightKnee = createVector(rKXint, rKYint);
      var leftAnkle = createVector(lAXint, lAYint);
      var rightAnkle = createVector(rAXint, rAYint);

      angleMode(DEGREES);

        if(leftKnee){
        //left Leg
        push();
        translate(leftKnee.x, leftKnee.y);
        let fixedknee = createVector(leftAnkle.x - leftKnee.x, leftAnkle.y - leftKnee.y);
        rotate(Math.round(fixedknee.heading()) - 90);
        //tint(255, 0);
        image(legS, 0 - (leftKnee.dist(leftAnkle) *.442)/2,0, leftKnee.dist(leftAnkle) *.442, leftKnee.dist(leftAnkle) );
        pop();
}
        if(rightKnee){
        //right Leg
        push();
        translate(rightKnee.x, rightKnee.y);
        let fixedkneeO = createVector(rightAnkle.x - rightKnee.x, rightAnkle.y - rightKnee.y);
        rotate(Math.round(fixedkneeO.heading()) - 90);
        //tint(255, 0);
        image(legS, 0 - (rightKnee.dist(rightAnkle) *.442)/2,0, rightKnee.dist(rightAnkle) *.442, rightKnee.dist(rightAnkle) );
        pop();
}
    }
    }
}
}

function drawBody(){
    if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {


        var lSX = poses[0].pose.keypoints[5].position.x;
         lSXint = lerp(lSXint, lSX, 0.085);
        var lSY = poses[0].pose.keypoints[5].position.y;
         lSYint = lerp(lSYint, lSY, 0.085);
        var rSX = poses[0].pose.keypoints[6].position.x;
         rSXint = lerp(rSXint, rSX, 0.085);
        var rSY = poses[0].pose.keypoints[6].position.y;
         rSYint = lerp(rSYint, rSY, 0.085);
        var lHX = poses[0].pose.keypoints[11].position.x;
         lHXint = lerp(lHXint, lHX, 0.085);
        var lHY = poses[0].pose.keypoints[11].position.y;
         lHYint = lerp(lHYint, lHY, 0.085);
        var rHX = poses[0].pose.keypoints[12].position.x;
         rHXint = lerp(rHXint, rHX, 0.085);
        var rHY = poses[0].pose.keypoints[12].position.y;
         rHYint = lerp(rHYint, rHY, 0.085);

      var leftSholder = createVector(lSXint, lSYint);
      var rightSholder = createVector(rSXint, rSYint);
      var leftHip = createVector(lHXint, lHYint);
      var rightHip = createVector(rHXint, rHYint);
       
       angleMode(DEGREES);

        if(rightSholder){
        push();
        translate(rightSholder.x, rightSholder.y);
        let fixedBody = createVector(leftSholder.x - rightSholder.x, leftSholder.y - rightSholder.y);
        rotate( Math.round( fixedBody.heading()) );
        //tint(255, 0);
        image(smTop, -(rightSholder.dist(leftSholder))*.25, -(rightSholder.dist(leftSholder) *.681)*.35, rightSholder.dist(leftSholder) + rightSholder.dist(leftSholder) *.5, (rightSholder.dist(leftSholder) + rightSholder.dist(leftSholder) *.5) *.681  );
        pop();

    }
    }
}}
}


function drawSkirt(){
   if(poses.length > 0 && poses[0].pose.keypoints[0].position.x > width * 0.25 && poses[0].pose.keypoints[0].position.x < width * 0.75){
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {

        var lHX = poses[0].pose.keypoints[11].position.x;
         lHXint = lerp(lHXint, lHX, 0.085);
        var lHY = poses[0].pose.keypoints[11].position.y;
         lHYint = lerp(lHYint, lHY, 0.085);
        var rHX = poses[0].pose.keypoints[12].position.x;
         rHXint = lerp(rHXint, rHX, 0.085);
        var rHY = poses[0].pose.keypoints[12].position.y;
         rHYint = lerp(rHYint, rHY, 0.085);

         var leftHip = createVector(lHXint, lHYint);
         var rightHip = createVector(rHXint, rHYint);

         var disRatio = leftHip.dist(rightHip); 
 
         angleMode(DEGREES);
         if(leftHip){
        push();
        translate(rightHip.x, rightHip.y);
        let fixedHip = createVector(rightHip.x - leftHip.x, rightHip.y - leftHip.y);
        rotate( Math.round( fixedHip.heading()) - 180); 
        //tint(255, 0);       
        image(smSkirt, 0 - ((disRatio * 3) * .33) , 0 - disRatio * 0.7 , disRatio * 3 , (disRatio * 0.529) * 3  );
        pop();

         if(!skirtplay){
          skitplay();
          skirtplay = true;
          } 

          }
      }
    }
  }
}




function greenScreen(){
  video.loadPixels();
  for (var y = 0; y < height ; y++) {
    for (var x = 0; x < width; x++) {
      var index = (x + y * width)*4;
      
    if( pixels[index+0] >= 150 && pixels[index+1] >= 150 && pixels[index+2] >= 150){
        pixels[index+0] = 0;
        pixels[index+1] = 0;
        pixels[index+2] = 0;
        pixels[index+3] = 0;
      }     
    }
  }
  video.updatePixels();
}




