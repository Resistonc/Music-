import React, { useEffect, useRef, useState } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const squareY = useRef(300);
  const squareX = useRef(50); // Początkowa pozycja X kwadratu
  const targetY = useRef(300);
  const isAnimating = useRef(false);
  const [speed, setSpeed] = useState(5);
  const xOffset = useRef(2); // Przesunięcie w poziomie

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawSquare = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'purple';
      ctx.fillRect(squareX.current, squareY.current, 50, 50);
    };

    const animate = () => {
      if (!isAnimating.current) return;

      if (squareY.current < targetY.current) {
        squareY.current = Math.min(squareY.current + speed, targetY.current);
      } else if (squareY.current > targetY.current) {
        squareY.current = Math.max(squareY.current - speed, targetY.current);
      }

      // Aktualizacja pozycji X
      squareX.current += xOffset.current;
      if (squareX.current > canvas.width - 100 || squareX.current < 0) {
        xOffset.current = -xOffset.current; // Odwróć kierunek przy krawędziach
      }

      drawSquare();

      if (squareY.current !== targetY.current) {
        requestAnimationFrame(animate);
      } else {
        isAnimating.current = false;
      }
    };

    const handleKeyDown = (e) => {
      if (isAnimating.current) return;

      if (e.key === 'ArrowUp') {
        targetY.current = 0; // Move to top
      } else if (e.key === 'ArrowDown') {
        targetY.current = canvas.height - 50; // Move to bottom
      }

      if (squareY.current !== targetY.current) {
        isAnimating.current = true;
        requestAnimationFrame(animate);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    drawSquare(); // Initial draw

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [speed]);

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }} />
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="speed">Adjust Speed: </label>
        <input
          type="range"
          id="speed"
          min="1"
          max="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>{speed}</span>
      </div>
    </div>
  );
}

export default Game;
