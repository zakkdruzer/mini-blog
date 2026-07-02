// MiniBlog.js
import { Publicacion }      from './models/Publicacion.js';
import { Usuario }          from './models/Usuario.js';
import { Feed }             from './services/Feed.js';
import { validarPublicacion,
         moderarContenido,
         guardarEnFeed }    from './services/pipeline.js';

export class MiniBlog {
  #feed     = new Feed();
  #usuarios = new Map();

  registrar(datosUsuario) {
    const { username } = datosUsuario;
    if (this.#usuarios.has(username)) {
      throw new Error('Username ya registrado');
    }

    const usuario = new Usuario(datosUsuario);
    this.#usuarios.set(username, usuario);
    return usuario;
  }

  publicarPost(username, datosPost) {
    const usuario = this.#usuarios.get(username);
    if (!usuario) {
      return Promise.reject(new Error('Usuario no encontrado'));
    }

    const pub = new Publicacion({ autor: username, ...datosPost });

    return validarPublicacion(pub)
      .then(moderarContenido)
      .then(ctx => guardarEnFeed(ctx, this.#feed));
  }

  conectar(usernameA, usernameB) {
    const uA = this.#usuarios.get(usernameA);
    const uB = this.#usuarios.get(usernameB);
    if (!uA || !uB) {
      throw new Error('Usuario no encontrado en conectar');
    }

    uA.seguir(uB);
    uB.seguir(uA);
    return this;
  }

  explorar(hashtag) {
    return this.#feed.porHashtag(hashtag);
  }

  get estadisticas() {
    return {
      totalUsuarios: this.#usuarios.size,
      totalPosts:    this.#feed.total,
      totalLikes:    this.#feed.totalLikes,
      trending:      this.#feed.trending(3),
    };
  }

  daLike(username, postId) {
    try {
      const usuario = this.#usuarios.get(username);
      if (!usuario) throw new Error('Usuario no encontrado');

      const post = this.#feed.buscarPorId(postId);
      if (!post) throw new Error('Post no encontrado');

      post.darLike();
      return post.likes;
    } catch (e) {
      console.error('Error al dar like:', e.message);
      return null;
    }
  }
}