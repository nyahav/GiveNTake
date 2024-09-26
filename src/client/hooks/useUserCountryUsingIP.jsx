import { useState, useEffect } from 'react';
import axios from 'axios';

const GetUserCountryUsingIP = () => {
  const [country, setCountry] = useState(null);

  const countryCodeToName = async (countryCode) => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      return response.data[0].name.common; // Return the country name
    } catch (error) {
      console.error('Error fetching country details:', error); // Log error if request fails
      return 'Unknown';
    }
  };


  useEffect(() => {

    (async () => {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = ipResponse.data.ip;

        const countryResponse = await axios.get(`https://ipinfo.io/${ipAddress}?token=58c4e5e3d333d3`);
        const countryCode = countryResponse.data.country;

        const country = await countryCodeToName(countryCode);
        setCountry(country);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();

  }, []);

  return country;
};

export default GetUserCountryUsingIP;