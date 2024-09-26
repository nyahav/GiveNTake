import { useState, useEffect } from 'react';
import axios from 'axios';

const useCountries = () => {
    // Dynamically get all countries list
    const [countries, setCountries] = useState([]);

    const fetchCountries = async () => {
      try {
        const { data } = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = data.sort((a, b) => {
          const nameA = a.name.common.toUpperCase();
          const nameB = b.name.common.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        return sortedCountries;

      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    useEffect(() => {
      (async () => {
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries);
      })();
  
    }, []);

  return countries;
};

export default useCountries;