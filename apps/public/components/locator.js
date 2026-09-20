import { useEffect, useRef } from "react";
import useSiteSettings from "@/hooks/useSiteSettings";

const Locator = () => {
    const containerRef = useRef(null);
    const settings = useSiteSettings();

    useEffect(() => {
        const loadStoreLocator = async () => {
            if (!window.google) {
                const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

                await import('../public/lib/index.min.js');

                const apiLoader = document.createElement('gmpx-api-loader');
                apiLoader.key = key;
                apiLoader['solution-channel'] = 'GMP_QB_locatorplus_v11_cABDF';
                document.body.appendChild(apiLoader);

                await customElements.whenDefined('gmpx-store-locator');

                const storeLocator = document.createElement('gmpx-store-locator');
                storeLocator.mapId = '9843e7578ad628b0ad7b55f9';
                containerRef.current.appendChild(storeLocator);

                const CONFIGURATION = {
                    "locations": [
                        {
                            "title": settings.business.name,
                            "address1": settings.business.streetAddress,
                            "address2": `${settings.business.addressLocality}, ${settings.business.addressRegion} ${settings.business.postalCode}, ${settings.business.addressCountry}`,
                            "coords": { "lat": settings.business.latitude, "lng": settings.business.longitude },
                            "placeId": "ChIJfeseHkAHyokRyt3qHueG008"
                        }
                    ],
                    "mapOptions": { "center": { "lat": 38.0, "lng": -100.0 }, "fullscreenControl": true, "mapTypeControl": false, "streetViewControl": false, "zoom": 4, "zoomControl": true, "maxZoom": 17, "mapId": "" },
                    "mapsApiKey": key,
                    "capabilities": { "input": false, "autocomplete": false, "directions": false, "distanceMatrix": false, "details": false, "actions": false }
                };

                storeLocator.configureFromQuickBuilder(CONFIGURATION);

            }
        };
        loadStoreLocator();
    }, [settings]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>

        </div>
    )
}

export default Locator
