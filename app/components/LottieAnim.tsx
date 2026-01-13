"use client";

import React from "react";
import Lottie from "lottie-react";

interface LottieAnimProps {
  animationData: any;
  className?: string;
  loop?: boolean;
}

const LottieAnim: React.FC<LottieAnimProps> = ({ animationData, className, loop = true }) => {
  return (
    <div className={className}>
      <Lottie 
        animationData={animationData} 
        loop={loop} 
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnim;
