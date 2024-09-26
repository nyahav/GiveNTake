import React, { useState, useEffect } from 'react';

const baseUrl = 'https://nominatim.openstreetmap.org/reverse?';

const GetUserCountryUsingNavGeo = () => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: {
            latitude: '',
            longitude: '',
        },
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            // Browser doesn't support geolocation
            return;
        }

        function success(position) {
            setLocation({
              loaded: true,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            });
          
            // Make a geocoding API request to Nominatim with error handling
            fetch(`${baseUrl}lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Nominatim API request failed'); // Throw error for non-200 status
                }   
                return response.json();
              })
              .then(data => {
                // Extract the country name from the response (assuming success)
                const country_code = data.address && data.address.country_code; // Check for existence
                setLocation(prevLocation => ({
                  ...prevLocation,
                  country_code,
                }));
              })
              .catch(error => console.error('Error fetching location details:', error));
          }

        function error() {
            // Geolocation API request failed
        }

        navigator.geolocation.getCurrentPosition(success, error);
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    return location.country;   
};

export default GetUserCountryUsingNavGeo;
