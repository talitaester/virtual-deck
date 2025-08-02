"use client";
import React, { useState } from 'react'
import { tarotCards } from '../data/tarot-cards';

export default function Main() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("");

  function drawCard() {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    setSelectedCard(tarotCards[randomIndex]);
    const cardname=tarotCards[randomIndex].name;
    askLLM(cardname, question);
  }

  async function askLLM(cardname, userQuestion) {
      setLoading(true);
      setResponse("");
      if (!userQuestion){
        userQuestion = "considere um contexto geral"
      }

      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: `Você é um tarólogo sábio. A pergunta do consulente é: "${userQuestion}". Interprete a carta ${cardname} de forma poética e breve, no máximo 10 linhas, respondendo a essa questão.`,
          stream: false,
        }),
      });

      const data = await res.json();
      setResponse(data.response);
      setLoading(false);
    };

  return (
    <div className="bg-pink-200 h-screen w-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">
        Rider-Waite Tarot — Sorteie sua carta!
      </h1>
      <div className='flex justify-around w-1/2 items-center '>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Faça sua pergunta ao oráculo... ou so tire uma carta"
          className="mb-8 px-4 py-2 rounded-lg shadow-sm border border-purple-400 w-full max-w-md text-purple-900"
        />

        <button
           onClick={drawCard}
           className="bg-purple-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-purple-700 transition mb-8"
         >
           start
        </button>
      </div>
 
     

      <div className='flex justify-evenly w-full'>
      {selectedCard && (
        <div className="flex flex-col items-center text-center">
          <img
            src={selectedCard.image}
            alt={selectedCard.name}
            className="w-64 h-auto mb-4 shadow-lg rounded-xl"
          />
          <h2 className="text-2xl font-semibold text-purple-900">{selectedCard.name}</h2>
        </div>
      )}
      {loading && <p className="mt-4 text-gray-600">Consultando os oráculos...</p>}
      {response && (
        <div className="mt-4 text-purple-800 p-4 rounded shadow-xl max-w-xl">
          <p>{response}</p>
        </div>
      )}
      </div>

    </div>
  );
}
