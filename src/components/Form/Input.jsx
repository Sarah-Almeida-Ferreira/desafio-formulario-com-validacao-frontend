import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useMask } from "@react-input/mask";

const masks = {
  tel: {
    mask: "(__) _____-____",
    replacement: { _: /\d/ },
  },
};

const Input = ({
  value,
  onChange,
  error,
  label,
  type,
  name,
  required,
  placeholder,
  isFirstRender,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);
  const inputMask = useMask(masks[type]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputRef?.current?.validationMessage !== error) {
      inputRef?.current?.setCustomValidity(error || "");
      if (isFirstRender) return;
      inputRef?.current?.reportValidity();
    }
  }, [error, isFirstRender]);

  return (
    <div className="field">
      <label htmlFor={name} data-testid="input-label" className="label">
        {label}
        {required && <span className="text-primary-default ml-3">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        title={label}
        value={inputValue}
        onChange={handleChange}
        required={required}
        ref={masks[type] ? inputMask : inputRef}
        placeholder={placeholder}
        data-testid="input"
        className="input"
        autoComplete="on"
      />
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  isFirstRender: PropTypes.bool,
};

export default Input;
