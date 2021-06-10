/* gamelib
librairie JS pour création "facile" de jeu HTML

historique:
0.1 - 05.05.2021 1ère version fonctionnelle
0.2 - 10.06.2021 listener pour souris (definirFonctionSourisBougee & definirFonctionSourisClic)

TODO:
- mise à l'échelle

x. dutoit
*/

// initialisation
window.onload = function () {
  GL.messageDebug('initialisation gamelib', 0);

  // récupération du canvas
  GL.cnv = document.getElementById('cnv_jeu_gl');
  if (GL.cnv) {
    GL.cnv_dim = [GL.cnv.width, GL.cnv.height];
    if (GL.cnv.getContext) {
      GL.ctx = GL.cnv.getContext('2d');
    }
    else {
      console.error('canvas pas supporté');

    }
  }
  else {
    console.error('canvas cnv_jeu introuvable dans la page');
  }

  // listener du bouton demmarer
  let bouton = document.getElementById('btn_demarrer');
  if (bouton) {
    if (typeof step == 'function') {
      bouton.addEventListener('click', GL.demarrer);
    }
    else {
      console.error('fonction step introuvable');
    }
  }
  else {
    console.warn('objet btn_demarrer introuvable dans la page');
  }

  // appel de la fonction init
  if (typeof init == 'function') {
    GL.messageDebug('appel de la fonction init', 0);
    init();
  }
  else {
    console.warn('pas de fonction init');
  }
}

