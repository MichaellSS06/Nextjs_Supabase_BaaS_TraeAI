"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Paperclip, Smile, Image } from "lucide-react"
import EmojiPicker from 'emoji-picker-react'
import { isPremium } from "@/utils/isPremium"
import { getStickers } from "@/utils/getStickers"

export default function ChatInput({ supabase, roomId, user }) {
  const [text, setText] = useState("")
  const [previewFile, setPreviewFile] = useState(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const [showStickers, setShowStickers] = useState(false)
  const [sending, setSending] = useState(false)
  const [stickers, setStickers] = useState([])

  useEffect(() => {
    const loadStickers = async () => {
      if (!user) return
      const premium = await isPremium(supabase, user.id)
      if (premium) {
        const stickerUrls = await getStickers(supabase)
        setStickers(stickerUrls)
      }
    }
    loadStickers()
  }, [supabase, user])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo no debe superar los 5MB")
      return
    }
    setPreviewFile(file)
    e.target.value = ""
  }

  const sendMessage = async () => {
    if (!roomId || !user) return
    setSending(true)

    try {
      // Subir archivo
      if (previewFile) {
        const fileExt = previewFile.name.split(".").pop()
        const fileName = `${Date.now()}_${user.id}.${fileExt}`
        const filePath = `room_${roomId}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from("chat_attachments")
          .upload(filePath, previewFile)
        
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = await supabase.storage
          .from("chat_attachments")
          .getPublicUrl(filePath)
        
        await supabase.from("chat_messages").insert({
          room_id: roomId,
          user_id: user.id,
          type: previewFile.type.startsWith("image/") ? "image" : "file",
          file_url: publicUrl,
          content: previewFile.name,
        })

        setPreviewFile(null)
      }
      // Mensaje de texto
      else if (text.trim() !== "") {
        await supabase.from("chat_messages").insert({
          room_id: roomId,
          user_id: user.id,
          type: "text",
          content: text.trim(),
        })
        setText("")
      }
    } catch (err) {
      console.error("❌ Error enviando mensaje:", err)
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const sendSticker = async (sticker) => {
    await supabase.from("chat_messages").insert({
      room_id: roomId,
      user_id: user.id,
      type: "sticker",
      file_url: sticker.path,
      content: "sticker"
    })
    setShowStickers(false)
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5 }
  }

  return (
    <div className="border-t p-3 flex flex-col space-y-2 bg-white shadow-sm">
      {previewFile && (
        <div className="p-2 border rounded-lg flex items-center justify-between bg-gray-50">
          {previewFile.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(previewFile)}
              alt="preview"
              className="h-20 rounded"
            />
          ) : (
            <p className="text-sm flex items-center gap-2">
              <Paperclip size={16} />
              {previewFile.name}
            </p>
          )}
          <motion.button
            className="text-red-500 ml-2 p-1 rounded-full hover:bg-red-50"
            onClick={() => setPreviewFile(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✖
          </motion.button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <motion.label 
          className="cursor-pointer p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Paperclip size={20} className="text-gray-500" />
          <input
            type="file"
            hidden
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileSelect}
          />
        </motion.label>

        <motion.button 
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Smile size={20} className="text-gray-500" />
        </motion.button>
        
        <motion.button 
          onClick={() => setShowStickers(!showStickers)}
          className="p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image size={20} className="text-gray-500" />
        </motion.button>

        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <motion.button
          onClick={sendMessage}
          disabled={sending}
          className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-2 rounded-lg flex items-center justify-center"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          animate={sending ? "disabled" : "idle"}
        >
          {sending ? (
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : (
            <Send size={20} />
          )}
        </motion.button>
      </div>

      {showEmoji && (
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 shadow-xl rounded-lg">
            <div className="relative">
              <button 
                onClick={() => setShowEmoji(false)}
                className="z-51 absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
              >
                ✕
              </button>
              <EmojiPicker onEmojiClick={(emoji) => setText(text + emoji.emoji)} height={350} width={350} />
            </div>
          </div>
        )}

      {showStickers && stickers.length > 0 && (
        <div className="absolute bottom-16 z-10 grid grid-cols-4 gap-2 bg-white p-3 border rounded-lg shadow-lg">
          {stickers.map(
            (sticker, i) => (
              <motion.img
                key={i}
                src={sticker.signedUrl}
                className="w-16 h-16 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => sendSticker(sticker)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
