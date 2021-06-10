function init() {
  // barre gauche
  GL.inclure("barreG", "barre");
  GL.setXY("barreG", 20, 200);
  GL.setAngle("barreG", 90);

  // barre droite
  GL.inclure("barreD", "barre");
  GL.setXY("barreD", 580, 200);
  GL.setAngle("barreD", 90);

  // balle
  GL.inclure("balle", "balle");
  GL.setXY("balle", 300, 200);

  // touches
  GL.definirFonctionToucheEnfoncee(toucheEnf);
  GL.definirFonctionToucheRelachee(toucheRel);

  GL.dessinerTout();

  GL.setDebugLevel(1);
}

let vx = 1;
let vy = -1;
let mvt_courant_G = 0;
let mvt_courant_D = 0;

function step() {
  GL.addXY('balle', vx, vy);

  // vérifier collisions murs
  if (GL.collisionMurHaut('balle') || GL.collisionMurBas('balle')) {
    vy *= -1;
  }

  // vérifier rebond barre
  if (GL.collision('balle', 'barreG') || GL.collision('balle', 'barreD')) {
    vx *= -1;
  }

  // vérifier perdu
  if (GL.collisionMurDroite('balle') || GL.collisionMurGauche('balle')) {
    GL.arreter();
    GL.ecrireTexte('GAME OVER', 300, 200, 50, 'center');
    if (GL.collisionMurDroite('balle')) {
      GL.ecrireTexte('Joueur GAUCHE gagne', 300, 300, 50, 'center');
    }
    if (GL.collisionMurGauche('balle')) {
      GL.ecrireTexte('Joueur DROITE gagne', 300, 300, 50, 'center');
    }
  }
  else {

    // bouger barre
    GL.addY('barreG', mvt_courant_G * 1);
    GL.addY('barreD', mvt_courant_D * 1);

    GL.effacerTout();
    GL.dessinerTout();
  }
}

function toucheEnf(t) {
  if (t == 'ArrowUp') {
    mvt_courant_D = -1;
  }
  if (t == 'ArrowDown') {
    mvt_courant_D = +1;
  }
  if (t == 'w') {
    mvt_courant_G = -1;
  }
  if (t == 's') {
    mvt_courant_G = +1;
  }
}

function toucheRel(t) {
  if (t == 'ArrowUp' || t == 'ArrowDown') {
    mvt_courant_D = 0;
  }
  if (t == 'w' || t == 's') {
    mvt_courant_G = 0;
  }
}