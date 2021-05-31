function init(){
  // inclure ici les images et mettre en place les éléments
  GL.inclure('elem1','rect1');

  // placer à (0,0)
  GL.setXY('elem1',300,200);

  // dessiner
  GL.dessiner('elem1');

  // déterminer la fonction à appeler lorsqu'une touche est enfoncée
  GL.definirFonctionToucheEnfoncee(toucheAppuyee);
}

function toucheAppuyee(nomTouche){
  // 'nomTouche' vaut le nom de la touche

  // flèche droite: on déplace l'élément de 10px dans la direction positive de l'axe x
  if(nomTouche=='ArrowRight'){
    GL.addX('elem1',10);
  }
  // flèche gauche: on déplace l'élément de 10px dans la direction négative de l'axe x
  if(nomTouche=='ArrowLeft'){
    GL.addX('elem1',-10);
  }

  // flèche haut: on déplace l'élément de 10px dans la direction négative de l'axe y
  if(nomTouche=='ArrowUp'){
    GL.addY('elem1',-10);
  }
  // flèche bas: on déplace l'élément de 10px dans la direction positive de l'axe x
  if(nomTouche=='ArrowDown'){
    GL.addY('elem1',10);
  }

  // dans tous les cas, on efface le canveas et on redessine l'lément à sa nouvelle position
  GL.effacerTout();
  GL.dessinerTout();
}
