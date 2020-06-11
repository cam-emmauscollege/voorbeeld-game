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

var spelStatus = UITLEG;
var score = 0;
var aantalLevens = 3;

var plaatje;
var stopwatchSec = 0;
var stopwatchMin = 0;

const SPEELVELDBREEDTE = 1280;
const SPEELVELDHOOGTE = 720;
const SPEELVELDRANDBREEDTE = 20;
const SPELERDIAMETER = 80;

const AANTALVIJANDEN = 10;
const VIJANDDIAMETER = 40;
var KOGELSNELHEID = 16;
var kogelDiameter = 10;

var spelerX = 600; // x-positie van speler
var spelerY = 650; // y-positie van speler
var spelerXSnelheid = 8;
var spelerYSnelheid = 6;



var kogelsX = [];   // x-positie van kogel
var kogelsY = [];   // y-positie van kogel
/*
OUD:
var isKogelZichtbaar = false;
var kogelX = 30;    // x-positie van kogel
var kogelY = 30;    // y-positie van kogel
*/


var vijandenX = [];
var vijandenY = [];
var vijandenSnelheid = [];
var vijandPlaatje;

/*
OUD:
var vijandX = 100;          // x-positie van vijand
var vijandY = -50;          // y-positie van vijand
var vijandXSnelheid = 3;    // horizontale snelheid van vijand
var vijandYSnelheid = -2;  // verticale snelheid van vijand
*/


var score = 0; // aantal behaalde punten


function preload() {
     vijandPlaatje = loadImage('plaatjes/space-invader.png');
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
        image(vijandPlaatje, vijandenX[i], vijandenY[i]);
        //rect(vijandenX[i], vijandenY[i], VIJANDDIAMETER, VIJANDDIAMETER);
    }
    
    //image(vijandImage, x, y);
};


function verwijderKogel(nummer) {
    console.log("verwijder kogel " + nummer);
    kogelsX.splice(nummer, 1);
    kogelsY.splice(nummer, 1)
}


/**
 * Tekent de kogels
 */
var tekenKogels = function() {
    // ga alle posities van de kogels langs
    // voordeel: als er geen posities (en dus kogels) zijn
    // wordt er ook niets getekend.

    for (var i = 0; i < kogelsX.length; i++) {
        fill(255, 255, 255);
        ellipse(kogelsX[i], kogelsY[i], kogelDiameter, kogelDiameter);
    }
};


/**
 * Tekent de speler
 * @param {number} x x-coördinaat
 * @param {number} y y-coördinaat
 */
var tekenSpeler = function(x, y) {
  //image(spelerPlaatje, x, y, 150, 100);
  
  noStroke();
  fill(255, 255, 255);

  
  //body van de tank
  ellipse(x, y, SPELERDIAMETER, SPELERDIAMETER);

  //loop van de tank
  rect(x-5, y - 70, 10, 70);
};


function tekenTimer() {
    var extraNul = "";
    if (stopwatchSec < 10) {
        extraNul = "0";
    }

    var timerString = stopwatchMin + " : " + extraNul + stopwatchSec;

    textSize(12);
    text(timerString , 50, 50, 50, 50);
}

function tekenScore() {
    textSize(24);
    text(""+score , width-100, 50, 150, 100);
}

/**
 * Updatet globale variabelen met positie van vijand of tegenspeler
 */
var beweegVijand = function() {
    for (var i = 0; i < vijandenX.length; i++) {
        vijandenY[i] = vijandenY[i] + vijandenSnelheid[i];

        if (vijandenY[i] > SPEELVELDHOOGTE + VIJANDDIAMETER) {
            verwijderVijand(i);
            maakNieuweVijand();
        }
    }
};


/**
 * Updatet globale variabelen met positie van kogel of bal
 */
var beweegKogel = function() {
    for (var i = 0; i < kogelsX.length; i++) {
        // y waarde updaten: kogel moet stukje verder omhoog
        kogelsY[i] = kogelsY[i] - KOGELSNELHEID;

        // als kogel aan bovenkant uit beeld is
        // (d.w.z. als de kogel meer dan de helft van z'n
        // diameter boven de bovenkant is),
        // dan coordinaten uit arrays halen
        if (kogelsY[i] < 0 - kogelDiameter / 2) {
            verwijderKogel(i);

            // omdat we een element uit de array hebben gehaald
            // klopt teller i niet meer (we zouden er nu een overslaan)
            // dus dat corrigeren we:
            i = i - 1;
        }
    }
};


/**
 * Kijkt wat de toetsen/muis etc zijn.
 * Updatet globale variabele spelerX en spelerY
 */
