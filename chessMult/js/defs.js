

var PIECES =  { EMPTY : 0, wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6, bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };
var BRD_SQ_NUM = 120;

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;

var INFINITE = 30000;
var MATE = 29000;

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


var COLUMNS =  { COL_A:0, COL_B:1, COL_C:2, COL_D:3, COL_E:4, COL_F:5, COL_G:6, COL_H:7, COL_NONE:8 };
var ROWS =  { ROW_1:0, ROW_2:1, ROW_3:2, ROW_4:3, ROW_5:4, ROW_6:5, ROW_7:6, ROW_8:7, ROW_NONE:8 };

var COLOURS = { WHITE:0, BLACK:1, BOTH:2 };

var SQUARES = {
  A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, NO_SQ:99, OFFBOARD:100
};

var BOOL = { FALSE:0, TRUE:1 };

var CASTLEBIT = {BQCA : 8, BKCA : 4, WQCA : 2, WKCA : 1}; //WKCA:WhiteKingSideCastle(4rutor rokad vit),WQCA:WhiteQueenSideCastle(5rutor rokad vit)
/*
0001 = 1
0010 = 2
0100 = 4
1000 = 8
1101 = 13 , WKCA, Ej WQCA, BKCA,BQCA
if (1101 & WKCA)!=0 (WKCA,  kan vit göra rokad kingside)
*/

var ColBrd = new Array(BRD_SQ_NUM);
var RowBrd = new Array(BRD_SQ_NUM);

var Sq120ToSq64 = new Array(BRD_SQ_NUM); // en array för function InitSq120To64 som finns i main
var Sq64ToSq120 = new Array(64);		// en array för function InitSq64To120 som finns i main

var PceChar = ".PNBRQKpnbrqk";
var SideChar = "wb-";
var RowChar = "12345678";
var ColChar = "abcdefgh";

//------------------------------- För att lättare skriva egenskaper till pjäserna
// Alla Piece... indexerad som PIECES alltså följer PIECES som finns längst upp, : tom, vit bonde... svart kung
var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
//Allt utom Bonde
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
//torn drottning kung
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
// löpare eller häst
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
// pjäs värde vit : 100 bonde, 325 löpare och häst, 550 torn, 1000 drottning 50000 kung, svarta pjäser: ...

var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
// EMPTY skrivs alltså som båda färger	COLOURS:BOTH
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
//-------------------------------

// Vilka riktningar kan de olika pjäserna ta
var KnDir = [ -8, -19,	-21, -12, 8, 19, 21, 12 ];
var RkDir = [ -1, -10,	1, 10 ];
var BiDir = [ -9, -11, 11, 9 ];
var KiDir = [ -1, -10,	1, 10, -9, -11, 11, 9 ];

var DirNum = [ 0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8 ];
var PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir ];
var LoopSlidePce = [ PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0 ];
var LoopNonSlidePce = [ PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0 ];
var LoopSlideIndex = [ 0, 4 ];
var LoopNonSlideIndex = [ 0, 3 ];
var Kings = [PIECES.wK, PIECES.bK];
// en pas : pce = PIECES.EMPTY * 120 + sq
var PieceKeys = new Array(14 * 120); // 14 för att det ska vara tillräckligt (pjäs indexeringen,vit bonde...svart kung), 120 antalet rutor med de rutor runt om
// I funktionen InitHashKeys() så initierar vi arrayen PieceKeys
var SideKey; // XOR in eller ut
var CastleKeys = new Array(16); // XOR in eller ut , kan vara 0 till 15. 0000 - 1111 binärt

var Mirror64 = [
56	,	57	,	58	,	59	,	60	,	61	,	62	,	63	,
48	,	49	,	50	,	51	,	52	,	53	,	54	,	55	,
40	,	41	,	42	,	43	,	44	,	45	,	46	,	47	,
32	,	33	,	34	,	35	,	36	,	37	,	38	,	39	,
24	,	25	,	26	,	27	,	28	,	29	,	30	,	31	,
16	,	17	,	18	,	19	,	20	,	21	,	22	,	23	,
8	,	9	,	10	,	11	,	12	,	13	,	14	,	15	,
0	,	1	,	2	,	3	,	4	,	5	,	6	,	7
];

var CastlePerm = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];


function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

function fromRCMxToNumArrSq(f,r) { // Peka på matriselementen som en array istället. Finns i initSq120To64
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}

/*Titta i main under initSq120To64. Vill vi t.ex ha
 array med index 55 i 64 så skriver vi sq120(55)
 array med index 57 i 120 så skriver vi sq64(120)
 */
function SQ64(sq120) { 
	return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) {
	return Sq64ToSq120[(sq64)];
}

function MIRROR64(sq) {
	return Mirror64[sq];
}


function SQOFFBOARD(sq) {
	if(ColBrd[sq]==SQUARES.OFFBOARD) return BOOL.TRUE;
	return BOOL.FALSE;	
}

function HASH_PCE(pce,sq) { 
	brd_posKey ^= PieceKeys[pce*120 + sq]; 
}
function HASH_CA() { brd_posKey ^= CastleKeys[brd_castlePerm]; }
function HASH_SIDE() { brd_posKey ^= SideKey; }
function HASH_EP() { brd_posKey ^= PieceKeys[brd_enPas]; }

