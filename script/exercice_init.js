function init(){
  // inclure ici les images et mettre en place les éléments
  GL.inclure('elem1','rect1');

  // placer à (100,200)
  GL.setXY('elem1',100,200);

  // angle de 30°
  GL.setAngle('elem1',30);

  // dessiner
  GL.dessiner('elem1');
}
