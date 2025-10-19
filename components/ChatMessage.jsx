"use client"

import { useState, useEffect } from "react"

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
    <div className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm mb-2 border border-gray-100 hover:shadow-md transition-all">
      <div className="text-xs font-semibold text-indigo-600 mb-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {username}
      </div>

      {message.type === "text" && (
        <div className="py-1 px-2 bg-white rounded-md text-gray-800 border-l-2 border-indigo-300">
          {message.content}
        </div>
      )}

      {message.type === "image" && (
        <div className="mt-1 bg-white p-2 rounded-md border border-gray-200">
          <img
            src={message.file_url}
            alt="imagen"
            className="max-w-[200px] rounded-md mx-auto shadow-sm hover:shadow-md transition-all"
          />
        </div>
      )}

      {message.type === "file" && (
        <div className="mt-1 bg-blue-50 p-2 rounded-md border border-blue-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <a
            href={message.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {message.content}
          </a>
        </div>
      )}

      {/* Sticker */}
      {message.type === "sticker" && (
        signedUrl ? (
          <div className="mt-1 flex justify-center">
            <img
              src={signedUrl}
              alt="sticker"
              className="w-24 h-24 mx-auto transition-all hover:scale-110 filter drop-shadow-sm"
            />
          </div>
        ) : (
          <div className="text-gray-400 text-sm italic flex items-center justify-center py-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando sticker...
          </div>
        )
      )}

      <div className="text-xs text-gray-400 mt-2 flex items-center justify-end">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {new Date(message.created_at).toLocaleTimeString()}
      </div>
    </div>
  )
}
