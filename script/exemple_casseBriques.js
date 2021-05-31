function init(){
	// briques
	for(var i=0;i<10;i++){
		for(var j=0;j<5;j++){
			GL.inclure("brique_"+i+"_"+j,"brique");
			GL.setXY("brique_"+i+"_"+j,50+20.5+i*51,50+j*30);
		}
	}

	// barre
	GL.inclure("barre","barre");
	GL.setXY("barre",300,350);

	// balle
	GL.inclure("balle","balle");
	GL.setXY("balle",300,340);

	// touches
	GL.definirFonctionToucheEnfoncee(toucheEnf);
	GL.definirFonctionToucheRelachee(toucheRel);

	GL.dessinerTout();

	GL.setDebugLevel(1);
}

let vx = 1;
let vy = -1;
let mvt_courant = 0;

function step(){
	GL.addXY('balle',vx,vy);

	// vérifier collisions murs
	if(GL.collisionMurHaut('balle')){
		vy *= -1;
	}
	if(GL.collisionMurGauche('balle') || GL.collisionMurDroite('balle')){
		vx *= -1;
	}

	// vérifier collision barre
	if(GL.collision('barre','balle')){
		vy *= -1;
	}

	// vérifier perdu
	if(GL.collisionMurBas('balle')){
		GL.arreter();
		GL.ecrireTexte('GAME OVER',300,200,100,'center');
		console.log('perdu...');
	}
	else{

		// bouger barre
		GL.addX('barre',mvt_courant*1);

		GL.effacerTout();
		GL.dessinerTout();
	}
}


function toucheEnf(t){
	if(t=='ArrowLeft'){
		mvt_courant = -1;
	}
	if(t=='ArrowRight'){
		mvt_courant = +1;
	}
}

function toucheRel(t){
	if(t=='ArrowLeft' || t=='ArrowRight'){
		mvt_courant = 0;
	}

}
