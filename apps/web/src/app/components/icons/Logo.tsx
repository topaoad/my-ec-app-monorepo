import type { CSSProperties, FC } from "react";

/** Propsの型定義 */
interface PropsType {
  style?: CSSProperties
  color?: string
}

export const Logo: FC<PropsType> = (props) => {
  const { style, color } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" style={style || undefined}>
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8e44ad" stopOpacity="1" />
          <stop offset="100%" stopColor="#3498db" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="300" height="150" fill="#f3f4f6" />
      <text x="20" y="70" fontFamily="Arial, sans-serif" fontSize="50" fontWeight="bold" fill="#8e44ad">Toproad</text>
      <text x="20" y="120" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="#3498db">Shop</text>
      <path d="M10 130 Q 150 90 290 130" stroke={color || "url(#roadGradient)"} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M240 110 l30 -15 l15 7 v15 h-45 z" fill="#e74c3c" />
      <circle cx="250" cy="117" r="5" fill="#f1c40f" />
      <circle cx="275" cy="117" r="5" fill="#f1c40f" />
    </svg>
  );
};
