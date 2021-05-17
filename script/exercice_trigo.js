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

  // flèche droite: on tourne de 10 degrés dans le sens horaire
  if(id_touche=='ArrowRight'){
    GL.addAngle('elem1',10);
  }
  // flèche gauche: on tourne de 10 degrés dans le sens anti-horaire
  if(id_touche=='ArrowLeft'){
    GL.addAngle('elem1',-10);
  }

  // flèche haut: on avance de 10px dans a direction dans laquelle on se trouve
  if(id_touche=='ArrowUp'){
    let angle_rad = GL.getAngle('elem1')*Math.PI/180;
    GL.addX('elem1',10*Math.cos(angle_rad));
    GL.addY('elem1',10*Math.sin(angle_rad));
  }
  // flèche bas: on recule de 10px dans a direction dans laquelle on se trouve
  if(id_touche=='ArrowDown'){
    let angle_rad = GL.getAngle('elem1')*Math.PI/180;
    GL.addX('elem1',-10*Math.cos(angle_rad));
    GL.addY('elem1',-10*Math.sin(angle_rad));
  }

  // dans tous les cas, on efface le canveas et on redessine l'lément à sa nouvelle position
  GL.effacerTout();
  GL.dessiner('elem1');
}
