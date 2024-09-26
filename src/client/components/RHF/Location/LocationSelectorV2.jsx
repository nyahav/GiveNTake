import { TextInput } from "flowbite-react";
import {usePlacesWidget} from 'react-google-autocomplete';

// controlled by react-hook-form 
const LocationSelector = ({ control, names }) => {
    const { ref, autocompleteRef } = usePlacesWidget({
        apiKey: "API_KEY",
        onPlaceSelected: (place) => console.log(place)
      })


    return <div className='flex gap-4'>
        <TextInput ref={ref} autoComplete={autocompleteRef} />
    </div>
};

export default LocationSelector;