import React, { useState } from 'react'

export const ArrayCards =  {
    nome,
    descricao,
    numero
}


const [ArrayCards, setArrayCards] = useState<ArrayCards>([{

    nome: 'numero1', descricao: 'nada por enquanto', numero: 1
},
{    nome: 'numero2', descricao: 'nada por enquanto', numero: 2
}])

const popularCards = ArrayCards.insert
function Main() {
  return (
    <div className='bg-black h-screen w-screen' >
        {ArrayCards.map((value) => () }
      
    </div>
  )
}

export default Main;
