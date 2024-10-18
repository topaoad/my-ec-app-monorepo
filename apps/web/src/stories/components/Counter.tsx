/**
 * 演習
 * 1. Counterコンポーネントのストーリーを作成してください
 * 2. 作成したストーリーをChromaticにパブリッシュしてください
 * 3. パブリッシュした内容を確認し、問題がなければAcceptしてください
 * 4. Counterコンポーネントに何らかの変更を加え、再度Chromaticにパブリッシュし、
 *    差分が正しく検出されることを確認してください
 */

import { useState } from "react";

interface CounterProps {
  initialCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>ー</button>
      <button onClick={increment}>＋</button>
    </div>
  );
};

export default Counter;
