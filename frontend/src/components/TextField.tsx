import { ChangeEvent } from "react";

interface TextFieldType {
  id?: string;
  label?: string;
  name?: string;
  value?: string;
  type?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TextField = ({
  id,
  label,
  suffix,
  name = "txtField",
  value,
  type = "text",
  placeholder,
  onChange,
}: TextFieldType) => {
  return (
    <div className="w-full text-left my-4">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-main">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="w-full bg-gray-100 border rounded border-gray-100 resize-none p-3 mb-2 text-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <label className="text-gray">{suffix}</label>
    </div>
  );
};

export default TextField;
