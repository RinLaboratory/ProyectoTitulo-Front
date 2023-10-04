// 404.js
import Link from 'next/link';

function Custom404() {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <Link href="/" legacyBehavior>
        <a>Volver a la página de inicio</a>
      </Link>
    </div>
  );
}

export default Custom404;