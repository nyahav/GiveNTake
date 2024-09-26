import { Label, Select } from "flowbite-react";
import CountrySelector from "./CountrySelector";
import CitySelector from "./CitySelector";
import { useController } from "react-hook-form";
import StreetSelector from "./StreetSelector";

// controlled by react-hook-form 
const LocationSelector = ({ control, names, style, withLabels, ...props }) => {

    const { field: fieldCountry, fieldState: { error: errorCountry } } = useController({ name: names.country, control });
    const { field: fieldCity, fieldState: { error: errorCity } } = useController({ name: names.city, control });
    // const { field: fieldStreet, fieldState: { error: errorStreet } } = useController({ name: names.street, control });
    const { field: fieldLat } = useController({ name: names.lat, control });
    const { field: fieldLong } = useController({ name: names.long, control });

    const onCountryChange = (city) => {
        fieldCity.onChange('');
    };


    const onCityChange = (city) => {
        fieldLat.onChange(city.lat);
        fieldLong.onChange(city.long);
    };

    return <div className='flex gap-4' {...{ style }}>
        {withLabels && <Label value="Country" />}
        <CountrySelector field={fieldCountry} helperText={errorCountry?.message} onChange={onCountryChange} />
        
        {withLabels && <Label value="City" />}
        <CitySelector field={fieldCity} disabled={!fieldCountry.value} countryName={fieldCountry.value} helperText={errorCity?.message} onChange={onCityChange} {...{props}} />
        {/* <StreetSelector field={fieldStreet} disabled={!fieldCity.value} cityName={fieldCity.value} helperText={errorStreet?.message} /> */}
    </div>
};

export default LocationSelector;