var beweegSpeler = function() {
    // krijg de x-coordinaat van de muis
    var muisXPositie = mouseX;

    // Bereken de uiterst toegestane posites en zet ze in een variabele
    var maxX = width - SPELERDIAMETER / 2 - SPEELVELDRANDBREEDTE;
    var minX = SPELERDIAMETER / 2 + SPEELVELDRANDBREEDTE;

    // als uitersten overschreven worden, dan terugzetten op de grens
    if (muisXPositie > maxX) {
        muisXPositie = maxX;
    }
    else if(muisXPositie < minX) {
        muisXPositie = minX;
    }
    spelerX = muisXPositie;
};


/**
 * Zoekt uit of de vijand is geraakt
 * @returns {boolean} true als vijand is geraakt
 */
var checkVijandGeraakt = function(vijandNummer) {
    var teruggeefWaarde = false;

    // ga voor deze vijand iedere kogel langs
    for (var j = 0; j < kogelsX.length; j++) {
        if (collideCircleCircle(kogelsX[j], kogelsY[j], kogelDiameter,
                                vijandenX[vijandNummer], vijandenY[vijandNummer], VIJANDDIAMETER)) {
            teruggeefWaarde = true;
            
            // verwijder de kogel in kwestie
            verwijderKogel(j);

            // schrijf boodschap in de console, handig bij het testen van de game
            console.log("Vijand " + vijandNummer + " geraakt door kogel " + j);
        }
    }

    return teruggeefWaarde;
};

function verwijderVijand(nummer) {
    console.log("verwijder vijand " + nummer);
    vijandenX.splice(nummer, 1);
    vijandenY.splice(nummer, 1)
    vijandenSnelheid.splice(nummer, 1);
}


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
  var teruggeefWaarde = false;
  if (aantalLevens === 0) {
      teruggeefWaarde = true;
  }
    
  return teruggeefWaarde;
};

function updateTimer() {
    stopwatchSec++;

    if (stopwatchSec == 60) {
        stopwatchMin++;
        stopwatchSec = 0;
    }
}


function maakNieuweVijand() {
    vijandenX.push(random(20, SPEELVELDBREEDTE - 20));
    vijandenY.push(random(-250, -30));
    vijandenSnelheid.push(random(2, 10));
}


function mouseClicked() {
    console.log("mouse clicked");
    // voeg nieuwe kogel toe door nieuwe
    // x- en y-waarden in arrays te zetten:

    kogelsX.push(spelerX);
    kogelsY.push(spelerY - 70);

    console.log(kogelsX);
    console.log(kogelsY);
}


/**
 * setup
 * de code in deze functie wordt één keer uitgevoerd door
 * de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
  // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
  createCanvas(SPEELVELDBREEDTE, SPEELVELDHOOGTE);

  for (var i = 0; i < AANTALVIJANDEN; i++) {
      maakNieuweVijand();
  }

  setInterval(updateTimer, 100);

  console.log(vijandenX);
  console.log(vijandenY);
  console.log(vijandenSnelheid);
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
    // spelstatus is 1, 2 of 3

    if (spelStatus === 1) {
        // dit is het uitlegscherm
        // teken hier alles wat daarvoor nodig is

        // stel ik druk de spatiebalk in (in spelstatus 1), dan maak ik van spelstatus 2
    }




    else if (spelStatus === 2) {
        // dit is de game, teken de game etc.
    }

    else if (spelStatus === 3) {
        // hier teken ik het gameover scherm
    }
 





























  switch (spelStatus) {
    case UITLEG:
      var mijnVar = 0;
      background(0, 0, 255);
      fill(255, 255, 255);
      textSize(24);
      text("Druk op de spatiebalk om te starten", 200, 200, 500, 50);

      if (keyIsPressed === true && key === " ") {
          console.log("pressed space");
          spelStatus = SPELEN;
          aantalLevens = 3;
          score = 0;
      }
    break;
    case SPELEN:
      beweegVijand();
      beweegKogel();
      beweegSpeler();
      
      // check voor iedere vijand of een kogel 'm raakt: 
      for (var i = 0; i < vijandenX.length; i++) {
        if (checkVijandGeraakt(i)) {
            // punten erbij
            score++;

            if (score % 10 === 0) {
                kogelDiameter = 40;
            }
            else {
                kogelDiameter = 10;
            }

            // nieuwe vijand maken
            verwijderVijand(i);
            maakNieuweVijand();
        }
      }

      if (checkSpelerGeraakt()) {
        aantalLevens--;
        // leven eraf of gezondheid verlagen
        // eventueel: nieuwe speler maken
      }



      tekenVeld();
      tekenVijanden();
      tekenKogels();
      tekenSpeler(spelerX, spelerY);
      tekenTimer();
      tekenScore();

      if (checkGameOver()) {
        spelStatus = GAMEOVER;
      }
      break;
      case GAMEOVER:
          // hier komt het GAMEOVER scherm

      break;
  }
}
