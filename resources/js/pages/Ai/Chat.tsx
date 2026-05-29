import React, { useState, FormEvent } from 'react';
import axios from 'axios';

// Define the shape of our message objects
interface Message {
    role: 'user' | 'assistant';
    content: string;
}
// Define the expected shape of the API response
interface ChatResponse {
    answer: string;
    conversationId: string;
}
export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        const userMessage: Message = { role: 'user', content: input };
        // Optimistically update UI
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);
        try {
            // Logic matches your Controller's store method requirements
            const { data } = await axios.post<ChatResponse>('/agent/chat', {
                message: currentInput,
                conversationId: conversationId, // Will be null on first message
            });
            const assistantMessage: Message = { 
                role: 'assistant', 
                content: data.answer 
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setConversationId(data.conversationId);
        } catch (error) {
            console.error("Chat Error:", error);
            // Optional: Add error message to chat UI here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
        <h3 className='mt-3 text-center text-3xl mb-3'> AI Chat Conversation (By Using Gemini API) </h3>
            
            <form onSubmit={sendMessage} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    Send
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border text-gray-800'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-sm text-gray-500 animate-pulse">
                        Assistant is typing...
                    </div>
                )}
            </div>

        </div>
    );
}