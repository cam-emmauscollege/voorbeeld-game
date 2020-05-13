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

const UITLEG = 0;
const SPELEN = 1;
const GAMEOVER = 2;
var spelStatus = SPELEN;

const SPEELVELDBREEDTE = 1280;
const SPEELVELDHOOGTE = 720;
const SPEELVELDRANDBREEDTE = 20;
const SPELERDIAMETER = 80;
const VIJANDDIAMETER = 40;

var spelerX = 200; // x-positie van speler
var spelerY = 100; // y-positie van speler
var spelerXSnelheid = 8;
var spelerYSnelheid = 6;

var kogelX = 0;    // x-positie van kogel
var kogelY = 0;    // y-positie van kogel

var vijandX = 100;          // x-positie van vijand
var vijandY = 500;          // y-positie van vijand
var vijandXSnelheid = 3;    // horizontale snelheid van vijand
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
    rect(20, 20, width - 2 * 20, height - 2 * 20);
};


/**
 * Tekent de vijand
 * @param {number} x x-coördinaat
 * @param {number} y y-coördinaat
 */
var tekenVijand = function(x, y) {
    fill(255, 255, 0);
    ellipse(x, y, VIJANDDIAMETER, VIJANDDIAMETER);
    //image(vijandImage, x, y);
};


/**
 * Tekent de kogel of de bal
 * @param {number} x x-coördinaat
 * @param {number} y y-coördinaat
 */
var tekenKogel = function(x, y) {


};


/**
 * Tekent de speler
 * @param {number} x x-coördinaat
 * @param {number} y y-coördinaat
 */
var tekenSpeler = function(x, y) {
  fill("green");
  ellipse(x, y, SPELERDIAMETER, SPELERDIAMETER);
  rect(x, y, 1000, 10);
};


/**
 * Updatet globale variabelen met positie van vijand of tegenspeler
 */
var beweegVijand = function() {
    if (vijandY >= SPEELVELDHOOGTE - SPEELVELDRANDBREEDTE - 0.5*VIJANDDIAMETER  || vijandY <= SPEELVELDRANDBREEDTE + 0.5*VIJANDDIAMETER) {
        vijandYSnelheid = vijandYSnelheid * -1;
    }

    if (vijandX >= SPEELVELDBREEDTE - SPEELVELDRANDBREEDTE - 0.5*VIJANDDIAMETER || vijandX <= SPEELVELDRANDBREEDTE + 0.5*VIJANDDIAMETER) {
        vijandXSnelheid = vijandXSnelheid * -1;
    }

    vijandX = vijandX + vijandXSnelheid;
    vijandY = vijandY + vijandYSnelheid;
};


/**
 * Updatet globale variabelen met positie van kogel of bal
 */
var beweegKogel = function() {

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


/**
 * setup
 * de code in deze functie wordt één keer uitgevoerd door
 * de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
  // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
  createCanvas(SPEELVELDBREEDTE, SPEELVELDHOOGTE);
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
      tekenVijand(vijandX, vijandY);
      tekenKogel(kogelX, kogelY);
      tekenSpeler(spelerX, spelerY);

      if (checkGameOver()) {
        spelStatus = GAMEOVER;
      }
      break;
  }
}
