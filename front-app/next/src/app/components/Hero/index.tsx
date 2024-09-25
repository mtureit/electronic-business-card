
import s from "./index.module.css";

export default function Home() {
  return (
    <div className={s.container}>
      <div className={s.title}>
        <h1>自己紹介</h1>
        <div className={s.bigTitle}>
          <h1>NUTFES</h1>
        </div>
        <h1>カードジェネレータ</h1>
      </div>
    </div>
  );
}
