import * as React from "react";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "~/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export type InputErrorProps = React.HTMLAttributes<HTMLDivElement>;

const InputError: React.FC<InputErrorProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    children && (
      <div className={cn("text-sm text-red-500", className)} {...props}>
        <FontAwesomeIcon icon={faExclamationTriangle} /> {children}
      </div>
    )
  );
};
InputError.displayName = "InputError";

export { Input, InputError };
