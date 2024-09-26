import React, { useState, useEffect } from 'react'
import styles from './CitySelector.module.css'
import { Spinner, TextInput } from 'flowbite-react'
import useCitiesInCountry from '../../../hooks/useCitiesInCountry'
import { useDebounce } from '@uidotdev/usehooks'

export const showAs = {
  CHANGE: 'Change',
  SEARCH: 'Search'
}

function CitySelector({ field, styleOrder = showAs.SEARCH, countryName, disabled, helperText, onChange, props }) {
  const { cities, loading } = useCitiesInCountry(countryName)
  const [searchInput, setSearchInput] = useState(field.value || '')
  const debouncedSearchValue = useDebounce(searchInput, 600)

  const handleSearchInputChange = event => {
    setSearchInput(event.target.value)
    field.onChange('')
  }

  const handleCitySelect = city => {
    field.onChange(city.name)
    setSearchInput(city.name)
    onChange(city)
  }

  const onSearchInputBlur = () => {
    if (!field.value) setSearchInput('')
  }

  // Filter cities based on the first letters of the search input
  const filteredCities = cities
    .filter(city => city.name?.toLowerCase().startsWith(debouncedSearchValue.toLowerCase()))
    .slice(0, 10)

  return (
    <div className={styles.locationSelection}>
      <TextInput
        className={styles.searchInput}
        placeholder={`${styleOrder === showAs.CHANGE ? showAs.CHANGE : showAs.SEARCH} your city here...`}
        value={searchInput}
        onChange={handleSearchInputChange}
        {...props}
        {...{ disabled, helperText }}
        onBlur={onSearchInputBlur}
        // color='light'
      />
      {!field.value && debouncedSearchValue && (
        <ul className={styles.searchResults}>
          {filteredCities.length === 0 ? (
            <p style={{ marginLeft: '10px' }}>No matching cities found</p>
          ) : (
            filteredCities.map((city, index) => (
              <li key={city.name + index} onClick={() => handleCitySelect(city)}>
                {city.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default CitySelector
