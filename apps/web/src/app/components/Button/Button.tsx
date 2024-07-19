// import { FC, memo } from "react";

// type Props = JSX.IntrinsicElements["button"];

// const Button: FC<Props> = (props) => {
//   const { children, ...buttonProps } = props;

//   return <button {...buttonProps}>{children}</button>;
// };

// export default memo(Button);

import React, { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface ButtonProps {
  children: ReactNode;
  intent?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isDisabled?: boolean;
  className?: string;
}

// export const buttonVariants = cva("btn", {
//   variants: {
//     intent: {
//       primary: "btn-primary",
//       secondary: "btn-secondary",
//     },
//     size: {
//       small: "btn-sm",
//       large: "btn-lg",
//     },
//   },
//   defaultVariants: {
//     intent: "primary",
//     size: "large",
//   },
// });
export const buttonVariants = cva("px-4 py-2 bg-blue-500 text-white rounded", {
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-gray-400",
      danger: "bg-red-400",
    },
    size: {
      small: "px-4 py-2",
      medium: "px-6 py-3",
      large: "px-10 py-5",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

const Button: FC<ButtonProps> = ({
  children,
  intent = "primary",
  size = "large",
  isDisabled = false,
  className,
}) => {
  const buttonClass = cn(
    buttonVariants({ intent, size }),
    { "btn-disabled": isDisabled },
    className,
  );

  return (
    <button className={buttonClass} disabled={isDisabled}>
      {children}
    </button>
  );
};

export default Button;
