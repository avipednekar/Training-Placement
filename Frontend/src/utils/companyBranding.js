const companyLogoMap = {
  "tata consultancy services":
    "https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/TCS-logo-black-CMYK.svg",
  infosys:
    "https://www.infosys.com/content/dam/infosys-web/en/global-resource/media-resources/infosys-logo-png.png",
  wipro: "/assets/company-logos/wipro-official.svg",
  cognizant:
    "https://mma.prnewswire.com/media/1794711/Cognizant_Logo.jpg?p=facebook",
  capgemini:
    "https://www.capgemini.com/wp-content/themes/capgemini2025/assets/images/logo.svg",
};

export const getCompanyLogo = (companyName, logoUrl) => {
  const normalizedName = String(companyName || "").trim().toLowerCase();
  const isPlaceholderLogo =
    typeof logoUrl === "string" && logoUrl.startsWith("/assets/company-logos/");
  const isDeprecatedWiproHotlink =
    normalizedName === "wipro" &&
    typeof logoUrl === "string" &&
    (logoUrl.includes("wipro.com/content/dam/nexus/en/brand/images/") ||
      logoUrl.includes("wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg") ||
      logoUrl.includes("/assets/company-logos/wipro-official.png"));

  if (companyLogoMap[normalizedName] && (isPlaceholderLogo || isDeprecatedWiproHotlink)) {
    return companyLogoMap[normalizedName];
  }

  if (logoUrl && !isPlaceholderLogo) {
    return logoUrl;
  }

  return companyLogoMap[normalizedName] || "";
};

export const getCompanyLogoFallbackColor = (companyName) => {
  const colors = [
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-indigo-600",
  ];

  const name = String(companyName || "C");
  const colorIndex = name.charCodeAt(0) % colors.length;
  return colors[colorIndex];
};
