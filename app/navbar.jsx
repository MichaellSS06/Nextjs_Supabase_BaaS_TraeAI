"use client"
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* Navbar */}
        <nav className="fixed w-full top-0 left-0 z-50 bg-black/40 backdrop-blur-md shadow-md">
        <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
               <div className="inset-0 max-h-fit">
                    <Image
                    src="/next.svg" // 👈 ruta desde /public
                    alt="Fondo ISA"
                    width={70}   // tamaño fijo
                    height={70}
                    priority
                    className="object-contain m-0 p-0"
                    />
                </div>
                <span className="text-xl hover:text-blue-900 font-bold tracking-wide text-white inset-0">
                    World Of Training
                </span>
            </Link>
         
            {/* Links Desktop */}
            <div className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-white hover:text-blue-900 transition">Dashboard</Link>
            <Link href="/register" className="text-white hover:text-blue-900 transition">Sign Up</Link>
            <Link href="/login" className="text-white hover:text-blue-900 transition">Log In</Link>
            </div>

            {/* Botón Hamburguesa */}
            <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            >
            {open ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>

        {/* Menú Móvil */}
        {open && (
            <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:hidden bg-white/90 px-6 py-4 flex flex-col gap-4"
            >
                <Link onClick={(e) => {setOpen(!open)}} href="/register" className="hover:text-blue-400 transition">Sign Up</Link>
                <Link onClick={(e) => {setOpen(!open)}} href="/login" className="hover:text-blue-400 transition">Log In</Link>
                <Link onClick={(e) => {setOpen(!open)}} href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            </motion.div>
        )}
        </nav>
        </>
)
}

