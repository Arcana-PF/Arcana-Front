'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
};

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola, soy ArcanBot, tu asistente virtual de Arcana. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Carga productos al abrir el chat
  useEffect(() => {
    if (!isOpen) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://arcana-back.onrender.com/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '⚠️ No pude cargar los productos. Intenta recargar la página.',
          },
        ]);
      }
    };
    fetchProducts();
  }, [isOpen]);

  // Formateo productos para el prompt
  const formatProductList = (products: Product[]) => {
    return products
      .map(
        p =>
          `• ${p.name} (${p.category}) - $${p.price}${
            p.description ? ` - ${p.description.substring(0, 50)}...` : ''
          } [PRODUCT_ID:${p.id}]`
      )
      .join('\n');
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `Eres ArcanBot, el asistente virtual profesional y cálido del e-commerce esotérico Arcana.

Solo puedes hablar de los productos listados abajo. No inventes productos que no están en esta lista.

⚠️ IMPORTANTE:
- Si mencionas un producto del listado, agregá el marcador [PRODUCT_ID:ID] al final de esa línea.
- Ese marcador será reemplazado en pantalla por un botón que lleva al producto. Así que SÍ puedes compartir enlaces de productos válidos usando este sistema.
- NO digas frases como "no puedo pasarte el link" si el producto está en la lista.
- Si piden recomendaciones, debes aclarar que sos una IA, luego brindale tu opinion.

💼 Info adicional:
- Los envíos se realizan en 24-48hs hábiles.
- Las devoluciones tienen garantía de 30 días.

📦 Productos disponibles:
${formatProductList(products)}
`,
            },
            ...newMessages,
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const botReply = data?.choices?.[0]?.message?.content || 'No pude generar una respuesta.';
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Hubo un error al procesar tu mensaje. Intenta de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Detecta [PRODUCT_ID:...] y reemplaza con botón
  const renderMessage = (msg: Message, index: number) => {
    const parts = msg.content.split(/(\[PRODUCT_ID:[^\]]+\])/g);

    return (
      <div
        key={index}
        className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap text-sm ${
          msg.role === 'user'
            ? 'ml-auto bg-indigo-100 text-gray-900'
            : 'mr-auto bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {parts.map((part, i) => {
          const match = part.match(/\[PRODUCT_ID:(.+?)\]/);
          if (match) {
            const id = match[1];
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            return (
              <div key={i} className="mt-2">
                <Link
                  href={`${origin}/products/${id}`}
                  className="inline-block text-sm text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver producto
                </Link>
              </div>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        aria-label={isOpen ? 'Cerrar chatbot' : 'Abrir chatbot'}
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[350px] h-[500px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden border border-gray-300 z-50">
          <div className="bg-indigo-600 text-white p-4 font-semibold flex items-center gap-2">
            <Bot size={20} /> Asistente Arcana
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => renderMessage(msg, index))}
            {isLoading && (
              <div className="mr-auto max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                Pensando...
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
              className="bg-indigo-600 text-white px-3 rounded-r-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
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
