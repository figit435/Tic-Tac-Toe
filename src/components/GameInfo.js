import React from 'react';

const GameInfo = ({ currentPlayer, scores, gameMode, winner, isGameOver, board, difficulty }) => {
  const getStatus = () => {
    if (winner) {
      return (
        <div className="winner-announcement">
          <div className="winner-text">
            {winner === 'O' && gameMode === 'single' ? 'AI Wins!' : `Player ${winner} Wins!`}
          </div>
          <div className="winner-icon">
            <span>{winner}</span>
          </div>
        </div>
      );
    }

    if (isGameOver && !winner && board.every(square => square !== null)) {
      return (
        <div className="tie-announcement">
          <div className="tie-text">You Tied!</div>
          <div className="tie-icon">
            <span>🤝</span>
          </div>
        </div>
      );
    }

    return (
      <div className="current-player">
        Next player: <span className="player-indicator">
          {currentPlayer === 'O' && gameMode === 'single' ? 'AI' : currentPlayer}
        </span>
      </div>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="game-info">
      <div className="status">{getStatus()}</div>
      <div className="scores">
        <div className={`score-item player-X ${currentPlayer === 'X' ? 'active' : ''}`}>
          Player X: {scores.X}
        </div>
        <div className={`score-item player-O ${currentPlayer === 'O' ? 'active' : ''}`}>
          {gameMode === 'single' ? 'AI' : 'Player O'}: {scores.O}
        </div>
      </div>
      <div className="game-mode">
        {gameMode === 'single' 
          ? `Single Player - ${capitalizeFirstLetter(difficulty)} Mode` 
          : 'Two Player Mode'}
      </div>
    </div>
  );
};

export default GameInfo; 