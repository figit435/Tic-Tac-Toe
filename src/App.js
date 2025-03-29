import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import GameInfo from './components/GameInfo';

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAITurn, setIsAITurn] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [showDifficultyPopup, setShowDifficultyPopup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('purple');

  const themes = [
    { id: 'red', name: 'Red' },
    { id: 'orange', name: 'Orange' },
    { id: 'yellow', name: 'Yellow' },
    { id: 'green', name: 'Green' },
    { id: 'blue', name: 'Blue' },
    { id: 'indigo', name: 'Indigo' },
    { id: 'violet', name: 'Violet' }
  ];

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const calculateWinner = (squares) => {
    const winner = checkWinner(squares);
    if (winner) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          setWinningLine([a, b, c]);
          break;
        }
      }
    } else {
      setWinningLine(null);
    }
    return winner;
  };

  const findBestMove = (squares) => {
    // Difficulty settings: chance of making a random move
    const difficultyRandomness = {
      easy: 0.7,    // 70% random moves
      medium: 0.4,  // 40% random moves
      hard: 0.1     // 10% random moves
    };

    // Randomly decide to make a strategic or random move based on difficulty
    const makeRandomMove = Math.random() < difficultyRandomness[difficulty];

    if (!makeRandomMove) {
      // Check if AI can win
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const newSquares = [...squares];
          newSquares[i] = 'O';
          if (checkWinner(newSquares) === 'O') {
            return i;
          }
        }
      }

      // Block player from winning
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const newSquares = [...squares];
          newSquares[i] = 'X';
          if (checkWinner(newSquares) === 'X') {
            return i;
          }
        }
      }
    }

    // Get all available moves
    const availableMoves = squares.reduce((moves, square, index) => {
      if (!square) moves.push(index);
      return moves;
    }, []);

    if (availableMoves.length === 0) return null;

    // Shuffle available moves
    for (let i = availableMoves.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableMoves[i], availableMoves[j]] = [availableMoves[j], availableMoves[i]];
    }

    // If making a strategic move, prefer center and corners
    if (!makeRandomMove && !squares[4]) {
      return 4; // Take center if available
    }

    if (!makeRandomMove) {
      const corners = [0, 2, 6, 8];
      // Fisher-Yates shuffle algorithm
      for (let i = corners.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [corners[i], corners[j]] = [corners[j], corners[i]];
      }
      
      // Try to take a random corner
      for (let corner of corners) {
        if (!squares[corner]) {
          return corner;
        }
      }
    }

    // Take a random available move
    return availableMoves[0];
  };

  const handleClick = (index) => {
    if (isGameOver || board[index] || isAITurn) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setIsGameOver(true);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
      return;
    }

    if (newBoard.every(square => square !== null)) {
      setIsGameOver(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  useEffect(() => {
    if (gameMode === 'single' && currentPlayer === 'O' && !isGameOver) {
      setIsAITurn(true);
      const aiMove = findBestMove(board);
      if (aiMove !== null) {
        setTimeout(() => {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          
          const gameWinner = calculateWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
            setIsGameOver(true);
            setScores(prev => ({
              ...prev,
              [gameWinner]: prev[gameWinner] + 1
            }));
          } else if (newBoard.every(square => square !== null)) {
            setIsGameOver(true);
          } else {
            setCurrentPlayer('X');
          }
          setIsAITurn(false);
        }, 500);
      }
    } else {
      setIsAITurn(false);
    }
  }, [currentPlayer, gameMode, board, isGameOver]);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsGameOver(false);
    setIsAITurn(false);
    setWinningLine(null);
  };

  const resetGame = () => {
    // Only reset the current game state and scores
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsGameOver(false);
    setIsAITurn(false);
    setWinningLine(null);
    setScores({ X: 0, O: 0 });
    // Do NOT change game mode or difficulty
  };

  const goHome = () => {
    resetBoard();
    setScores({ X: 0, O: 0 });
    setGameMode(null);
    setDifficulty(null);
  };

  const startNewGame = (mode) => {
    if (mode === 'single') {
      setShowDifficultyPopup(true);
    } else {
      setGameMode(mode);
      setDifficulty(null);
      resetBoard();
    }
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setGameMode('single');
    setShowDifficultyPopup(false);
    resetBoard();
  };

  const selectDifficulty = (level) => {
    setDifficulty(level);
    resetBoard();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''} theme-${colorTheme}`}>
      <button className="settings-button" onClick={toggleSettings}>
        <span>⚙</span>
      </button>
      
      <div className={`settings-overlay ${showSettings ? 'show' : ''}`} onClick={toggleSettings}></div>
      
      <div className={`settings-panel ${showSettings ? 'open' : ''}`}>
        <button className="close-settings" onClick={toggleSettings}>×</button>
        
        <div className="settings-section">
          <h3 className="settings-section-title">Display</h3>
          <div className="settings-option" onClick={() => setIsDarkMode(!isDarkMode)}>
            <span>Dark Mode</span>
            <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`}></div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Color Theme</h3>
          <div className="theme-options">
            {themes.map(theme => (
              <div
                key={theme.id}
                className={`theme-option ${colorTheme === theme.id ? 'active' : ''}`}
                onClick={() => setColorTheme(theme.id)}
              >
                <div className={`theme-circle ${theme.id}`}></div>
                <span>{theme.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDifficultyPopup && (
        <div className="difficulty-popup-overlay">
          <div className="difficulty-popup">
            <h2>Select Difficulty</h2>
            <div className="difficulty-options">
              <button 
                className="difficulty-option easy"
                onClick={() => handleDifficultySelect('easy')}
              >
                Easy
              </button>
              <button 
                className="difficulty-option medium"
                onClick={() => handleDifficultySelect('medium')}
              >
                Medium
              </button>
              <button 
                className="difficulty-option hard"
                onClick={() => handleDifficultySelect('hard')}
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      )}
      {!gameMode ? (
        <div className="game-mode-selection">
          <h1>Tic Tac Toe</h1>
          <div className="mode-buttons">
            <button onClick={() => startNewGame('single')}>Single Player</button>
            <button onClick={() => startNewGame('two')}>Two Players</button>
          </div>
        </div>
      ) : (
        <div className="game">
          <h1>Tic Tac Toe</h1>
          <GameInfo 
            currentPlayer={currentPlayer}
            winner={winner}
            scores={scores}
            gameMode={gameMode}
            isGameOver={isGameOver}
            board={board}
            difficulty={difficulty}
          />
          <Board 
            squares={board}
            onClick={handleClick}
            isGameOver={isGameOver}
            isAITurn={isAITurn}
            winningLine={winningLine}
          />
          <div className="game-controls">
            <button className="reset-button" onClick={resetBoard}>
              Play Again
            </button>
            {gameMode === 'single' && (
              <div className="custom-select">
                <button 
                  className={`difficulty-select ${difficulty}`}
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling.classList.toggle('show');
                  }}
                >
                  {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Select Difficulty'}
                  <span className="arrow"></span>
                </button>
                <div className="select-options">
                  <div 
                    className={`select-option easy ${difficulty === 'easy' ? 'selected' : ''}`}
                    onClick={() => {
                      selectDifficulty('easy');
                      document.querySelector('.select-options').classList.remove('show');
                    }}
                  >
                    Easy
                  </div>
                  <div 
                    className={`select-option medium ${difficulty === 'medium' ? 'selected' : ''}`}
                    onClick={() => {
                      selectDifficulty('medium');
                      document.querySelector('.select-options').classList.remove('show');
                    }}
                  >
                    Medium
                  </div>
                  <div 
                    className={`select-option hard ${difficulty === 'hard' ? 'selected' : ''}`}
                    onClick={() => {
                      selectDifficulty('hard');
                      document.querySelector('.select-options').classList.remove('show');
                    }}
                  >
                    Hard
                  </div>
                </div>
              </div>
            )}
            <button className="reset-score-button" onClick={() => {
              resetBoard();
              setScores({ X: 0, O: 0 });
            }}>
              Reset Score
            </button>
            <button className="home-button" onClick={goHome}>
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
