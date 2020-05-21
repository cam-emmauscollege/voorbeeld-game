/// @ts-check
/// <reference path=".gitpod/p5.global-mode.d.ts" />
"use strict";

/* Game opdracht
   Informatica - Emmauscollege Rotterdam
   Template voor een game in JavaScript met de p5 library

   Begin met dit template voor je game opdracht,
   voeg er je eigen code aan toe.
 */




/* ********************************************* */
/* globale variabelen die je gebruikt in je game */
/* ********************************************* */

const  UITLEG = 0;
const SPELEN = 1;
const GAMEOVER = 2;
var spelStatus = SPELEN;

var plaatje;

const SPEELVELDBREEDTE = 1280;
const SPEELVELDHOOGTE = 720;
const SPEELVELDRANDBREEDTE = 20;
const SPELERDIAMETER = 80;
const VIJANDDIAMETER = 40;

var spelerX = 200; // x-positie van speler
var spelerY = 100; // y-positie van speler
var spelerXSnelheid = 8;
var spelerYSnelheid = 6;

var isKogelZichtbaar = false;
var kogelX = 30;    // x-positie van kogel
var kogelY = 30;    // y-positie van kogel


var vijandenX = [];
var vijandenY = [];
var vijandenSnelheid = [];
//var vijandX = 100;          // x-positie van vijand
//var vijandY = -50;          // y-positie van vijand
//var vijandXSnelheid = 3;    // horizontale snelheid van vijand
var vijandYSnelheid = -2;  // verticale snelheid van vijand
var vijandImage;

var score = 0; // aantal behaalde punten


function preload() {
    vijandImage = loadImage('plaatjes/space-invader.png');
}



/* ********************************************* */
/*      functies die je gebruikt in je game      */
/* ********************************************* */


/**
 * Tekent het speelveld
 */
var tekenVeld = function () {
    background('blue');
    fill(0, 0, 0);
    
    //image(plaatje, 0, 0, SPEELVELDBREEDTE, SPEELVELDHOOGTE);
    rect(20, 20, width - 2 * 20, height - 2 * 20);
};


/**
 * Tekent de vijanden
 */
var tekenVijanden = function() {
    for (var i = 0; i < vijandenX.length; i++) {
        fill(255, 0, 0);
        //ellipse(vijandenX[i], vijandenY[i], VIJANDDIAMETER, VIJANDDIAMETER);
        rect(vijandenX[i], vijandenY[i], VIJANDDIAMETER, VIJANDDIAMETER);
    }
    
    //image(vijandImage, x, y);
};


/**
 * Tekent de kogel of de bal
 * @param {number} x x-coördinaat
 * @param {number} y y-coördinaat
 */
var tekenKogel = function(x, y) {
    if (isKogelZichtbaar === true) {
        fill(0, 255, 0);
        rect(x, y, 10, 10);
    }


};


/**
 * Tekent de speler
 * @param {number} x x-coördinaat
 * @param {number} y y-coördinaat
 */
var tekenSpeler = function(x, y) {
  noStroke();
  fill(255, 255, 255);

  //body van de tank
  ellipse(x, y, SPELERDIAMETER, SPELERDIAMETER);

  //loop van de tank
  rect(x, y-5, 70, 10);
};


/**
 * Updatet globale variabelen met positie van vijand of tegenspeler
 */
var beweegVijand = function() {
    for (var i = 0; i < vijandenX.length; i++) {
        vijandenY[i] = vijandenY[i] + vijandenSnelheid[i];

        if (vijandenY[i] > SPEELVELDHOOGTE + 20) {
            vijandenY[i] = random(-250, -30);
            vijandenX[i] = random(20, SPEELVELDBREEDTE - 20);
            vijandenSnelheid[i] = random(2, 10);
            
            /*
            console.log("nieuwe vijand positie voor nummer " + i);
            console.log(vijandenX[i]);
            console.log(vijandenY[i]);
            console.log(vijandenSnelheid[i]);
            */
        }
    }
    
    

    /*
    if (vijandY >= SPEELVELDHOOGTE - SPEELVELDRANDBREEDTE - 0.5*VIJANDDIAMETER  || vijandY <= SPEELVELDRANDBREEDTE + 0.5*VIJANDDIAMETER) {
        vijandYSnelheid = vijandYSnelheid * -1;
    }

    if (vijandX >= SPEELVELDBREEDTE - SPEELVELDRANDBREEDTE - 0.5*VIJANDDIAMETER || vijandX <= SPEELVELDRANDBREEDTE + 0.5*VIJANDDIAMETER) {
        vijandXSnelheid = vijandXSnelheid * -1;
    }

    vijandX = vijandX + vijandXSnelheid;
    vijandY = vijandY + vijandYSnelheid;*/
};


