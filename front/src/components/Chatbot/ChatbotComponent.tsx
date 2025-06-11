'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import mock_products from '@/utils/mock_products';

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente virtual de Arcana. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `Sos el asistente virtual de Arcana, un sitio e-commerce esotérico. Respondé con calidez, precisión y de forma profesional. Nunca inventes productos.

Estos son los productos disponibles:
${mock_products
  .map(p => `Nombre: ${p.name}, Categoría: ${p.category}, Precio: ${p.price}`)
  .join('\n')}
`,
            },
            ...newMessages,
          ],
        }),
      });

      const data = await response.json();
      const botReply = data?.choices?.[0]?.message?.content;

      if (botReply) {
        setMessages([...newMessages, { role: 'assistant', content: botReply }]);
      } else {
        throw new Error('Respuesta inválida del bot');
      }
    } catch (error) {
      console.error('Error al obtener respuesta del bot:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Ocurrió un error al intentar responder. Intenta de nuevo más tarde.',
        },
      ]);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Abrir chatbot"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[350px] h-[500px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden border border-gray-300 z-50">
          <div className="bg-indigo-600 text-white p-4 font-semibold flex items-center gap-2">
            <Bot size={20} /> Asistente Arcana
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-indigo-100 text-gray-900'
                    : 'mr-auto bg-white border text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex p-3 border-t bg-white cursor-pointer">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribí tu mensaje..."
              className="flex-1 border rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-3 rounded-r-md hover:bg-indigo-700 transition-colors cursor-pointer"
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotComponent;
