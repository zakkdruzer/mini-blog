//import { MiniBlog } from './MiniBlog.js';

//const blog = new MiniBlog();

console.log("%cEtapa 1 · Clase Publicacion — el modelo base", "font-weight: bold; color: green; font-size: 15px;");
console.log("")

class Publicacion {
  static #nextId = 1;
  #id;
  #likes;

  constructor({ autor, contenido, hashtags = [] }) {
    this.#id = Publicacion.#nextId;
    Publicacion.#nextId++;

    this.autor = autor;
    this.contenido = contenido;
    this.hashtags = hashtags;

    this.#likes = 0;
  }

  get id() {
  return this.#id;
  }

  get likes() {
  return this.#likes;
  }

  get extracto() {
  if (this.contenido.length <= 60) {
    return this.contenido;
    }
  return this.contenido.slice(0, 60) + '…';
  }

  darLike(){
    this.#likes += 1;
    return this
  }

  toString() {
    return `[@${this.autor}] "${this.extracto}" | ${this.likes} likes`;
  }

  toJSON() {
  return {
    id: this.id,
    autor: this.autor,
    contenido: this.contenido,
    hashtags: this.hashtags,
    likes: this.likes
    };
  }
}

// Prueba
const p1 = new Publicacion({ autor: 'juanpa', contenido: 'JavaScript es increíble, cada día aprendo algo nuevo y me sorprende lo poderoso que es', hashtags: ['js', 'dev'] });
const p2 = new Publicacion({ autor: 'maria',  contenido: 'Hoy terminé mi primer proyecto con POO', hashtags: ['poo', 'logro'] });

console.log(p1.toString());
console.log(p2.toString());
console.log('IDs:', p1.id, p2.id);           // esperado: 1 2
p1.darLike().darLike().darLike();
console.log('Likes p1:', p1.likes);         // esperado: 3
console.log(JSON.stringify(p1.toJSON()));

console.log("");

console.log("%cEtapa 2 · Herencia — PublicacionDestacada", "font-weight: bold; color: green; font-size: 15px;");
console.log("")

class PublicacionDestacada extends Publicacion {
  constructor({ patrocinador, categoria, vigente = true, ...resto }) {
    super(resto);  // autor, contenido, hashtags van al padre

    this.patrocinador = patrocinador;
    this.categoria = categoria;
    this.vigente = vigente;
  }

  desactivar(){
    this.vigente = false;
    return this
  }

  toString() {
  const base = super.toString();
  return `⭐ [${this.categoria}] (@${this.patrocinador}) ${base}`;
  }

}

// Prueba
const dest = new PublicacionDestacada({
  autor: 'redaccion',
  contenido: '5 razones para aprender JavaScript en 2026',
  hashtags: ['js', 'tips'],
  patrocinador: 'TalentoDigital',
  categoria: 'TECH'
});

console.log(dest.toString());
dest.darLike().darLike();
console.log('Likes:', dest.likes);
console.log('¿Es Publicacion?', dest instanceof Publicacion);  // true
dest.desactivar();
console.log('Vigente:', dest.vigente);  // false

console.log("")