import React from 'react';

function Square({ value, onClick, isGameOver, isAITurn, isWinning }) {
  return (
    <button
      className={`square ${value ? 'filled' : ''} ${isGameOver ? 'game-over' : ''} ${isAITurn ? 'ai-turn' : ''} ${isWinning ? 'winning' : ''}`}
      onClick={onClick}
      disabled={isGameOver || value !== null || isAITurn}
    >
      {value}
    </button>
  );
}

export default Square; 