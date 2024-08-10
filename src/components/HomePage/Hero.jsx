import React from "react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const targetText = "JusCode";

  useEffect(() => {
    if (index < targetText.length) {
      setTimeout(() => {
        setText(text + targetText[index]);
        setIndex(index + 1);
      }, 150)
    }
  }, [text]);

  return (
    <div id="hero">
      <div className="container">
        <h1 id="animation-text">{text}</h1>
      </div>
    </div>
  );
};

export default Hero;
