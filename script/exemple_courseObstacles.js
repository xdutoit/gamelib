const WIDTH = 800;

function init(){
	GL.inclure('perso','perso');
	GL.setXY('perso',WIDTH/2,70);
	perso_etat = PERSO_BASE;

	GL.inclure('brique','brique');
	GL.setXY('brique',WIDTH+11,0);
	brique_etat = BRIQUE_INVISIBLE;

	GL.definirFonctionToucheEnfoncee(toucheEnf);

	score = 0;

	GL.dessinerTout();

	GL.setDebugLevel(1);
}

const BRIQUE_INVISIBLE = 0;
const BRIQUE_VISIBLE = 1;
let brique_etat = BRIQUE_INVISIBLE;

const PERSO_BASE = 0;
const PERSO_HAUT = 1;
const PERSO_BAS = 2;

let perso_etat = PERSO_BASE;
let perso_vy = 0;
let compteur_bas = 0;

let score = 0;

function step(){
	// perso
	if(perso_etat==PERSO_HAUT){
		GL.addY('perso',perso_vy);
		perso_vy += 1;
		if(GL.getY('perso')>70){
			perso_etat = PERSO_BASE;
			GL.setY('perso',70);
		}
	}
	if(perso_etat==PERSO_BAS){
		GL.setY('perso',100)
		compteur_bas--;
		if(compteur_bas < 0){
			perso_etat = PERSO_BASE;
			GL.setY('perso',70);
		}
	}

	// brique
	if(brique_etat==BRIQUE_INVISIBLE){
		if(Math.random()<.05){
			if(Math.random()<.5){
				GL.setY('brique',90);
			}
			else{
				GL.setY('brique',40);
			}
			brique_etat = BRIQUE_VISIBLE;
		}
	}
	else if(brique_etat == BRIQUE_VISIBLE){
		GL.addX('brique',-5);
		if(GL.getX('brique')<-11){
			brique_etat = BRIQUE_INVISIBLE;
			GL.setX('brique',WIDTH+11);
			score++;
		}
	}

	
	GL.effacerTout();
	GL.dessinerTout();

	// collision
	if(GL.collision('brique','perso')){
		GL.arreter();
		GL.ecrireTexte('GAME OVER',WIDTH/2,50,50,'center');
		GL.ecrireTexte('score final: '+score,WIDTH/2,90,30,'center');
	}
	GL.ecrireTexte('score: '+score,WIDTH-5,20,20,'right');
	
}


function toucheEnf(t){
	if(t=='ArrowUp'){
		// sauter
		if(perso_etat==PERSO_BASE){
			perso_etat = PERSO_HAUT;
			perso_vy = -15;
		}
	}
	if(t=='ArrowDown'){
		// s'accroupir
		if(perso_etat==PERSO_BASE){
			perso_etat = PERSO_BAS;
			compteur_bas = 30;
		}
	}
}
