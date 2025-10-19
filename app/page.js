"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen">
      <section className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            App de Entrenamiento
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            Tu compañero perfecto para alcanzar tus metas fitness y mantener un estilo de vida saludable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-10 rounded-xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/gym.JPG"
            alt="Entrenamiento"
            width={400}
            height={300}
            priority
            className="object-cover"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Iniciar Sesión
            </motion.button>
          </Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-50 border border-indigo-200 transition-colors"
            >
              Registrarse
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
