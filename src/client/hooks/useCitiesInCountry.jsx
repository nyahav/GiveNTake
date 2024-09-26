import { useState, useEffect } from 'react';
import axios from 'axios';

const USERNAME = 'giventake';

const useCitiesInCountry = (countryName) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCountryCode = async (country, username) => {
    const response = await axios.get(`https://secure.geonames.org/searchJSON?q=${encodeURIComponent(country)}&maxRows=1&username=${USERNAME}`);
    const countryCode = response.data.geonames[0]?.countryCode;
    if (countryCode) {
      return countryCode;
    } else {
      throw new Error('Country not found');
    }
  };

  const fetchCities = async (countryCode, username) => {

    const response = await axios.get(`https://secure.geonames.org/searchJSON?country=${countryCode}&maxRows=1000&username=${username}`);
    const cityData = response.data.geonames.map(city => ({
      name: city.name,
      lat: city.lat,
      long: city.lng
    }));

    return cityData;
  };

  useEffect(() => {

    (async () => {
      try {
        if (countryName) {
          const countryCode = await fetchCountryCode(countryName, USERNAME);
          const fetchedCities = await fetchCities(countryCode, USERNAME);
          setCities(fetchedCities);
        }

      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);

      } finally {
        setLoading(false);
      }

    })();
  }, [countryName]);

  return { cities, loading };
};

export default useCitiesInCountry;
