import CompanyLogo from "../ui/CompanyLogo";

const TopCompaniesSection = ({ companies }) => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Top Recruiters
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {companies.length > 0 ? (
            companies.slice(0, 8).map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))
          ) : (
            <p className="text-gray-500">No companies registered yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white px-6 py-8 rounded-xl shadow-sm border border-gray-100 text-center w-full md:w-auto min-w-[180px] hover:shadow-lg transition-all group">
      <div className="mx-auto mb-4 w-fit group-hover:scale-110 transition-transform">
        <CompanyLogo
          companyName={company.name}
          logoUrl={company.logoUrl}
          sizeClass="w-20 h-20"
          roundedClass="rounded-2xl"
          textClass="text-3xl"
          imagePaddingClass="p-3"
        />
      </div>
      <h3 className="font-bold text-gray-800 mb-1 text-sm">{company.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{company.domain}</p>
      <div className="text-xs text-gray-400 flex items-center justify-center">
        <i className="ri-map-pin-line mr-1" /> {company.address}
      </div>
    </div>
  );
};

export default TopCompaniesSection;

