import { useEffect, useRef } from "react";

const Locator = () => {
    const containerRef = useRef(null);

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
                        { "title": "Old McDonalds Pumpkin Patch \u0026 Corn Maze", "address1": "1597 Arden Nollville Rd", "address2": "Inwood, WV 25428, USA", "coords": { "lat": 39.38584378443022, "lng": -78.04222809325408 }, "placeId": "ChIJfeseHkAHyokRyt3qHueG008" }
                    ],
                    "mapOptions": { "center": { "lat": 38.0, "lng": -100.0 }, "fullscreenControl": true, "mapTypeControl": false, "streetViewControl": false, "zoom": 4, "zoomControl": true, "maxZoom": 17, "mapId": "" },
                    "mapsApiKey": "AIzaSyCcdVPh_Oa6KTCMp294s5yAJWLAA60ZXa0",
                    "capabilities": { "input": false, "autocomplete": false, "directions": false, "distanceMatrix": false, "details": false, "actions": false }
                };

                storeLocator.configureFromQuickBuilder(CONFIGURATION);

            }
        };
        loadStoreLocator();
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>

        </div>
    )
}

export default Locator