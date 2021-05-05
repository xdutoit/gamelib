/* gamelib
librairie JS pour création "facile" de jeu HTML

historique:
1.0 - 28.03.2020 1ère version fonctionnelle

x. dutoit
*/

// variables
let ctx; // contexte 2D du canvas
let cnv_dim;

// éléments
let elem = [];

// initialisation
window.onload = function(){
	console.log('initialisation STXlib');

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

	// listener du bouton start
	let bouton = document.getElementById('btn_start');
	if(bouton){
		bouton.addEventListener('click',demarrer);
	}
	else{
		console.error('objet btn_start introuvable dans la page');
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

// inclure images
function inclure(id, id_img){
	/* inclut l'image id_img dans la liste des éléments, avec l'id id */
	let img = document.getElementById(id_img);
	if(img){
		let el = {id:id, id_img:id_img, img:img, x:0, y:0, ang:0, w:img.width, h:img.height};
		elem.push(el);
		console.log('élément '+id+' ajouté (image '+id_img+')');
	}
	else{
		console.error('image '+id_img+' introuvable dans la page');
	}
}

function clone(id, new_id){ // à tester
	let el = getElem(id);
	elem.push({id:el.id, id_img:el.id_img, img:el.img, x:el.x, y:el.y, ang:el.ang, w:el.w, h:el.h})

}

// position
function setPosition(id,x,y){
	/* positionne l'élément id à (x;y) */
	let el = getElem(id);
	el.x = x;
	el.y = y;
}
function setX(id,x){
	let el = getElem(id);
	el.x = x;
}
function setY(id,y){
	let el = getElem(id);
	el.y = y;
}

function setAngle(id,ang){
	/* applique l'angle ang (en degrés) à l'élément id */
	let el = getElem(id);
	el.ang = ang;
}

// dessiner élément
function dessiner(id){
	let el = getElem(id);
	let el_ang_rad = el.ang * 0.017453292519943295; // Math.PI/180
	let cos_ang = Math.cos(el_ang_rad);
	let sin_ang = Math.sin(el_ang_rad);

	ctx.save();



 /*
	// origine en BAS à gauche: x: -cnv_dim[1]*sin_ang; y: +cnv_dim[1]*cos_ang
	// position X: x: el.x*cos_ang; y: el.x*sin_ang
	// position Y: x: el.y*sin_ang; y: -el.y*cos_ang
	// échelle: TODO
 ctx.rotate(-el_ang_rad);	ctx.drawImage(el.img,-el.w/2-cnv_dim[1]*sin_ang+el.x*cos_ang+el.y*sin_ang,-el.h/2+cnv_dim[1]*cos_ang+el.x*sin_ang-el.y*cos_ang,el.w,el.h);
 /


 ctx.translate(el.x,cnv_dim[1]-el.y); // (x,y): origine en BAS à gauche
 ctx.rotate(-el_ang_rad);	// angle
 ctx.drawImage(el.img,-el.w/2,-el.h/2); // (x,y) au MILIEU de l'élément
 // TODO: inclure échelle
 */
  ctx.translate(el.x,el.y); // (x,y): origine en BAS à gauche
  ctx.rotate(el_ang_rad);	// angle
  ctx.drawImage(el.img,-el.w/2,-el.h/2); // (x,y) au MILIEU de l'élément

	ctx.restore();
}

// démarrage du jeu
function demarrer(){
	console.log('démarrage du jeu');
}

// key listener
function definirFonctionClavier(fct_key){
	document.addEventListener('keydown',function(ev){
		console.log('appel de la fonction '+fct_key.name+' (touche='+ev.key+')')
		fct_key(ev.key);
	});
}

// utilitaires
function convert_dims(x,y){
	return [x, cnv_dim[1]-y];
}

function getElem(id){
	for(var e=0;e<elem.length;e++){
		if(elem[e].id==id){
			return elem[e];
		}
	}
	console.error('élément '+id+' inexistant');
	return false;
}
