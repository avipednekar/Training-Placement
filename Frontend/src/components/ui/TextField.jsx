const TextField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  leftIcon,
  className = "",
  ...props
}) => {
  const hasIcon = Boolean(leftIcon);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {hasIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <i className={`${leftIcon} text-gray-400 text-lg`}></i>
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-sm md:text-base text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
            hasIcon ? "pl-11" : ""
          } ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextField;

