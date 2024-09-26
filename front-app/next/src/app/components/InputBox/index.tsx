"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import s from "./index.module.css";

export default function Home() {
  const [profile, setProfile] = useState({
    name: "",
    office: "",
    grade: "",
  });
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textTopRef = useRef<HTMLDivElement | null>(null);

  const [backgroundImage, setBackgroundImage] = useState<string>(
    "/images/default.png"
  );
  const [textColor, setTextColor] = useState<string>("#000000");

  useEffect(() => {
    const textElement = textTopRef.current;
    if (textElement) {
      const maxFontSize = 24;
      const minFontSize = 16;
      let fontSize = maxFontSize;
      const containerWidth = textElement.offsetWidth;

      textElement.style.fontSize = `${fontSize}px`;

      while (
        textElement.scrollWidth > containerWidth &&
        fontSize > minFontSize
      ) {
        fontSize -= 1;
        textElement.style.fontSize = `${fontSize}px`;

        const topValue = 24 - (maxFontSize - fontSize) / 12;
        textElement.style.top = `${topValue}%`;
      }
    }
  }, [profile.name]);

  useEffect(() => {
    switch (profile.office) {
      case "企画局":
        setBackgroundImage("/images/kikaku.png");
        setTextColor("#CB1C1C");
        break;
      case "財務局":
        setBackgroundImage("/images/zaimu.png");
        setTextColor("#529B30");
        break;
      case "渉外局":
        setBackgroundImage("/images/syougai.png");
        setTextColor("#2C7184");
        break;
      case "情報局":
        setBackgroundImage("/images/jyoho.png");
        setTextColor("#d26e27");
        break;
      case "制作局":
        setBackgroundImage("/images/seisaku.png");
        setTextColor("#8030A5");
        break;
      case "総務局":
        setBackgroundImage("/images/soumu.png");
        setTextColor("#414040");
        break;
      default:
        setBackgroundImage("/images/default.png");
        setTextColor("#000000");
        break;
    }
  }, [profile.office]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleDownload = () => {
    if (cardRef.current === null) {
      return;
    }

    setLoading(true);

    const cardElement = cardRef.current;
    const pixelRatio = window.innerWidth <= 600 ? 8 : 4;

    toPng(cardElement, {
      pixelRatio: pixelRatio,
      useCORS: true, 
      style: {
        transform: "scale(1)",
      },
    })
      .then((dataUrl: string) => {
        download(dataUrl, "profile-card.png");
      })
      .catch((err: Error) => {
        console.error("Oops, something went wrong!", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 全てのフィールドが入力されているか確認
  const isButtonDisabled =
    !profile.name || !profile.office || !profile.grade || loading;

  return (
    <div className={s.container}>
      <div className={s.component}>
        <div
          ref={cardRef}
          className={s.card}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div
            ref={textTopRef}
            className={s.textTop}
            style={{ color: textColor }}
          >
            {profile.name}
          </div>
          <div className={s.textMiddle} style={{ color: textColor }}>
            {profile.grade}
          </div>
        </div>
      </div>
      <div className={s.component}>
        <div className={s.inputForms}>
          <form>
            <div className={s.inputForm}>
              <label>名前orニックネーム</label>
              <input
                type="text"
                name="name"
                placeholder="例)長岡　太郎orおかたろ"
                value={profile.name}
                onChange={handleChange}
                maxLength={8}
              />
            </div>
            <div className={s.inputForm}>
              <label>所属局</label>
              <select
                name="office"
                value={profile.office}
                onChange={handleChange}
              >
                <option value="">-------</option>
                <option value="企画局">企画局</option>
                <option value="財務局">財務局</option>
                <option value="渉外局">渉外局</option>
                <option value="情報局">情報局</option>
                <option value="制作局">制作局</option>
                <option value="総務局">総務局</option>
              </select>
            </div>
            <div className={s.inputForm}>
              <label>学年</label>
              <select
                name="grade"
                value={profile.grade}
                onChange={handleChange}
              >
                <option value="">-------</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="B3">B3</option>
                <option value="B4">B4</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>
            </div>
          </form>
        </div>
      </div>
      <div className={s.component}>
        <button
          onClick={handleDownload}
          className={s.button}
          disabled={isButtonDisabled}
        >
          {loading ? <div className={s.spinner}></div> : "生成する"}
        </button>
      </div>
    </div>
  );
}
