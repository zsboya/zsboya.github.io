// Az aktuális időpont (h:m:s) bekérése.

let hours;
let  mins;
let  secs;

function getTime() {

    let date = new Date();
    
    hours = date.getHours();
     mins = date.getMinutes();
     secs = date.getSeconds();
}


// Az aktuális időegységek, mint végpontok kiinduló ponthoz (0) viszonyított szögének kiszámítása.

let hoursEndAngle;
let  minsEndAngle;
let  secsEndAngle;  // Az aktuális időegységekhez, mint végpontokhoz tartozó szögek (radiánban).

const hEnd = 24;  // De nem 12 órás AM/PM-módban, hanem 24h-s mmódban jelenítjük meg az órákat! 
const mEnd = 60;
const sEnd = 60;  // Az időegységek (h,m,s) maximumai.

const nullAngle  = 1.5 * Math.PI;  // Ez az óralapon a kinduló pont (0 = 12): 0h 0m 0s!
const fullCircle = 2.0 * Math.PI;  // Ez a teljes körív hossza radian-ban.

function endAnglesCompute() {  
     
    hoursEndAngle = fullCircle / hEnd * hours + nullAngle; 
     minsEndAngle = fullCircle / mEnd *  mins + nullAngle;  
     secsEndAngle = fullCircle / sEnd *  secs + nullAngle;  
} 


// A rajzoláshoz szükséges canvas (a használandó terület) és context változók deklarálása.

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

function previousStateClear() {

    ctx.clearRect( 0, 0, canvas.width, canvas.height );  
    // Törli a myCanvas téglalap helyét, vagyis az előző állapotot (az óraállásokat).
}


// Az időegység korongok eltelt és hátralévő idejének kirajzoltatása.

const color1 = `rgba( 255, 0, 0, 1 )`;
const color2 = `rgba( 255, 0, 0, 0.5 )`;

let colorArr = [color1, color2];  // Az eltelt (0.:c1) és a hátralévő (1.:c2) időegység színe. 

function drawArc( tu, ox, oy, radius, startAngle, endAngle ) {
             
    if (startAngle == endAngle) { startAngle -= 0.000001; }
    // Kis trükk, hogy 0-s startszög esetén a teljes körív kirajzolódjon hátralévőként (color2)!
    
    ctx.font = "20px Arial";
    ctx.textBaseline = "middle";

	for ( let i=0; i<2; i++ ) {
       
        let timeUnitChar;  // tu: TimeUnit (0:h, 1:m, 2:s)
        switch(tu) {      
            case 0: timeUnitChar="H";  break;
            case 1: timeUnitChar="M";  break;
            case 2: timeUnitChar="S";  break;
        }
        ctx.fillStyle = colorArr[0];  
        ctx.fillText( timeUnitChar, ox-16/2, oy );
        
        ctx.lineWidth = 50;  // Az időkerék karimájának szélessége, azaz a vonalvastagsága.
        ctx.beginPath();
        ctx.arc( ox, oy, radius, startAngle, endAngle, i%2 );
        ctx.strokeStyle = colorArr[i];  // false (0): colorArr[0] , true (1): colorArr[1]
        ctx.stroke();

        ctx.lineWidth = 2;  // Az időkerekek szélén lévő 12db (20 fokonkénti) jelölés vonalvastagsága.
        for ( let tum=0; tum<12; tum++ ) {
                                            // tum: TimeUnit Mark
            ctx.beginPath();
            ctx.arc( ox, oy, radius+50/2 +2, tum*fullCircle/12 -0.01, tum*fullCircle/12 +0.01 );  
            ctx.strokeStyle = "gray";  // Az időkerekek szélén lévő 12db (20 fokonkénti) jelölés színe.
            ctx.stroke();
        }
    }
}


// A 3 korongon lévő körívek paramétereinek beállítása.

const circleUnit = 200;
const circleRadius = 68;

const origoX  = 100;

const origoY1 = 100;
const origoY2 = origoY1 + 1*circleUnit;
const origoY3 = origoY1 + 2*circleUnit;

function threeArcsDraw() {

    for ( let tu=0; tu<3; tu++ ) {

        if (tu==0) { drawArc ( tu, origoX, origoY1, circleRadius, nullAngle, hoursEndAngle ); }
        if (tu==1) { drawArc ( tu, origoX, origoY2, circleRadius, nullAngle,  minsEndAngle ); }
        if (tu==2) { drawArc ( tu, origoX, origoY3, circleRadius, nullAngle,  secsEndAngle ); }
    }
}


