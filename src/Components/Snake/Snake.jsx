import { useState, useEffect, useRef } from "react";

function Snake() {
  const grid = 15;
  const tile = 40;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef();

  // Capturar a tecla para mudar a direção da snake
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Gerar comida em uma posição que não esteja na cobra
  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * grid),
        y: Math.floor(Math.random() * grid),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  // Loop do jogo
  useEffect(() => {
    const moveSnake = () => {
      if (gameOver) return;

      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Verificar colisão com as bordas ou com o próprio corpo
      if (
        head.x < 0 || head.x >= grid ||
        head.y < 0 || head.y >= grid ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Verificar se a cobra comeu a comida
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    gameLoopRef.current = setInterval(moveSnake, 100);
    return () => clearInterval(gameLoopRef.current);
  }, [snake, direction, food, gameOver]);

  // Reiniciar o jogo
  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: -1, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
      <div className="text-white text-2xl mb-4">Score: {score}</div>
      <div className="grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid}, ${tile}px)`,
        gridTemplateRows: `repeat(${grid}, ${tile}px)`,
      }}>
        {Array.from({ length: grid * grid }).map((_, index) => {
          const x = index % grid;
          const y = Math.floor(index / grid);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={index}
              className={`w-${tile} h-${tile} border border-gray-700 ${
                isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-900'
              }`}
            ></div>
          );
        })}
      </div>
      {gameOver && (
        <div className="absolute flex flex-col items-center">
          <div className="text-white text-4xl mb-4">Game Over</div>
          <button
            onClick={restartGame}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default Snake;