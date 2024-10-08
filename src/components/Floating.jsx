// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react"
import axios from "axios" // Import Axios
import { FaRobot } from "react-icons/fa"
import { RxCross2 } from "react-icons/rx"
import { gsap } from "gsap"

const Floating = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const botRef = useRef(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = async () => {
    if (!inputMessage) return

    // Update local messages
    setMessages((prev) => [...prev, { sender: "user", content: inputMessage }])

    try {
      const response = await axios.post("http://localhost:8000/api/chat/", {
        message: inputMessage,
      })
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: formatBotResponse(response.data.message) },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setInputMessage("") // Clear input
    }
  }

  const formatBotResponse = (response) => {
    // Format the response to add HTML for bold and line breaks
    return response
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />")
  }

  useEffect(() => {
    const bounceAnimation = (element) => {
      gsap.fromTo(
        element,
        { y: -8 },
        {
          y: 0,
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "bounce.out",
        }
      )
    }

    if (botRef.current) bounceAnimation(botRef.current)
  }, [])

  return (
    <>
      <div className="fixed bottom-14 right-32 z-50">
        <button
          ref={botRef}
          onClick={toggleChat}
          className="bg-primary text-white p-4 rounded-full shadow-lg focus:outline-none"
        >
          <FaRobot className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[40rem] h-[40rem] bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chatbot</h2>
              <RxCross2
                onClick={toggleChat}
                className="w-5 h-5 text-red-500 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "bot" ? "text-blue-500" : "text-black"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:border-primary text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary p-3 rounded text-white hover:bg-primaryHover"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Floating