var GameController = {};
GameController.EngineSide = COLOURS.BOTH;
GameController.PlayerSide = COLOURS.BOTH;
GameController.BoardFlipped = BOOL.FALSE;
GameController.GameOver = BOOL.FALSE;
GameController.BookLoaded = BOOL.FALSE;
GameController.GameSaved = BOOL.TRUE;


function RAND_32() {
	/* 4 slumpmässiga tal som ger till exempel a8 eller f7 (hexadec) och sen shiftat dem 23, 16 och 8 steg till vänster
	där första är något i stil med a8000000 och den andra f70000, tredje är e500 och fjärde a6...
	sen körs or på alla dessa så att vi får något i stil med a8f7e5a6
	
	*/
	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
		 | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}
/*
vad är unikt för en schackPartiPosition
-pjäs på ruta, 2 hästar har olika positioner
-sida
-rokad
-EnPas
osv

För att få fram en unik key så körs RAND_32 i defs.js
De unika nycklarna sätts också ihop genom XOR i javascript till en helt unik nyckel för en position

posKey ^= RandNum för alla pjäser på olika rutor
posKey ^= RandNum för sida ... o.s.v
-------------------------------------------------------------------
ex.
Gå in på: http://www.w3schools.com/js/tryit.asp?filename=tryjs_myfirst
<!DOCTYPE html>
<html>
<body>

<pre>
<script>
var posKey = 0;
var piece1= RAND_32();
var piece2= RAND_32();
var piece3= RAND_32();
var piece4= RAND_32();

posKey ^= piece1;
posKey ^= piece2;
posKey ^= piece3;
posKey ^= piece4;

document.writeln(posKey.toString(16)+ " :posKey med piece1,piece2,piece3,piece4");
posKey ^= piece1;
document.writeln(posKey.toString(16)+ " :poskey piece1 borthashad");

posKey ^= piece1;
document.writeln(posKey.toString(16)+ " :posKey piece1 dithashad igen");

var posKey = 0;
posKey ^= piece2;
posKey ^= piece3;
posKey ^= piece4;
document.writeln(posKey.toString(16)+ " :posKey satt till 0 och piece1 ej med");

var posKey = 0;
posKey ^= piece2;
posKey ^= piece3;
posKey ^= piece4;
posKey ^= piece1;
document.writeln(posKey.toString(16)+ " :posKey med p1,p2,p3,p4 huller om buller");

function RAND_32() {

return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16) | (Math.floor

((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);

}
</script>
</pre>
</body>
</html>

*/
//-----------------------------------------------------------------------------------------


/* 
// Se nedan!! Hexadecimal 1111= (15) = F (0123456789,A=10,B=11,C=,D=,E=,F=15), 0111 = (7) = 7, 01111111= 7F
                        	                        
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F    
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
*/

// För att få ut information från de 24 bitarna görs följande funktioner
// I board.js så hashas olika variabler in  i GeneratePosKey
function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m)  { return (((m)>>7) & 0x7F); }
function CAPTURED(m)  { return (((m)>>14) & 0xF); }
function PROMOTED(m)  { return (((m)>>20) & 0xF); }



var MFLAGEP = 0x40000 // En Pasant
var MFLAGPS = 0x80000 // Pawn Start
var MFLAGCA = 0x1000000 // Castle

var MFLAGCAP = 0x7C000 // Captured Move? Vi behöver EP och Captured 0000 0000 0111 1100 0000 0000 0000
var MFLAGPROM = 0xF00000

var NOMOVE = 0

var PVENTRIES = 10000;

/*
Bin & Hex
							F   8
0000 0000 0000 0000 0000 1111 1000
FC7
1111 1100 0111

21 -> 98 är rutornas index i sq120
i bit blir det 7 bitar (111 1111)

FromSq representeras av de 7 sista bitarna
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F // "0x" visar att det är hexadecimal representation
med hjälp av detta kan vi dra ut de 7 första bitarna ur ett hexadecimalt system med en OCH operator

Säg att vi har följande och vi vill ha ut From square från d
0010 1100 0000 1111 0000 0111 1111 -> var d
vi vill alltså ha ut de 7 första bitarna
fromSq = d & 0x7F

nytt exempel 
0010 0010 0000 1111 0000 0101 1011 -> d
vilka är de sju första bitarna?
fromSq = d & 0x7F -> 101 1011
----------------------------------------------------------
ToSq representeras av de 7 bitarna framför
0000 0000 0000 0011 1111 1000 0000

0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F // vi skiftar allt 7 bitar till höger och använder 0x7F på detta
----------------------------------------------------------
Captured, tagna pjäser kräver 4 bitar
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0x7 // vi skiftar allt 14 bitar till höger och använder 4 bitar (0xF) på detta
----------------------------------------------------------
En pasant,ett eller två steg Yes or No, 1 bit
0000 0000 0100 0000 0000 0000 0000 -> EP (kör AND på 0x40000 så får vi direkt 0 eller 1)
----------------------------------------------------------
Pawn start,ett eller två steg Yes or No, 1 bit
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start (kör AND på 0x80000 så får vi direkt 0 eller 1)
----------------------------------------------------------
Promoted Piece, om bonde kommer till slutet
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0x7
Caste, rokad
0001 0000 0000 0000 0000 0000 0000 -> Castle (kör AND på 0x1000000




*/







