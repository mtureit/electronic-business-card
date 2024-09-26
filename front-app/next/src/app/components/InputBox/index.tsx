"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // iOSを検出する関数
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      typeof (window as unknown as { MSStream?: boolean }).MSStream ===
        "undefined"
    );
  };

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
    // 背景画像を取得し、CORS対応も行う
    const img = new Image();
    img.src = getBackgroundImage(profile.office);
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBackgroundImage(img.src);
    };
  }, [profile.office]);

  // 背景画像を取得する関数
  const getBackgroundImage = (office: string) => {
    switch (office) {
      case "企画局":
        setTextColor("#CB1C1C");
        return "/images/kikaku.png";
      case "財務局":
        setTextColor("#529B30");
        return "/images/zaimu.png";
      case "渉外局":
        setTextColor("#2C7184");
        return "/images/syougai.png";
      case "情報局":
        setTextColor("#d26e27");
        return "/images/jyoho.png";
      case "制作局":
        setTextColor("#8030A5");
        return "/images/seisaku.png";
      case "総務局":
        setTextColor("#414040");
        return "/images/soumu.png";
      default:
        setTextColor("#000000");
        return "/images/default.png";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleGenerateImage = () => {
    if (cardRef.current === null) {
      return;
    }

    setLoading(true);

    const cardElement = cardRef.current;
    const pixelRatio = 4;

    if (isIOS()) {
      console.log("iOSデバイスです。特別な処理を実行します。");
    }

    toPng(cardElement, {
      pixelRatio: pixelRatio,
      useCORS: true, // CORS対応を強化
      style: {
        transform: "scale(1)",
      },
    })
      .then((dataUrl: string) => {
        setGeneratedImage(dataUrl); // 生成した画像を状態に保存
      })
      .catch((err: Error) => {
        console.error("エラーが発生しました: ", err);
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
          onClick={handleGenerateImage}
          className={s.button}
          disabled={isButtonDisabled}
        >
          {loading ? <div className={s.spinner}></div> : "生成する"}
        </button>
      </div>

      {/* 生成した画像を表示 */}
      {generatedImage && (
        <div className={s.component}>
          <h3>保存するには、右クリックまたは長押ししてください</h3>
          <div className={s.generateCard}>
            <img src={generatedImage} alt="Generated Profile Card" />
          </div>
        </div>
      )}
    </div>
  );
}