let GL = {
  // constantes
  STATE_STOP: 0,
  STATE_PLAY: 1,

  // variables
  cnv: false, // canvas
  ctx: false, // contexte 2D du canvas
  cnv_dim: false,
  state: 0, // état du jeu (en cours / arrêté)
  timer: false, // object setInterval
  timer_interval: 10, // durée d'une itération [ms]
  element: [], // tableau des éléments du jeu
  debugLevel: 99,

  // inclure images
  inclure: function (id, id_img) {
    /* inclut l'image id_img dans la liste des éléments, avec l'id id */
    this.messageDebug('fct inclure: inclusion de l\'élément ' + id + ' (image: ' + id_img + ')', 1);
    let img = document.getElementById(id_img);
    if (img) {
      let el = { id: id, id_img: id_img, img: img, x: 0, y: 0, a: 0, w: img.width, h: img.height, bb_radius: Math.sqrt(img.width * img.width + img.height * img.height) };
      this.element.push(el);
      this.messageDebug('élément ' + id + ' ajouté (image ' + id_img + ')', 1);
    }
    else {
      console.error('fct inclure: image ' + id_img + ' introuvable dans la page');
    }
  },

  clone: function (id, new_id) { // à tester
    let el = this.getElem(id);
    if (el) {
      this.element.push({ id: el.id, id_img: el.id_img, img: el.img, x: el.x, y: el.y, a: el.a, w: el.w, h: el.h });
      this.messageDebug('fct clone: clonage de l\'élément ' + id + ' en ' + new_id, 1);
    }
  },

  // position
  setXY: function (id, x, y) {
    /* positionne l'élément id à (x;y) */
    let el = this.getElem(id);
    if (el) {
      el.x = x;
      el.y = y;
      this.messageDebug('fct setXY: élément ' + id + ' positionné à (' + x + ',' + y + ')', 3);
      return el;
    }
  },

  setX: function (id, x) {
    let el = this.getElem(id);
    if (el) {
      el.x = x;
      this.messageDebug('fct setX: élément ' + id + ' positionné à x=' + x, 3);
    }
  },
  setY: function (id, y) {
    let el = this.getElem(id);
    if (el) {
      el.y = y;
      this.messageDebug('fct setY: élément ' + id + ' positionné à y=' + y, 3);
    }
  },

  setAngle: function (id, a) {
    /* applique l'angle a (en degrés) à l'élément id */
    let el = this.getElem(id);
    if (el) {
      el.a = a;
      this.messageDebug('fct setAngle: élément ' + id + ' a un angle de ' + a + ' degrés', 3);
    }
  },

  addX: function (id, dx) {
    let el = this.getElem(id);
    if (el) {
      el.x += dx;
      this.messageDebug('fct addX: ajout de ' + dx + ' à l\'axe x de l\'élément ' + id, 3);
    }
  },

  addY: function (id, dy) {
    let el = this.getElem(id);
    if (el) {
      el.y += dy;
      this.messageDebug('fct addY: ajout de ' + dy + ' à l\'axe y de l\'élément ' + id, 3);
    }
  },

  addXY: function (id, dx, dy) {
    let el = this.getElem(id);
    if (el) {
      el.x += dx;
      el.y += dy;
      this.messageDebug('fct addXY: ajout de ' + dx + ' à l\'axe x et de ' + dy + ' à l\'axe y de l\'élément ' + id, 3);
    }
  },

  addAngle: function (id, da) {
    let el = this.getElem(id);
    if (el) {
      el.a += da;
      this.messageDebug('fct addAngle: ajout de ' + da + ' degrés à l\'élément ' + id, 3);
    }
  },

  getX: function (id) {
    let el = this.getElem(id);
    if (el) {
      return el.x;
    }
    return false;
  },

  getY: function (id) {
    let el = this.getElem(id);
    if (el) {
      return el.y;
    }
    return false;
  },

  getAngle: function (id) {
    let el = this.getElem(id);
    if (el) {
      return el.a;
    }
    return false;
  },

  collisionMurGauche: function (id) {
    let el = this.getElem(id);
    if (el) {
      if (el.x - el.bb_radius < 0) {
        // vérifier 4 coins
        let corners = this.calculerCoins(id);
        if (corners[0].x < 0 || corners[1].x < 0 || corners[2].x < 0 || corners[3].x < 0) {
          return true;
        }
      }
      return false;
    }
  },

  collisionMurDroite: function (id) {
    let el = this.getElem(id);
    if (el) {
      if (el.x + el.bb_radius > this.cnv_dim[0]) {
        // vérifier 4 coins
        let corners = this.calculerCoins(id);
        if (corners[0].x > this.cnv_dim[0] || corners[1].x > this.cnv_dim[0] || corners[2].x > this.cnv_dim[0] || corners[3].x > this.cnv_dim[0]) {
          return true;
        }
      }
      return false;
    }
  },

  collisionMurHaut: function (id) {
    let el = this.getElem(id);
    if (el) {
      if (el.y - el.bb_radius < 0) {
        // vérifier 4 coins
        let corners = this.calculerCoins(id);
        if (corners[0].y < 0 || corners[1].y < 0 || corners[2].y < 0 || corners[3].y < 0) {
          return true;
        }
      }
      return false;
    }
  },

  collisionMurBas: function (id) {
    let el = this.getElem(id);
    if (el) {

      if (el.y + el.bb_radius > this.cnv_dim[1]) {
        // vérifier 4 coins
        let corners = this.calculerCoins(id);
        if (corners[0].y > this.cnv_dim[1] || corners[1].y > this.cnv_dim[1] || corners[2].y > this.cnv_dim[1] || corners[3].y > this.cnv_dim[1]) {
          return true;
        }
      }
      return false;
    }
  },

  collision: function (id1, id2) {
    let el1 = this.getElem(id1);
    let el2 = this.getElem(id2);
    if (el1 && el2) {
      // axe X:
      if (el1.x + el1.bb_radius >= el2.x - el2.bb_radius && el1.x - el1.bb_radius <= el2.x + el2.bb_radius) {
        // axe Y:
        if (el1.y + el1.bb_radius >= el2.y - el2.bb_radius && el1.y - el1.bb_radius <= el2.y + el2.bb_radius) {
          // collision des BBs --> vérifier 'vraie' collision
          // coins de el1
          let corners1 = this.calculerCoins(id1);
          let ox1 = { x: corners1[1].x - corners1[0].x, y: corners1[1].y - corners1[0].y }; // ox: vecteur de coin 0 à 1
          let oy1 = { x: corners1[3].x - corners1[0].x, y: corners1[3].y - corners1[0].y }; // oy: vecteur de coin 0 à 3
          let corners2 = this.calculerCoins(id2);
          let ox2 = { x: corners2[1].x - corners2[0].x, y: corners2[1].y - corners2[0].y }; // ox: vecteur de coin 0 à 1
          let oy2 = { x: corners2[3].x - corners2[0].x, y: corners2[3].y - corners2[0].y }; // oy: vecteur de coin 0 à 3
          // coin de 2 dans el1 ?
          for (var i = 0; i < 4; i++) {
            let op = { x: corners2[i].x - corners1[0].x, y: corners2[i].y - corners1[0].y };
            let proj1 = this.calculerProj(op, ox1);
            let proj2 = this.calculerProj(op, oy1);
            if (0 <= proj1 && proj1 <= 1 && 0 <= proj2 && proj2 <= 1) {
              return true;
            }
          }
          // coin de 1 dans el2 ?
          for (var i = 0; i < 4; i++) {
            let op = { x: corners1[i].x - corners2[0].x, y: corners1[i].y - corners2[0].y };
            let proj1 = this.calculerProj(op, ox2);
            let proj2 = this.calculerProj(op, oy2);
            if (0 <= proj1 && proj1 <= 1 && 0 <= proj2 && proj2 <= 1) {
              return true;
            }
          }


          //return (el1.x-el2.x)*(el1.x-el2.x)+(el1.y-el2.y)*(el1.y-el2.y) < (el1.bb_radius*el1.bb_radius+el2.bb_radius*el2.bb_radius);
          // // TODO:
        }
      }
      return false;
    }
  },

  // dessiner un élément
  dessiner: function (id) {
    this.messageDebug('fct dessiner: dessin de l\'élément ' + id, 2);
    let el = this.getElem(id);
    let el_ang_rad = el.a * 0.017453292519943295; // Math.PI/180
    let cos_ang = Math.cos(el_ang_rad);
    let sin_ang = Math.sin(el_ang_rad);

    this.ctx.save();

    this.ctx.translate(el.x, el.y); // (x,y)
    this.ctx.rotate(el_ang_rad);	// angle
    this.ctx.drawImage(el.img, -el.w / 2, -el.h / 2); // (x,y) au MILIEU de l'élément

    this.ctx.restore();
  },

  dessinerTout: function () {
    this.messageDebug('fct dessinerTout: dessin de tous les éléments', 2);
    for (var e in this.element) {
      this.dessiner(this.element[e].id);
    }
  },

  effacerTout: function () {
    this.messageDebug('fct effacerTout: effacement de tout le canevas', 2);
    this.ctx.save();

    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.cnv_dim[0], this.cnv_dim[1]);

    this.ctx.restore();
  },

  ecrireTexte: function (txt, posx, posy, fontsize, align) {
    this.messageDebug('fct ecrireTexte: écriture de ' + txt, 2);
    fontsize = fontsize || 20;
    align = align || 'left';

    this.ctx.save();

    this.ctx.textAlign = align;
    this.ctx.font = fontsize + 'px sans-serif';
    this.ctx.fillText(txt, posx, posy);

    this.ctx.restore();
  },

  // démarrage du jeu
  demarrer: function () {
    if (GL.state == GL.STATE_STOP) {
      // démarrage du timer
      GL.messageDebug('démarrage du jeu', 0);
      GL.timer = setInterval(step, GL.timer_interval);
      document.getElementById('btn_demarrer').innerHTML = 'Arrêter';
      GL.state = GL.STATE_PLAY;
    }
    else {
      // arrêt du timer
      GL.messageDebug('arrêt du jeu', 0);
      clearInterval(GL.timer);
      document.getElementById('btn_demarrer').innerHTML = 'Démarrer';
      GL.state = GL.STATE_STOP;
    }
  },

  arreter: function () {
    GL.messageDebug('fct arreter: arrêt du jeu', 0);
    clearInterval(GL.timer);
    document.getElementById('btn_demarrer').innerHTML = 'Démarrer';
    GL.state = GL.STATE_STOP;
  },

  setDureeIntervalle: function (d) {
    this.messageDebug('fct setDureeIntervalle: met l\'intervalle à ' + d + ' millisecondes', 0);
    this.timer_interval = d;
  },

  // key listener
  definirFonctionToucheEnfoncee: function (fct_key) {
    if (typeof fct_key == 'function') {
      this.messageDebug('fct definirFonctionToucheEnfoncee: une touche enfoncée appelle la fonction ' + fct_key.name, 0)
      document.addEventListener('keydown', function (ev) {
        GL.messageDebug('appel de la fonction ' + fct_key.name + ' (touche=' + ev.key + ')', 3);
        fct_key(ev.key);
      });
    }
    else {
      console.error('fct definirFonctionToucheEnfoncee: la fonction ' + fct_key.name + ' n\'existe pas (et ne peut donc pas être appelée si on enfonce une touche)');
    }

  },
  definirFonctionToucheRelachee: function (fct_key) {
    if (typeof fct_key == 'function') {
      this.messageDebug('fct definirFonctionToucheRelachee: une touche relâchée appelle la fonction ' + fct_key.name, 0)
      document.addEventListener('keyup', function (ev) {
        GL.messageDebug('appel de la fonction ' + fct_key.name + ' (touche=' + ev.key + ')', 3);
        fct_key(ev.key);
      });
    }
    else {
      console.error('fct definirFonctionToucheRelachee: la fonction ' + fct_key.name + ' n\'existe pas (et ne peut donc pas être appelée si on relâche une touche)');
    }
  },

  // mouse listener
  definirFonctionSourisBougee: function (fct_mouse) {
    if (typeof fct_mouse == 'function') {
      this.messageDebug('fct definirFonctionSourisBougee: un mouvement de la souris appelle la fonction ' + fct_mouse.name, 0)
      this.cnv.addEventListener('mousemove', function (ev) {
        GL.messageDebug('appel de la fonction ' + fct_mouse.name + ' (coordonnnées: x=' + ev.offsetX + ';y=' + ev.offsetY + ')', 4);
        fct_mouse(ev.offsetX, ev.offsetY);
      });
    }
    else {
      console.error('fct definirFonctionSourisBougee: la fonction ' + fct_mouse.name + ' n\'existe pas (et ne peut donc pas être appelée si on bouge la souris)');
    }

  },

  definirFonctionSourisClic: function (fct_mouse) {
    if (typeof fct_mouse == 'function') {
      this.messageDebug('fct definirFonctionSourisClic: un clic gauche de la souris appelle la fonction ' + fct_mouse.name, 0)
      this.cnv.addEventListener('click', function (ev) {
        GL.messageDebug('appel de la fonction ' + fct_mouse.name + ' (coordonnnées: x=' + ev.offsetX + ';y=' + ev.offsetY + ')', 4);
        fct_mouse(ev.offsetX, ev.offsetY);
      });
    }
    else {
      console.error('fct definirFonctionSourisClic: la fonction ' + fct_mouse.name + ' n\'existe pas (et ne peut donc pas être appelée si on bouge la souris)');
    }

  },

  setDebugLevel: function (lvl) {
    // met le debugLevel à lvl
    /* signification des niveaux de message:
    0 - fonctionnnement général de la librairie (initialisation, démarrage, ajout de listener)
    1 - inclusion d'élément
    2 - dessin
    3 - mouvement d'éléments, appel de fonctions
    4 - mouvement de souris
    */
    this.debugLevel = lvl;
  },

  // messages debug
  messageDebug: function (msg, lvl) {
    // affiche msg à la console si lvl <= debugLevel
    if (lvl <= this.debugLevel) {
      console.log(msg);
    }
  },

  // utilitaires
  getElem: function (id) {
    for (var e = 0; e < this.element.length; e++) {
      if (this.element[e].id == id) {
        return this.element[e];
      }
    }
    console.error('élément ' + id + ' inexistant');
    return false;
  },

  calculerCoins: function (id) {
    // calcule les coordonnées des 4 coins (sens antihoraire)
    let el = this.getElem(id);
    let el_ang_rad = el.a * 0.017453292519943295; // Math.PI/180
    let cos_ang = Math.cos(el_ang_rad);
    let sin_ang = Math.sin(el_ang_rad);

    let x1 = el.x - el.w / 2 * cos_ang - el.h / 2 * sin_ang;
    let y1 = el.y - el.w / 2 * sin_ang + el.h / 2 * cos_ang;

    let x2 = el.x + el.w / 2 * cos_ang - el.h / 2 * sin_ang;
    let y2 = el.y + el.w / 2 * sin_ang + el.h / 2 * cos_ang;

    let x3 = el.x + el.w / 2 * cos_ang + el.h / 2 * sin_ang;
    let y3 = el.y + el.w / 2 * sin_ang - el.h / 2 * cos_ang;

    let x4 = el.x - el.w / 2 * cos_ang + el.h / 2 * sin_ang;
    let y4 = el.y - el.w / 2 * sin_ang - el.h / 2 * cos_ang;

    return [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }];
  },

  calculerProj: function (a, b) {
    // calcule la longueur de la projection de a sur b divisée par la norme carrée de b
    return (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
  }
}
