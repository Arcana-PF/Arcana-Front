'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente virtual de Arcana. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener productos de la API al iniciar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://arcana-back.onrender.com/products');
        if (!response.ok) throw new Error('Error al obtener productos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ No pude cargar los productos. Intenta recargar la página.'
        }]);
      }
    };

    if (isOpen) fetchProducts();
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatProductList = (products: Product[]) => {
    return products.map(p => 
      `• ${p.name} (${p.category}) - $${p.price}${p.description ? ` - ${p.description.substring(0, 50)}...` : ''}`
    ).join('\n');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `Eres el asistente virtual de Arcana, un sitio e-commerce esotérico. 
              Responde con calidez, precisión y profesionalismo. Nunca inventes productos.
              
              Estos son los productos disponibles:
              ${formatProductList(products)}
              
              Instrucciones importantes:
              - Si preguntan por productos, menciona solo los que están en la lista
              - Para preguntas sobre envíos, di que se hacen en 24-48hs
              - Las devoluciones tienen 30 días de garantía
              - No inventes información que no tengas`
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const botReply = data?.choices?.[0]?.message?.content || 'No pude generar una respuesta.';

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error al obtener respuesta del bot:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Ocurrió un error al procesar tu mensaje. Intenta nuevamente.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        aria-label={isOpen ? "Cerrar chatbot" : "Abrir chatbot"}
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
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'ml-auto bg-indigo-100 text-gray-900'
                    : 'mr-auto bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  Pensando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex p-3 border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-70"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-3 rounded-r-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
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