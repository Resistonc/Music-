import React, { useEffect, useState, useRef } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const [squareY, setSquareY] = useState(300);
  const [direction, setDirection] = useState('none');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawSquare = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'red';
      ctx.fillRect(50, squareY, 50, 50);
    };

    const moveSquare = () => {
      if (direction === 'up') setSquareY((prevY) => Math.max(prevY - 5, 0));
      if (direction === 'down') setSquareY((prevY) => Math.min(prevY + 5, canvas.height - 50));
      drawSquare();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') setDirection('up');
      if (e.key === 'ArrowDown') setDirection('down');
    };

    const handleKeyUp = () => {
      setDirection('none');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const gameLoop = () => {
      moveSquare();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [squareY, direction]);

  return <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }} />;
}

export default Game;
