import { useState } from 'react';
import styles from './index.module.css';

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
  const [board, setBoard] = useState([
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const bombSet = (x: number, y: number, bombMap: number[][]) => {
    const bombPos = [];
    while (bombPos.length < 10) {
      const bombX = Math.floor(Math.random() * 8);
      const bombY = Math.floor(Math.random() * 8);
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
      bombMap[i[1]][i[0]] = 11;
    }
    return bombMap;
  };
  const clickHandler = (x: number, y: number) => {
    let bombCount = 0;
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (bombMap[y][x] === 11) bombCount += 1;
      }
    }
    if (bombCount === 0) {
      const newBombMap = structuredClone(bombMap);
      setBombMap(bombSet(x, y, newBombMap));
    }
  };

  const [samplePos, setSamplePos] = useState(0);
  console.log('sample', samplePos); //samplePosは変数(クリックした回数に関する変数)

  return (
    <div className={styles.container}>
      <div className={styles.borderStyle}>
        <div className={styles.infomationStyle}>
          <div className={styles.countBombStyle}>10</div>
          <div className={styles.buttonBackStyle}>
            <div
              className={styles.buttonStyle}
              style={{ backgroundPosition: `${-30 * 11}px 0px` }}
            />
          </div>

          <div className={styles.timerStyle}>10</div>
        </div>
        <div className={styles.bombBordStyle}>
          {bombMap.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.cellStyle}
                key={`${x}-${y}`}
                onClick={() => clickHandler(x, y)}
              >
                <div
                  className={styles.imageStyle}
                  style={{ backgroundPosition: `${-30 * board[y][x] + 30}px 0px` }}
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
//計算値...状態と計算値から自動算出する値(オセロのblackpoint)
//再帰関数…
