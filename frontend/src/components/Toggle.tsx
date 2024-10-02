import { ReactNode, useRef, useState, useEffect } from "react";

interface ToggleComponentProps {
  children: ReactNode;
  buttonText?: ReactNode;
}

const Toggle = ({ children, buttonText }: ToggleComponentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containRef = useRef<HTMLDivElement>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOutside = (ex: MouseEvent) => {
    if (containRef.current && !containRef.current.contains(ex.target as Node)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative inline-block" ref={containRef}>
        <div
          onClick={toggleVisibility}
          className="relative z-10 px-0 py-0 focus:outline-none"
        >
          {buttonText}
        </div>

        {isVisible && <div>{children}</div>}
      </div>
    </>
  );
};

export default Toggle;
