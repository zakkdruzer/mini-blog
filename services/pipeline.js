// services/pipeline.js
import { Feed } from './Feed.js'; // si necesitas tipos, pero no es obligatorio para las funciones

export const validarPublicacion = pub =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (!pub.contenido || pub.contenido.trim() === '') {
        reject(new Error('Contenido vacío'));
      } else {
        resolve(pub);
      }
    }, 200)
  );

export const moderarContenido = pub =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (pub.contenido.toLowerCase().includes('spam')) {
        reject(new Error('Contenido marcado como spam'));
      } else {
        resolve({ pub, aprobado: true });
      }
    }, 300)
  );

export const guardarEnFeed = (ctx, feed) =>
  new Promise(resolve =>
    setTimeout(() => {
      const { pub } = ctx;
      feed.publicar(pub);
      resolve(feed);
    }, 150)
  );