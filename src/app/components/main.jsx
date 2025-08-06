"use client";
import React, { useState } from 'react';
import { tarotCards } from '../data/tarot-cards';

export default function Main() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("");
  const [numCards, setNumCards] = useState(1);

  function drawCard() {
    setResponse("");
    setSelectedCards([]);

    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    const drawn = shuffled.slice(0, numCards);
    setSelectedCards(drawn);

    const cardNames = drawn.map(card => card.name);
    askLLM(cardNames, question);
  }

  async function askLLM(cardNames, userQuestion) {
    setLoading(true);
    if (!userQuestion || userQuestion.trim() === "") {
      userQuestion = "considere um contexto geral";
    }

    const cardsText = cardNames.join(", ");

    const prompt = `
      Você é um tarólogo sábio. A pergunta do consulente é: "${userQuestion}".
      As cartas tiradas foram: ${cardsText}.
      Interprete essas cartas juntas em um tom poético e breve, respondendo à pergunta de forma simbólica.
      A interpretação deve ter no máximo 10 linhas.
    `;

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  }

  return (
    <div className="bg-pink-200 min-h-screen w-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">
        Rider-Waite Tarot — Sorteie sua carta!
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full max-w-3xl mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Faça sua pergunta ao oráculo... ou só tire uma carta"
          className="px-4 py-2 rounded-lg shadow-sm border border-purple-400 w-full max-w-md text-purple-900"
        />

        <select
          value={numCards}
          onChange={(e) => setNumCards(parseInt(e.target.value))}
          className="px-4 py-2 rounded-lg border border-purple-400 text-purple-900"
        >
          <option value={1}>1 carta</option>
          <option value={3}>3 cartas</option>
          <option value={5}>5 cartas</option>
        </select>

        <button
          onClick={drawCard}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-purple-700 transition"
        >
          Start
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {selectedCards.map((card, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <img
              src={card.image}
              alt={card.name}
              className="w-40 h-auto mb-2 shadow-lg rounded-xl"
            />
            <h2 className="text-lg font-semibold text-purple-900">{card.name}</h2>
          </div>
        ))}
      </div>

      {loading && <p className="mt-6 text-gray-600">Consultando os oráculos...</p>}

      {response && (
        <div className="mt-6 bg-white text-purple-800 p-4 rounded shadow-xl max-w-2xl">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
