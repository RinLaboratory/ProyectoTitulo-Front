import Link from "next/link";

export default function Custom404() {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <Link href="/">
        <a>Volver a la página de inicio</a>
      </Link>
    </div>
  );
}
