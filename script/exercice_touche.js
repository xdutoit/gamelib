function init(){
	// inclure ici les images et mettre en place les éléments
	GL.inclure('elem1','rect1');

	// placer à (0,0)
	GL.setXY('elem1',0,0);

	// dessiner
	GL.dessiner('elem1');

	// déterminer la fonction à appeler lorsqu'une touche est enfoncée
	GL.definirFonctionToucheEnfoncee(toucheAppuyee);
}

function toucheAppuyee(id_touche){
	// 'id_touche' vaut le nom de la touche

	// flèche droite: on déplace l'élément de 10px dans la direction positive de l'axe x
	if(id_touche=='ArrowRight'){
		GL.addX('elem1',10);
	}
	// flèche gauche: on déplace l'élément de 10px dans la direction négative de l'axe x
	if(id_touche=='ArrowLeft'){
		GL.addX('elem1',-10);
	}

	// flèche haut: on déplace l'élément de 10px dans la direction négative de l'axe y
	if(id_touche=='ArrowUp'){
		GL.addY('elem1',-10);
	}
	// flèche bas: on déplace l'élément de 10px dans la direction positive de l'axe x
	if(id_touche=='ArrowDown'){
		GL.addY('elem1',10);
	}

	// dans tous les cas, on efface le canveas et on redessine l'lément à sa nouvelle position
	GL.effacerTout();
	GL.dessiner('elem1');
}
