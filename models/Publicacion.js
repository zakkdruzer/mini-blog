// models/Publicacion.js
export class Publicacion {
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

  get id()       { return this.#id; }
  get likes()    { return this.#likes; }
  get extracto() {
    if (this.contenido.length <= 60) {
      return this.contenido;
    }
    return this.contenido.slice(0, 60) + '…';
  }

  darLike() {
    this.#likes++;
    return this;
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