import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useEffect, useRef, useState, useMemo } from "react";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Select = ({
  value,
  onChange,
  error,
  label,
  required,
  options,
  placeholder = "",
  name,
  isFirstRender,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const searchInputRef = useRef(null);
  const selectInputRef = useRef(null);
  const selectRef = useRef(null);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setTimeout(() => {
      if (!isOpen) {
        searchInputRef.current?.focus();
      }
    }, 100);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    setSearchTerm("");
    const target = { name, value: option.key };
    onChange({ target });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event, option) => {
    if (event.key === "Enter" || event.key === " ") {
      if (option) handleOptionClick(option);
      else toggleDropdown();
    }
  };

  const closeDropdown = (event) => {
    if (selectRef?.current?.contains(event.relatedTarget)) return;
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("focusout", closeDropdown);
    return () => {
      document.removeEventListener("focusout", closeDropdown);
    };
  }, []);

  useEffect(() => {
    const selected =
      options.find((option) => option.key === value)?.label || "";
    setSelectedOption(selected);
  }, [options, value]);

  useEffect(() => {
    const input = selectInputRef.current;
    if (input) {
      input.setCustomValidity(error || "");
      if (!isFirstRender) input.reportValidity();
    }
  }, [error, isFirstRender]);

  return (
    <div
      data-testid="select-container"
      className="select-container"
      ref={selectRef}
    >
      <div className="field">
        <label htmlFor={name} data-testid="select-label" className="label">
          {label}
          {required && (
            <span
              data-testid="select-required"
              className="text-primary-default ml-3"
            >
              *
            </span>
          )}
        </label>
        <div
          role="button"
          tabIndex={0}
          onClick={toggleDropdown}
          onKeyDown={(e) => handleKeyDown(e, null)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          data-testid="select-dropdown-toggle"
          className="input relative"
        >
          <input
            type="text"
            id={name}
            name={name}
            title={label}
            placeholder={selectedOption || placeholder}
            value={selectedOption}
            required={required}
            ref={selectInputRef}
            onChange={() => {}}
            aria-controls="select-options-list"
            data-testid="select-input"
            tabIndex="-1"
            className="bg-transparent w-full h-full outline-none"
            autoComplete="off"
          />
          <FontAwesomeIcon
            icon={isOpen ? faCaretUp : faCaretDown}
            className="absolute right-3 bottom-3 opacity-80"
          />
        </div>

        {isOpen && (
          <div
            data-testid="select-dropdown"
            className="select-dropdown is-open"
          >
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={handleSearchChange}
              ref={searchInputRef}
              aria-label="Pesquisar opções"
              data-testid="select-search-input"
              className="input select-search-input"
              id="select-search-input"
            />
            <ul
              id="select-options-list"
              role="listbox"
              data-testid="select-options-list"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.key}
                    role="option"
                    aria-selected={selectedOption === option.label}
                    onClick={() => handleOptionClick(option)}
                    onKeyDown={(e) => handleKeyDown(e, option)}
                    className={`select-option ${
                      selectedOption === option.label ? "selected" : ""
                    }`}
                    tabIndex={0}
                    data-testid={`select-option-${option.key}`}
                    aria-owns={name}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li data-testid="select-no-options" className="select-option">
                  Nenhuma opção encontrada
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  isFirstRender: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
};

export default Select;
