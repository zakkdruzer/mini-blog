// services/Feed.js
export class Feed {
  #publicaciones = new Map();
  #hashtags      = new Set();

  publicar(publicacion) {
    this.#publicaciones.set(publicacion.id, publicacion);
    publicacion.hashtags.forEach(tag => this.#hashtags.add(tag));
    return this;
  }

  buscarPorId(id) {
    const pub = this.#publicaciones.get(id);
    return pub ?? null;
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