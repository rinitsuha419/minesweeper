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

  const checkAround = (board: number[][], x: number, y: number) => {
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
      if (bombCount === 0 && board[ny][nx] === -1 && bombMap[ny][nx] === 0) {
        checkAround(board, nx, ny);
      }
    }
  };

  const board = bombMap.map((row) => row.map(() => -1));

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (userInput[y][x] === 1) {
        checkAround(board, x, y);
      }
    }
  }

  let setIsGameOver = false;
  const isGameOver = (x: number, y: number) => {
    if (userInput[y][x] === 1 && bombMap[y][x] === 1) {
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (bombMap[y][x] === 1 && userInput[y][x] !== 2) {
            board[y][x] = 11;
          }
        }
      }
      setIsGameOver = true;
    }
    return setIsGameOver;
  };

  const isGameClear = () => {
    let bombCount2 = 0;
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (board[y][x] !== -1 && bombMap[y][x] !== 1) {
          bombCount2++;
        }
      }
    }
    return bombCount2 === 71;
  };

  const clickHandler = (x: number, y: number) => {
    if (setIsGameOver || isGameClear() || userInput[y][x] === 2) {
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

    if (bombCount === 0) {
      const newBombMap = structuredClone(bombMap);
      setBombMap(bombSet(x, y, newBombMap));
    }
    const newUserInputs = structuredClone(userInput);
    newUserInputs[y][x] = 1;
    setUserInput(newUserInputs);
  };

  const rightClickHandler = (x: number, y: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (board[y][x] === -1) {
      userInput[y][x] = 2;
      const newUserInputs = structuredClone(userInput);
      setUserInput(newUserInputs);
    }
    if (board[y][x] === 10) {
      userInput[y][x] = 0;
      const newUserInputs = structuredClone(userInput);
      setUserInput(newUserInputs);
    } else {
      return;
    }
  };

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (userInput[y][x] === 2 && board[y][x] === -1) {
        board[y][x] = 10;
      }
      if (userInput[y][x] === 0 && board[y][x] === 10) {
        board[y][x] = -1;
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
    // 確認用にbombが左に寄るようにした
    // for (let i = 0; i < 9; i++) {
    //   bombPos.push([0, i]);
    // }
    // bombPos.push([1, 1]);

    for (const i of bombPos) {
      bombMap[i[1]][i[0]] = 1;
    }
    return bombMap;
  };

  if (isGameClear()) {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (bombMap[y][x] === 1) {
          board[y][x] = 10;
        }
      }
    }
  }

  const resetButton = () => {
    setIsGameOver = false;
    const newBombMap = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    setBombMap(newBombMap);
    const newUserInput = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    setUserInput(newUserInput);
  };

  return (
    <div className={styles.container}>
      <div className={styles.borderStyle}>
        <div className={styles.infomationStyle}>
          <div className={styles.countBombStyle}>10</div>
          <div className={styles.buttonBackStyle}>
            {bombMap.map((row, y) =>
              row.map((color, x) => (
                <div
                  className={styles.buttonStyle}
                  key={`${x}-${y}`}
                  style={{
                    backgroundPosition:
                      isGameOver(x, y) === true
                        ? `${-30 * 13}px 0px`
                        : isGameClear() === true
                          ? `${-30 * 12}px 0px`
                          : `${-30 * 11}px 0px`,
                  }}
                  onClick={() => resetButton()}
                />
              )),
            )}
          </div>

          <div className={styles.timerStyle}>10</div>
        </div>
        <div className={styles.bombBordStyle}>
          {bombMap.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.cellStyle}
                onClick={() => clickHandler(x, y)}
                onContextMenu={(event) => {
                  rightClickHandler(x, y, event);
                }}
                key={`${x}-${y}`}
                style={{
                  borderColor:
                    board[y][x] >= 0 && board[y][x] !== 10
                      ? '#909090'
                      : '#fff #909090 #909090 #fff ',
                  backgroundColor:
                    bombMap[y][x] && isGameOver(x, y) && userInput[y][x] ? '#ffaaaa' : '#c6c6c6',
                }}
                // bombMap[y][x] === 1
              >
                <div
                  className={styles.imageStyle}
                  style={{
                    backgroundPosition: `${(board[y][x] - 1) * -30}px 0px`,
                  }}
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
