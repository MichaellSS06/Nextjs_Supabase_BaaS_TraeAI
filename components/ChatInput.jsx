"use client"
import { useState, useEffect } from "react"
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
      console.log(premium)
      if (premium) {
        const stickerUrls = await getStickers(supabase)
        console.log("Stickers obtenidos:", stickerUrls)
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

  const sendSticker = async (stickerUrl) => {
    console.log(stickerUrl)
    await supabase.from("chat_messages").insert({
      room_id: roomId,
      user_id: user.id,
      type: "sticker",
      file_url: stickerUrl,
      content: "sticker"
    })
    setShowStickers(false)
  }

  return (
    <div className="border-t p-2 flex flex-col space-y-2 bg-white">
      {previewFile && (
        <div className="p-2 border rounded-lg flex items-center justify-between">
          {previewFile.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(previewFile)}
              alt="preview"
              className="h-20 rounded"
            />
          ) : (
            <p className="text-sm">{previewFile.name}</p>
          )}
          <button
            className="text-red-500 ml-2"
            onClick={() => setPreviewFile(null)}
          >
            ✖
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          📎
          <input
            type="file"
            hidden
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileSelect}
          />
        </label>

        <button onClick={() => setShowEmoji(!showEmoji)}>😀</button>
        <button onClick={() => setShowStickers(!showStickers)}>🖼️</button>

        <input
          type="text"
          className="flex-1 border rounded-lg px-2 py-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={sending}
          className="bg-blue-600 text-white px-3 rounded"
        >
          {sending ? "..." : "Enviar"}
        </button>
      </div>

      {showEmoji && (
        <div className="absolute bottom-16">
          <EmojiPicker onEmojiClick={(emoji) => setText(text + emoji.emoji)} />
        </div>
      )}

      {showStickers && stickers.length > 0 && (
        <div className="absolute bottom-16 grid grid-cols-4 gap-2 bg-white p-2 border rounded-lg">
          {stickers.map(
            (sticker, i) => (
              <img
                key={i}
                src={sticker}
                className="w-16 h-16 cursor-pointer"
                onClick={() => sendSticker(sticker)}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
