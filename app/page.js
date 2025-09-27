import Image from "next/image";

export default function Home() {
  return (
        <main className="p-6">
      <h1 className="text-2xl font-bold">App de Entrenamiento</h1>
      <a href="/login" className="text-blue-600 underline">
        Ir a Login
      </a>
    </main>

  );
}
