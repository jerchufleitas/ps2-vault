import React, { useRef, useState } from "react";

interface TiltedCardProps {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string | number;
  containerWidth?: string | number;
  imageHeight?: string | number;
  imageWidth?: string | number;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  className?: string;
  imageClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  children?: React.ReactNode;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  altText = "Tilted Card Image",
  captionText,
  scaleOnHover = 1.05,
  rotateAmplitude = 14,
  showTooltip = false,
  overlayContent,
  displayOverlayContent = false,
  className = "",
  imageClassName = "",
  onError,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width) * 100;
    const yPct = (mouseY / height) * 100;

    // Calculate rotation (-rotateAmplitude to +rotateAmplitude)
    const calcRotateX = ((mouseY - height / 2) / (height / 2)) * -rotateAmplitude;
    const calcRotateY = ((mouseX - width / 2) / (width / 2)) * rotateAmplitude;

    setRotateX(calcRotateX);
    setRotateY(calcRotateY);
    setGlarePos({ x: xPct, y: yPct });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setScale(scaleOnHover);
    setGlareOpacity(0.25);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setScale(1);
    setGlareOpacity(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none cursor-pointer [perspective:1000px] ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out rounded-xl overflow-hidden"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Render Image or Children */}
        {children ? (
          children
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            onError={onError}
            className={`w-full h-full object-contain rounded-xl block ${imageClassName}`}
          />
        ) : null}

        {/* Dynamic Light Glare Effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 z-20"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />

        {/* Overlay Content */}
        {displayOverlayContent && overlayContent && (
          <div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ transform: "translateZ(30px)" }}
          >
            {overlayContent}
          </div>
        )}
      </div>

      {/* Tooltip / Caption */}
      {showTooltip && captionText && (
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-400 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-500/30 whitespace-nowrap transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {captionText}
        </div>
      )}
    </div>
  );
};
