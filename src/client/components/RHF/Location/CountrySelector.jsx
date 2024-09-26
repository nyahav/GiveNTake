import { Select } from 'flowbite-react'
import useUserCountryUsingIP from '../../../hooks/useUserCountryUsingIP.jsx'
import useUserCountryUsingNavGeo from '../../../hooks/useUserCountryUsingNavGeo.jsx'
import useCountries from '../../../hooks/useCountries'
import { useEffect } from 'react'

const CountrySelector = ({ field, style, helperText, onChange }) => {
  const countryUsingIP = useUserCountryUsingIP()
  const countryUsingNavGeo = useUserCountryUsingNavGeo()
  const countries = useCountries()
  const displayedCountry = countryUsingIP || countryUsingNavGeo

  useEffect(() => {
    if (displayedCountry) {
      field.onChange(displayedCountry)
    }
  }, [displayedCountry])

  return (
    <Select
      id="country"
      label="Select your Country"
      className="mb-4 block w-full"
      {...field}
      onChange={e => {
        field.onChange(e.target.value)
        onChange()
      }}
      {...{ style, helperText }}>
      <option value="">Choose country</option>
      {countries?.map(country => {
        const countryName = country.name.common
        return (
          <option key={countryName} value={countryName}>
            {countryName}
          </option>
        )
      })}
    </Select>
  )
}

export default CountrySelector
