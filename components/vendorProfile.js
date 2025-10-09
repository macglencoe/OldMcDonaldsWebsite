export const VendorProfile = ({ name, subtitle, description, imgSrc, website, menu, children }) => {
    return (
        <div className="bg-accent/10 border border-accent/30 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
                {imgSrc && (
                    <div className="md:w-1/3 w-full max-h-[300px] overflow-hidden">
                        <img
                            src={imgSrc}
                            alt={name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <div className="flex flex-col justify-between p-6 md:w-2/3 w-full">
                    <div className="mb-4">
                        <h2 className="text-3xl font-extrabold text-gray-900">{name}</h2>
                        {subtitle && (
                            <p className="text-gray-500 text-lg mt-1">{subtitle}</p>
                        )}
                        <hr className="border-t-2 border-[var(--foreground)] mt-4 mb-3 w-16" />
                        <p className="text-gray-700 leading-relaxed">{description}</p>

                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {website && (
                            <a
                                href={website}
                                className="bg-accent hover:bg-background !text-background hover:!text-accent font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-sm"
                            >
                                Visit Website
                            </a>
                        )}
                        {menu && (
                            <a
                                href={menu}
                                className="bg-white border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:!text-background font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-sm"
                            >
                                View Menu
                            </a>
                        )}
                    </div>
                </div>
            </div>
            {
                children && (
                    <div className="mt-4 overflow-x-auto p-3">
                        {children}
                    </div>
                )
            }
        </div>
    );
};

export default VendorProfile;
