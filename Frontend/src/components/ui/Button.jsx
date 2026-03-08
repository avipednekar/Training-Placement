const baseClasses =
  "inline-flex items-center justify-center rounded-button font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-primary text-white hover:bg-blue-600",
  secondary:
    "bg-white text-primary border border-primary hover:bg-primary hover:text-white",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm md:text-base",
  lg: "px-6 py-3 text-base md:text-lg",
};

const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  children,
  ...props
}) => {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;

