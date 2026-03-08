const SelectField = ({
  label,
  name,
  value,
  onChange,
  children,
  error,
  className = "",
  ...props
}) => {
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-sm md:text-base text-gray-700 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
          error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;

