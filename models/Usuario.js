// models/Usuario.js
export class Usuario {
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

    this.#siguiendo.add(otroUsuario.username);
    otroUsuario.#seguidores.add(this.username);
    return this;
  }

  dejarDeSeguir(otroUsuario) {
    this.#siguiendo.delete(otroUsuario.username);
    otroUsuario.#seguidores.delete(this.username);
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