/**
 * Updatet globale variabelen met positie van kogel of bal
 */
var beweegKogel = function() {
    if (keyIsPressed === true) {
        if (key === " ") {
            kogelX = spelerX + 70;
            kogelY = spelerY;
            isKogelZichtbaar = true;
        }
    }

    if (isKogelZichtbaar === true) {
        kogelX = kogelX + 5;
    }
};


/**
 * Kijkt wat de toetsen/muis etc zijn.
 * Updatet globale variabele spelerX en spelerY
 */
var beweegSpeler = function() {
    if (keyIsPressed === true) {
       if (keyCode === RIGHT_ARROW) {
           spelerX = spelerX + 2;
        }
        else if (keyCode === LEFT_ARROW) {
            if (spelerX > SPELERDIAMETER / 2) {
                spelerX = spelerX - 2;
            }
            
        }
    }





    /*
    if (spelerY >= SPEELVELDHOOGTE - SPEELVELDRANDBREEDTE - 0.5*SPELERDIAMETER  || spelerY <= SPEELVELDRANDBREEDTE + 0.5*SPELERDIAMETER) {
        spelerYSnelheid = spelerYSnelheid * -1;
    }

    if (spelerX >= SPEELVELDBREEDTE - SPEELVELDRANDBREEDTE - 0.5*SPELERDIAMETER || spelerX <= SPEELVELDRANDBREEDTE + 0.5*SPELERDIAMETER) {
        spelerXSnelheid = spelerXSnelheid * -1;
    }

    spelerX = spelerX + spelerXSnelheid;
    spelerY = spelerY + spelerYSnelheid;*/

};


/**
 * Zoekt uit of de vijand is geraakt
 * @returns {boolean} true als vijand is geraakt
 */
var checkVijandGeraakt = function() {
    for (var i = 0; i < vijandenX.length; i++) {
        if (kogelX > vijandenX[i] && kogelX < vijandenX[i]+VIJANDDIAMETER &&
            kogelY > vijandenY[i] && kogelY < vijandenY[i]+VIJANDDIAMETER) {
                console.log("geraakt, vijand " + i);
            }
    }
    


  return false;
};


/**
 * Zoekt uit of de speler is geraakt
 * bijvoorbeeld door botsing met vijand
 * @returns {boolean} true als speler is geraakt
 */
var checkSpelerGeraakt = function() {
    
  return false;
};


/**
 * Zoekt uit of het spel is afgelopen
 * @returns {boolean} true als het spel is afgelopen
 */
var checkGameOver = function() {
    
  return false;
};


function preload() {
    // @ts-ignore
    plaatje = loadImage('plaatjes/space-invader.png');
}


/**
 * setup
 * de code in deze functie wordt één keer uitgevoerd door
 * de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
  // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
  createCanvas(SPEELVELDBREEDTE, SPEELVELDHOOGTE);

  for (var i = 0; i < 5; i++) {
      vijandenX.push(random(20, SPEELVELDBREEDTE - 20));
      vijandenY.push(random(-250, -30));
      vijandenSnelheid.push(random(2, 10));
  }

  console.log(vijandenX);
  console.log(vijandenSnelheid);
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  switch (spelStatus) {
    case SPELEN:
      beweegVijand();
      beweegKogel();
      beweegSpeler();
      
      if (checkVijandGeraakt()) {
        // punten erbij
        // nieuwe vijand maken
      }
      
      if (checkSpelerGeraakt()) {
        // leven eraf of gezondheid verlagen
        // eventueel: nieuwe speler maken
      }

      tekenVeld();
      tekenVijanden();
      tekenKogel(kogelX, kogelY);
      tekenSpeler(spelerX, spelerY);

      if (checkGameOver()) {
        spelStatus = GAMEOVER;
      }
      break;
  }
}
