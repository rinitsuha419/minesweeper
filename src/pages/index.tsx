import { useState } from 'react';
import styles from './index.module.css';

const directions = [
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
];

const Home = () => {
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [userInput, setUserInput] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const checkAround = (board: number[][], x: number, y: number) => {
    console.log('opencell');
    console.log(checkAround);
    let bombCount = 0;
    for (const [dy, dx] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx >= 9 || ny < 0 || ny >= 9) continue;
      if (bombMap[ny][nx] === 1) {
        bombCount += 1;
      }
    }
    board[y][x] = bombMap[y][x] === 1 ? 11 : bombCount;

    if (bombMap[y][x] === 1) return;
    for (const [dy, dx] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx >= 9 || ny < 0 || ny >= 9) continue;
      if (bombCount === 0 && userInput[ny][nx] === 0 && bombMap[ny][nx] === 0) {
        userInput[ny][nx] = 1;
        checkAround(board, nx, ny);
      }
    }
  };
  const board = structuredClone(bombMap);
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (userInput[y][x] === 0) {
        board[y][x] = -1;
      } else {
        checkAround(board, x, y);
      }
    }
  }

  const bombSet = (x: number, y: number, bombMap: number[][]) => {
    const bombPos: number[][] = [];
    while (bombPos.length < 10) {
      const bombX = Math.floor(Math.random() * 8);
      const bombY = Math.floor(Math.random() * 8);
      if (x === bombX && y === bombY) {
        continue;
      }

      const double = [0];
      for (const i of bombPos) {
        if (i[1] === bombX && i[0] === bombY) {
          double[0]++;
          break;
        }
      }
      if (double[0] === 1) {
        continue;
      }
      if (x === bombX && y === bombY) {
        continue;
      }
      bombPos.push([bombY, bombX]);
    }
    for (const i of bombPos) {
      bombMap[i[1]][i[0]] = 1;
    }
    return bombMap;
  };

  const clickHandler = (x: number, y: number) => {
    if (isGameOver === true) {
      return;
    }
    let bombCount = 0;
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (bombMap[y][x] === 1) {
          bombCount += 1;
        }
      }
    }
    if (bombMap[y][x] === 1) {
      setIsGameOver(true);
    }
    if (bombCount === 0) {
      const newBombMap = structuredClone(bombMap);
      setBombMap(bombSet(x, y, newBombMap));
    }
    const newUserInputs = structuredClone(userInput);
    newUserInputs[y][x] = 1;
    setUserInput(newUserInputs);
  };

  // const [samplePos, setSamplePos] = useState(0);
  // console.log('sample', samplePos); //samplePosは変数(クリックした回数に関する変数)

  return (
    <div className={styles.container}>
      <div className={styles.borderStyle}>
        <div className={styles.infomationStyle}>
          <div className={styles.countBombStyle}>10</div>
          <div className={styles.buttonBackStyle}>
            <div
              className={styles.buttonStyle}
              style={{
                backgroundPosition: isGameOver === true ? `${-30 * 13}px 0px` : `${-30 * 11}px 0px`,
              }}
            />
          </div>

          <div className={styles.timerStyle}>10</div>
        </div>
        <div className={styles.bombBordStyle}>
          {bombMap.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.cellStyle}
                onClick={() => clickHandler(x, y)}
                key={`${x}-${y}`}
                style={{
                  borderColor: board[y][x] >= 0 ? '#909090' : '#fff #909090 #909090 #fff ',
                }}
              >
                <div
                  className={styles.imageStyle}
                  style={{ backgroundPosition: `${(board[y][x] - 1) * -30}px 0px` }}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
