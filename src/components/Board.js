import React from 'react';
import Square from './Square';

function Board({ squares, onClick, isGameOver, isAITurn, winningLine }) {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <Square
          key={index}
          value={square}
          onClick={() => onClick(index)}
          isGameOver={isGameOver}
          isAITurn={isAITurn}
          isWinning={winningLine && winningLine.includes(index)}
        />
      ))}
    </div>
  );
}

export default Board; 