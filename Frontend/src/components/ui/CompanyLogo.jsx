import { useEffect, useState } from "react";
import {
  getCompanyLogo,
  getCompanyLogoFallbackColor,
} from "../../utils/companyBranding";

const CompanyLogo = ({
  companyName,
  logoUrl,
  sizeClass = "w-12 h-12",
  roundedClass = "rounded-lg",
  textClass = "text-lg",
  imagePaddingClass = "p-2",
}) => {
  const resolvedLogo = getCompanyLogo(companyName, logoUrl);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [resolvedLogo]);

  if (resolvedLogo && !imageError) {
    return (
      <div
        className={`${sizeClass} ${roundedClass} bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center`}
      >
        <img
          src={resolvedLogo}
          alt={`${companyName} logo`}
          className={`w-full h-full object-contain ${imagePaddingClass}`}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} ${roundedClass} bg-gradient-to-br ${getCompanyLogoFallbackColor(
        companyName
      )} text-white shadow-sm flex items-center justify-center font-bold ${textClass}`}
      aria-label={`${companyName} logo fallback`}
    >
      {String(companyName || "C")
        .trim()
        .charAt(0)
        .toUpperCase()}
    </div>
  );
};

export default CompanyLogo;
