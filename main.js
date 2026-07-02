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

console.log("%cEtapa 3 · Feed — Map de publicaciones + Set de hashtags", "font-weight: bold; color: green; font-size: 15px;");
console.log("")

class Feed {
  #publicaciones = new Map();
  #hashtags      = new Set();

  publicar(publicacion) {
    this.#publicaciones.set(publicacion.id, publicacion);
    publicacion.hashtags.forEach(tag => this.#hashtags.add(tag));
    return this;
  }

  buscarPorId(id) {
    const pub = this.#publicaciones.get(id);  // puede ser objeto o undefined
    return pub ?? null;                       // si es undefined, devuelve null
  }

  porHashtag(tag) {
    const publicaciones = [...this.#publicaciones.values()];
    return publicaciones.filter(p => p.hashtags.includes(tag));
  }

  get totalLikes() {
    const publicaciones = [...this.#publicaciones.values()];
    return publicaciones.reduce((acumulador, pub) => acumulador + pub.likes, 0);
  }

  get masPopulares() {
    const publicaciones = [...this.#publicaciones.values()];
    return publicaciones.sort((a, b) => b.likes - a.likes);
  }

  trending(n = 5) {
  const counter = new Map();

  const publicaciones = [...this.#publicaciones.values()];
  publicaciones.forEach(pub => {
    pub.hashtags.forEach(tag => {
      const actual = counter.get(tag) || 0;
      counter.set(tag, actual + 1);
    });
  });

  const ordenados = [...counter.entries()].sort((a, b) => b[1] - a[1]);
  return ordenados.slice(0, n);
  }

  get hashtags() { return [...this.#hashtags]; }
  get total()    { return this.#publicaciones.size; }
}

// Prueba (asume que Publicacion ya está definida)
const feed = new Feed();
const posts = [
  new Publicacion({ autor: 'juanpa', contenido: 'Aprendí Set y Map hoy', hashtags: ['js', 'es6'] }),
  new Publicacion({ autor: 'maria',  contenido: 'Primer proyecto con clases',  hashtags: ['poo', 'js'] }),
  new Publicacion({ autor: 'carlos', contenido: 'Las Promises me cambiaron la vida', hashtags: ['js', 'async'] }),
  new Publicacion({ autor: 'ana',    contenido: 'ES6 es una maravilla total',  hashtags: ['es6', 'tips'] }),
];

posts[0].darLike().darLike().darLike();
posts[2].darLike().darLike();
posts.forEach(p => feed.publicar(p));

console.log('Total posts:',   feed.total);
console.log('Hashtags únicos:', feed.hashtags);
console.log('Total likes:',    feed.totalLikes);    // 5
console.log('Más popular:',    feed.masPopulares[0].toString());
console.log('Por #js:',        feed.porHashtag('js').map(p => p.autor));
console.log('Trending:',       feed.trending(3));  // [['js',3],['es6',2],['poo',1]]

console.log("")

console.log("%cEtapa 4 · Usuario — Set de seguidores y mutualidades", "font-weight: bold; color: green; font-size: 15px;");
console.log("")

class Usuario {
  #seguidores = new Set();
  #siguiendo  = new Set();

  constructor({ nombre, username, bio = '' }) {
    this.nombre   = nombre;
    this.username = username;
    this.bio      = bio;
  }

  seguir(otroUsuario) {
    if (otroUsuario.username === this.username)
      throw new Error('No puedes seguirte a ti mismo');
    this.#siguiendo.add(otroUsuario.username);      // este usuario sigue al otro
    otroUsuario.#seguidores.add(this.username);     // el otro gana un seguidor
    return this;
  }

  dejarDeSeguir(otroUsuario) {
    this.#siguiendo.delete(otroUsuario.username);  // lo quita de la lista de siguiendo
    otroUsuario.#seguidores.delete(this.username); // quita este usuario de sus seguidores
    return this;
  }

  mutualidades(otroUsuario) {
    return [...this.#siguiendo].filter(u => otroUsuario.#siguiendo.has(u));
  }

  get seguidores()   { return this.#seguidores.size; }
  get siguiendo()    { return this.#siguiendo.size; }
  get esInfluencer() { return this.seguidores > 2; }

  toString() {
    return `@${this.username} | ${this.seguidores} seguidores · ${this.siguiendo} siguiendo`;
  }
}

// Prueba
const [juanpa, maria, carlos, ana] = [
  new Usuario({ nombre: 'Juan Pablo', username: 'juanpa' }),
  new Usuario({ nombre: 'María',      username: 'maria'  }),
  new Usuario({ nombre: 'Carlos',     username: 'carlos' }),
  new Usuario({ nombre: 'Ana',        username: 'ana'    }),
];

juanpa.seguir(maria).seguir(carlos).seguir(ana);
maria.seguir(juanpa).seguir(carlos);
carlos.seguir(ana);

console.log(juanpa.toString());
console.log(maria.toString());
console.log('Mutualidades juanpa-maria:', juanpa.mutualidades(maria));  // ['carlos']
console.log('¿juanpa es influencer?', juanpa.esInfluencer);             // false (0 seguidores)
console.log('¿maria es influencer?',  maria.esInfluencer);              // false

try {
  juanpa.seguir(juanpa);  // debe lanzar Error
} catch(e) {
  console.log('✅ Error esperado:', e.message);
}

console.log("")