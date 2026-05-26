function init() {
  // inclure ici les images et mettre en place les éléments
  GL.inclure('rectangle', 'rect1');

  // placer à (300,200)
  GL.setXY('rectangle', 300, 200);

  // dessiner
  GL.dessiner('rectangle');

  // déterminer la fonction à appeler lorsqu'une touche est enfoncée
  GL.definirFonctionToucheEnfoncee(toucheAppuyee);
}

function toucheAppuyee(id_touche) {
  // 'id_touche' vaut le nom de la touche

  // flèche droite: on tourne de 10 degrés dans le sens horaire
  if (id_touche == 'ArrowRight') {
    GL.addAngle('rectangle', 10);
  }
  // flèche gauche: on tourne de 10 degrés dans le sens anti-horaire
  if (id_touche == 'ArrowLeft') {
    GL.addAngle('rectangle', -10);
  }

  // flèche haut: on avance de 10px dans a direction dans laquelle on se trouve
  if (id_touche == 'ArrowUp') {
    let angle_rad = GL.getAngle('rectangle') * Math.PI / 180;
    GL.addX('rectangle', 10 * Math.cos(angle_rad));
    GL.addY('rectangle', 10 * Math.sin(angle_rad));
  }
  // flèche bas: on recule de 10px dans a direction dans laquelle on se trouve
  if (id_touche == 'ArrowDown') {
    let angle_rad = GL.getAngle('rectangle') * Math.PI / 180;
    GL.addX('rectangle', -10 * Math.cos(angle_rad));
    GL.addY('rectangle', -10 * Math.sin(angle_rad));
  }

  // dans tous les cas, on efface le canveas et on redessine l'élément à sa nouvelle position
  GL.effacerTout();
  GL.dessinerTout();
}
