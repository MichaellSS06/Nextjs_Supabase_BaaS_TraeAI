"use client"

export default function ChatMessage({ message, username }) {
  return (
    <div className="p-2 bg-gray-50 rounded">
      <div className="text-xs text-gray-500">{username}</div>

      {message.type === "text" && <div>{message.content}</div>}

      {message.type === "image" && (
        <img
          src={message.file_url}
          alt="imagen"
          className="max-w-[200px] rounded"
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

      {message.type === "sticker" && (
        <img
          src={message.file_url}
          alt="sticker"
          className="w-20 h-20"
        />
      )}

      <div className="text-xs text-gray-400">
        {new Date(message.created_at).toLocaleTimeString()}
      </div>
    </div>
  )
}
