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

  // 背景画像のURLをstateに追加
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "/images/default.png"
  );

  // 文字色の状態を管理
  const [textColor, setTextColor] = useState<string>("#000000"); // デフォルトの文字色

  useEffect(() => {
    const textElement = textTopRef.current;
    if (textElement) {
      // 画面幅に応じてフォントサイズの範囲を決定
      let maxFontSize, minFontSize;
      const windowWidth = window.innerWidth;

      if (windowWidth <= 600) {
        // スマホサイズ
        maxFontSize = 16;
        minFontSize = 8;
      } else {
        // デスクトップサイズ
        maxFontSize = 24; // デスクトップの場合の最大フォントサイズ
        minFontSize = 16;
      }

      let fontSize = maxFontSize;
      const containerWidth = textElement.offsetWidth;

      // 初期フォントサイズを設定
      textElement.style.fontSize = `${fontSize}px`;

      // テキストが要素に収まるようにフォントサイズを調整
      while (
        textElement.scrollWidth > containerWidth &&
        fontSize > minFontSize
      ) {
        fontSize -= 1;
        textElement.style.fontSize = `${fontSize}px`;

        // フォントサイズに応じて `top` の値を調整
        const topValue = 25 - (maxFontSize - fontSize) / 8;
        textElement.style.top = `${topValue}%`;
      }
    }
  }, [profile.name]);

  // officeの値が変更されたときに背景画像と文字色を更新
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

    // 要素の現在のサイズを取得
    const cardWidth = cardRef.current.offsetWidth;
    const cardHeight = cardRef.current.offsetHeight;

    // 画面の幅に応じて解像度の倍率を決定
    const pixelRatio = window.innerWidth <= 600 ? 8 : 4; // 600px以下なら2倍、それ以上は4倍

    toPng(cardRef.current, {
      width: cardWidth,
      height: cardHeight,
      pixelRatio: pixelRatio, // 解像度の倍率を設定
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

  return (
    <div className={s.container}>
      {/* プロフィールカード */}
      <div className={s.component}>
        <div
          ref={cardRef}
          className={s.card}
          style={{ backgroundImage: `url(${backgroundImage})` }} // 背景画像を動的に変更
        >
          {/* テキスト要素の配置 */}
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
              <label>名前・ニックネーム(無い場合は省略)</label>
              <input
                type="text"
                name="name"
                placeholder="例)長岡　太郎(おかたろ)"
                value={profile.name}
                onChange={handleChange}
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
          disabled={loading}
        >
          {loading ? <div className={s.spinner}></div> : "生成する"}
        </button>
      </div>
    </div>
  );
}
