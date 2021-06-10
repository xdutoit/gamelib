function init() {
  // barre gauche
  GL.inclure("barreG", "barre");
  GL.setXY("barreG", 20, 200);
  GL.setAngle("barreG", 90);

  // barre droite
  GL.inclure("barreD", "barre");
  GL.setXY("barreD", 580, 200);
  GL.setAngle("barreD", 90);
  barre_y = 200;
  barre_vy = 0;

  // balle
  GL.inclure("balle", "balle");
  GL.setXY("balle", 300, 200);

  // touches
  GL.definirFonctionSourisBougee(sourisBouge);

  GL.dessinerTout();

  GL.setDebugLevel(1);
}

let vx = 1;
let vy = -1;
let barre_y = 200;
let barre_vy = 0;

function step() {
  GL.addXY('balle', vx, vy);

  // vérifier collisions murs
  if (GL.collisionMurHaut('balle') || GL.collisionMurBas('balle')) {
    vy *= -1;
  }
  // éviter balle hors champ
  if (GL.getY('balle') < 0) {
    GL.setY('balle', 0);
    vy = Math.abs(vy);
  }
  else if (GL.getY('balle') > 400) {
    GL.setY('balle', 400);
    vy = -Math.abs(vy);
  }

  // IA
  if (vx < 0) {
    if (GL.getY('barreG') < GL.getY('balle') - 20) {
      GL.addY('barreG', 5);
    }
    else if (GL.getY('barreG') > GL.getY('balle') + 20) {
      GL.addY('barreG', -5);
    }
  }


  // vérifier rebond barre gauche
  if (GL.collision('balle', 'barreG')) {
    vx *= -1;
    GL.addX('balle', 5); // pour éviter les collisions successives
  }
  // vérifier rebond barre droite
  if (GL.collision('balle', 'barreD')) {

    vx *= -1;
    vy += barre_vy;
    GL.addX('balle', -5); // pour éviter les collisions successives
  }



  // vérifier perdu
  if (GL.collisionMurDroite('balle') || GL.collisionMurGauche('balle')) {
    GL.arreter();
    GL.ecrireTexte('GAME OVER', 300, 200, 50, 'center');
    if (GL.collisionMurDroite('balle')) {
      GL.ecrireTexte('Joueur gagne', 300, 300, 50, 'center');
    }
    if (GL.collisionMurGauche('balle')) {
      GL.ecrireTexte('Ordinateur gagne', 300, 300, 50, 'center');
    }
  }
  else {
    GL.effacerTout();
    GL.dessinerTout();
  }
}

function sourisBouge(x, y) {
  GL.setY('barreD', y);
  barre_vy = y - barre_y;
  barre_y = y;
}
