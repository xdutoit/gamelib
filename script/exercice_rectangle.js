function init(){
  // inclure ici les images et mettre en place les éléments
  GL.inclure('element1','monRectangle');

  // placer à (100,300)
  GL.setXY('element1', 100, 300);

  // angle de 30°
  GL.setAngle('element1',30);

  // dessiner le résultat
  GL.dessiner('element1');
}
