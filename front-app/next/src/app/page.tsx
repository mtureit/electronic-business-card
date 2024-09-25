import s from "./page.module.css";
import InputBox from "./components/InputBox/index";
import Hero from "./components/Hero/index";

export default function Home() {
  return (
    <section className={s.container}>
      <div className={s.component}>
        <Hero />
      </div>
      <div className={s.component}>
        <InputBox />
      </div>
    </section>
  );
}
