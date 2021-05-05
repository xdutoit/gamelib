/* gamelib
librairie JS pour création "facile" de jeu HTML

historique:
1.0 - 28.03.2020 1ère version fonctionnelle

x. dutoit
*/

// constantes
const STATE_STOP = 0;
const STATE_PLAY = 1;

// variables
let ctx; // contexte 2D du canvas
let cnv_dim;
let state = STATE_STOP; // état du jeu (en cours / arrêté)
let timer = false; // object setInterval
let timer_interval = 10; // durée d'une itération [ms]

// initialisation
window.onload = function(){
	console.log('initialisation gamelib');

	// récupération du canvas
	let cnv = document.getElementById('cnv_jeu_gl');
	if(cnv){
		cnv_dim = [cnv.width, cnv.height];
		if(cnv.getContext){
			ctx = cnv.getContext('2d');
		}
		else{
			console.error('canvas pas supporté');

		}
	}
	else{
		console.error('canvas cnv_jeu introuvable dans la page');
	}

	// listener du bouton demmarer
	let bouton = document.getElementById('btn_demarrer');
	if(bouton){
		if(typeof step == 'function'){
			bouton.addEventListener('click',demarrer);
		}
		else{
			console.error('fonction step introuvable');
		}
	}
	else{
		console.warn('objet btn_demarrer introuvable dans la page');
	}

	// appel de la fonction init
	if(typeof init == 'function'){
		console.log('appel de la fonction init');
		init();
	}
	else{
		console.warn('pas de fonction init');
	}
}

class Element{

	constructor(id_img){
		let img = document.getElementById(id_img);
		if(img){
			this.id_img = id_img;
			this.img = img;
			this.x = 0;
			this.y = 0;
			this.a = 0;
			this.w = img.width;
			this.h = img.height;
			console.log('élément ajouté (image '+id_img+')');
		}
		else{
			console.error('image '+id_img+' introuvable dans la page');
		}
	}

	setX(x){
		this.x = x;
	}

	setY(y){
		this.y = y;
	}

	setXY(x,y){
		this.setX(x);
		this.setY(y);
	}

	setAngle(a){
		this.a = a;
	}

	getX(){
		return this.x;
	}

	getY(){
		return this.y;
	}

	getAngle(){
		return this.a;
	}

	addX(dx){
		this.x += dx;
	}

	addY(dy){
		this.y += dy;
	}

	addXY(dx,dy){
		this.addX(dx);
		this.addY(dy);
	}

	addAngle(da){
		this.a += da;
	}

	dessiner(){
		let a_rad = this.a * 0.017453292519943295; // Math.PI/180
		ctx.save();

		ctx.translate(this.x,this.y); // (x,y)
		ctx.rotate(a_rad);	// angle
		ctx.drawImage(this.img,-this.w/2,-this.h/2); // (x,y) au MILIEU de l'élément

		ctx.restore();

	}

	clone(){
		let c = new Element(this.id_img);
		for(var k in this){
			c[k] = this[k];
		}
		return c;
	}

}

// effacer
function effacerTout(){
	ctx.save();
	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,cnv_dim[0],cnv_dim[1]);
}

// démarrage du jeu
function demarrer(){
	if (state == STATE_STOP){
		// démarrage du timer
		console.log('démarrage du jeu');
		timer = setInterval(step, timer_interval);
		state = STATE_PLAY;
	}
	else{
		// arrêt du timer
		console.log('arrêt du jeu');
		clearInterval(timer);
		state = STATE_STOP;
	}
}

function setDureeIntervalle(d){
	timer_interval = d;
}

// key listener
function definirFonctionClavier(fct_key){
	document.addEventListener('keydown',function(ev){
		console.log('appel de la fonction '+fct_key.name+' (touche='+ev.key+')')
		fct_key(ev.key);
	});
}