// Az eltelt időegységek százalékban való kiszámítása.

let hoursPc;
let  minsPc;
let  secsPc;

function endTimesPercentCompute() {

    hoursPc = (hours/hEnd *100).toFixed(1);    
     minsPc = (mins /mEnd *100).toFixed(1); 
     secsPc = (secs /sEnd *100).toFixed(1);  // Pc: PerCent
}  


// A kiirandó szövegek paramétereinek beállítása (t: text).

const tShiftX = 10;  
const tShiftY = 25;
 
const textY11 = origoY1 - tShiftY;  const textY12 = origoY1 + tShiftY;
const textY21 = origoY2 - tShiftY;  const textY22 = origoY2 + tShiftY;
const textY31 = origoY3 - tShiftY;  const textY32 = origoY3 + tShiftY;

const textX = circleUnit + tShiftX;

const tBgWidth  = 2*207;  // 2-vel osztható legyen!
const tBgHeight = 2* 22;  // 2*(20px betűmagasság + 2)

ctx.font = "20px Arial";

function textColor1Background() {

    ctx.fillStyle = "#cccccc";
     
    ctx.fillRect(textX - tShiftX/2, textY11 - tBgHeight/2, tBgWidth, tBgHeight);
    ctx.fillRect(textX - tShiftX/2, textY21 - tBgHeight/2, tBgWidth, tBgHeight);
    ctx.fillRect(textX - tShiftX/2, textY31 - tBgHeight/2, tBgWidth, tBgHeight); 
}

function textColor1_1() {

    ctx.textBaseline = "bottom";
     
    ctx.fillText(" A teljes mai napból (24 h) eddig eltelt egész", textX, textY11);
    ctx.fillText(" Az aktuális órából (60 m) eddig eltelt egész" , textX, textY21);
    ctx.fillText(" Az aktuális percből (60 s) eddig eltelt egész", textX, textY31);
}

function textColor1_2() {

    ctx.textBaseline = "top";

    ctx.fillText(" órák (h) száma: "        + `${hours} db = ${hoursPc} %. `, textX, textY11);
    ctx.fillText(" percek (m) száma: "      + `${ mins} db = ${ minsPc} %. `, textX, textY21);
    ctx.fillText(" másodpercek (s) száma: " + `${ secs} db = ${ secsPc} %. `, textX, textY31);
}


// Az eltelt időegységek kiíratása.

function textPrintColor1() {    
           
    textColor1Background();
 
    ctx.fillStyle = colorArr[0];
    textColor1_1();
    textColor1_2();
}


function textColor2Background() {

    ctx.fillStyle = "#333333";
     
    ctx.fillRect(textX - tShiftX/2, textY12 - tBgHeight/2, tBgWidth, tBgHeight);
    ctx.fillRect(textX - tShiftX/2, textY22 - tBgHeight/2, tBgWidth, tBgHeight);
    ctx.fillRect(textX - tShiftX/2, textY32 - tBgHeight/2, tBgWidth, tBgHeight);
}

function textColor2_1() {

    ctx.textBaseline = "bottom";
     
    ctx.fillText("(A napból még hátralévő, teljesen le nem telt" , textX, textY12);
    ctx.fillText("(Az órából még hátralévő, teljesen le nem telt", textX, textY22);
    ctx.fillText("(A percből még hátralévő, teljesen le nem telt", textX, textY32);
}

function textColor2_2() {

    ctx.textBaseline = "top";
     
    ctx.fillText(" órák (h) száma: "        + `${hEnd - hours} db = ${(100 - hoursPc).toFixed(1)} %.)`, textX, textY12);
    ctx.fillText(" percek (m) száma: "      + `${mEnd -  mins} db = ${(100 -  minsPc).toFixed(1)} %.)`, textX, textY22);
    ctx.fillText(" másodpercek (s) száma: " + `${sEnd -  secs} db = ${(100 -  secsPc).toFixed(1)} %.)`, textX, textY32);
}
   

// A hátralévő időegységek kiíratása.

function textPrintColor2() {

    textColor2Background();
 
    ctx.fillStyle = colorArr[1];
    textColor2_1();
    textColor2_2();
}


// A fő-függvény!

function drawAll() {

    getTime();
    endAnglesCompute();

    previousStateClear();
    threeArcsDraw();

    endTimesPercentCompute();
    textPrintColor1();
    textPrintColor2();
}


drawAll();  // A fő-függvény azonnali (1.) meghívása. */
setInterval(drawAll, 1000);  // A fő-fv. másodpercenkénti (1000 msec) meghívása.