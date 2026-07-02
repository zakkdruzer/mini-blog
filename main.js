// main.js
import { MiniBlog } from './MiniBlog.js';

console.log("%cEtapa final · Sistema completo MiniBlog", "font-weight: bold; color: green; font-size: 15px;");

const blog = new MiniBlog();

// Registrar usuarios
const u1 = blog.registrar({ nombre: 'Juan Pablo', username: 'juanpa', bio: 'Dev aprendiendo JS' });
const u2 = blog.registrar({ nombre: 'María',      username: 'maria'  });
const u3 = blog.registrar({ nombre: 'Carlos',     username: 'carlos' });

// Conectar
blog.conectar('juanpa', 'maria');
blog.conectar('maria',  'carlos');

// Publicar posts
blog.publicarPost('juanpa', { contenido: 'Map y Set son increíbles para estructuras de datos', hashtags: ['js', 'es6'] })
  .then(() => blog.publicarPost('maria', { contenido: 'Terminé el ejercicio de Promises', hashtags: ['logro', 'js'] }))
  .then(() => blog.publicarPost('carlos', { contenido: 'La herencia en POO me costó pero lo entendí', hashtags: ['poo', 'logro'] }))
  .then(() => {
    const { totalUsuarios, totalPosts, totalLikes, trending } = blog.estadisticas;
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━
  MiniBlog · Estadísticas
━━━━━━━━━━━━━━━━━━━━━━━━━━
  Usuarios:  ${totalUsuarios}
  Posts:     ${totalPosts}
  Likes:     ${totalLikes}
  Trending:  ${trending.map(([t]) => '#'+t).join(', ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    console.log('Posts con #js:', blog.explorar('js').map(p => p.extracto));
    console.log('Seguidores de juanpa:', u1.seguidores);
  })
  .catch(e => console.log('❌', e.message));