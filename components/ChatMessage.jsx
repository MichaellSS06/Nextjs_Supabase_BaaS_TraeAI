"use client"

import { useEffect, useState } from "react"

export default function ChatMessage({ message, username,supabase }) {
  //console.log(message)
  const [signedUrl, setSignedUrl] = useState(null)

    useEffect(() => {
      const getSignedStickerUrl = async (path) => {
        const { data, error } = await supabase.storage
          .from("stickers_premium")
          .createSignedUrl(path, 60 * 60) // 1 hora
        if (error) {
          console.error("Error creando signed URL:", error)
          return null
        }
        return data.signedUrl
      }

      const fetchStickerUrl = async () => {
        if (message.type === "sticker" && message.file_url) {
          const url = await getSignedStickerUrl(message.file_url)
          setSignedUrl(url)
        }
      }

      fetchStickerUrl()
    }, [message, supabase])

  return (
    <div className="p-2 bg-gray-50 rounded">
      <div className="text-xs text-gray-500">{username}</div>

      {message.type === "text" && <div>{message.content}</div>}

      {message.type === "image" && (
        <img
          src={message.file_url}
          alt="imagen"
          className="max-w-[200px] rounded mx-auto"
        />
      )}

      {message.type === "file" && (
        <a
          href={message.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          📎 {message.content}
        </a>
      )}

      {/* Sticker */}
      {message.type === "sticker" && (
        signedUrl ? (
          <img
            src={signedUrl}
            alt="sticker"
            className="w-20 h-20 mx-auto transition-transform hover:scale-105"
          />
        ) : (
          <div className="text-gray-400 text-sm italic">Cargando sticker...</div>
        )
      )}

      <div className="text-xs text-gray-400">
        {new Date(message.created_at).toLocaleTimeString()}
      </div>
    </div>
  )
}
