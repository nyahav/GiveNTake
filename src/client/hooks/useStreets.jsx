import { useState, useEffect } from 'react';
import axios from 'axios';

const useStreets = (city) => {
    const [streets, setStreets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBoundingBoxForCity = async (city) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search.php?q=${city}&format=json&limit=1`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const latMin = parseFloat(lat) - 0.05; // Adjusting latitude by 0.05 degrees
                const lonMin = parseFloat(lon) - 0.05; // Adjusting longitude by 0.05 degrees
                const latMax = parseFloat(lat) + 0.05; // Adjusting latitude by 0.05 degrees
                const lonMax = parseFloat(lon) + 0.05; // Adjusting longitude by 0.05 degrees
                const boundingBox = `${latMin},${lonMin},${latMax},${lonMax}`;
                return boundingBox;
            } else {
                throw new Error('City not found');
            }
        } catch (error) {
            console.error('Error fetching bounding box:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchStreets = async () => {
            try {
                setLoading(true);
                const bbox = await fetchBoundingBoxForCity(city); // Fetch bounding box if not provided
                const query = `[out:json][timeout:25];way["highway"](bbox:${bbox});out;`;
                const response = await axios.post('https://overpass-api.de/api/interpreter', { data: query });
                const streetsData = response.data.elements.map(element => element.tags.name).filter(name => name);
                setStreets(streetsData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        if (city) {
            fetchStreets();
        }

    }, [city]);

    return { streets, loading, error };
};

export default useStreets;
