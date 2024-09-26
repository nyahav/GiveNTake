import React, { useEffect, useState } from 'react'
import { Button, Dropdown, TextInput } from 'flowbite-react'
import s from './FeedFilters.module.scss'
import CitySelector from '../RHF/Location/CitySelector'
import { IoIosClose } from 'react-icons/io'
import { FiChevronDown, FiFilter } from 'react-icons/fi'
import LocationSelector from '../RHF/Location/LocationSelector'
import { useForm } from 'react-hook-form'
import { CATEGORIES, RADIUS_LIST } from '../../utils/staticData'
import { Link, useSearchParams } from 'react-router-dom'
import { FaEarthAmericas } from 'react-icons/fa6'

export function FeedFilters({ defaultValues, onChange }) {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')

  const isLocationOfUserExist =
    defaultValues?.location?.geometry.coordinates[0] && defaultValues?.location?.geometry.coordinates[1]
  const [isAllLocations, setIsAllLocations] = useState(!isLocationOfUserExist)

  const getCategoryNameFromHandle = category ? CATEGORIES[category.toUpperCase()].name : null

  const defaultFormValues = {
    ...defaultValues,
    category: getCategoryNameFromHandle,
    location: {
      ...defaultValues.location,
      country: defaultValues.location?.country || '',
      city: defaultValues.location?.city || '',
      lat: defaultValues.location?.geometry?.coordinates[0].toString(),
      long: defaultValues.location?.geometry?.coordinates[1].toString()
    },
    radius: RADIUS_LIST[2]
  }

  const { control, setValue, watch, reset } = useForm({ defaultValues: defaultFormValues })

  const resetForm = () => {
    setIsAllLocations(false)
    reset(defaultFormValues)
  }

  useEffect(() => {
    if (watch('location.lat') && watch('location.long')) setIsAllLocations(false)
  }, [watch('location.city'), watch('location.country')])

  // for every filters change update the parent component that filters has been changed
  useEffect(() => {
    const filters = {
      category: watch('category'),
      ...(!isAllLocations && { location: watch('location') }),
      radius: watch('radius')
    }
    onChange(filters)
  }, [watch('category'), watch('location.lat'), watch('location.long'), watch('radius'), isAllLocations])

  // in case of url changing
  useEffect(() => {
    setValue('category', getCategoryNameFromHandle)
  }, [category])

  return (
    <form className={s.wrapper}>
      <div className={s.filtersWrap}>
        <Link to="" onClick={() => resetForm()}>
          <FiFilter size={18} color="#333" />
        </Link>
        <span>
          <span>Show me</span>
          <div className={s.filterBox}>
            <Dropdown className={s.dropdown} label={watch('category') || 'All Categories'} inline>
              <div className={s.categoriesList}>
                {Object.entries(CATEGORIES).map(([k, v]) => {
                  const to = k === 'ALL_CATEGORIES' ? '' : `?category=${k.toLowerCase()}`

                  return (
                    <Link key={k} to={to}>
                      <v.icon />
                      <span>{v.name}</span>
                    </Link>
                  )
                })}
              </div>
            </Dropdown>
          </div>
        </span>

        <span>
          <span>from</span>

          <div className={s.filterBox}>
            <Dropdown
              className={s.dropdown}
              label={isAllLocations ? 'Earth' : watch('location.city') + ', ' + watch('location.country')}
              inline>
              <div style={{ padding: '.2em' }}>
                <LocationSelector
                  {...{ control }}
                  names={{
                    city: 'location.city',
                    country: 'location.country',
                    lat: 'location.lat',
                    long: 'location.long'
                  }}
                  style={{ flexDirection: 'column', gap: '0', minWidth: '200px' }}
                  onKeyDown={e => e.stopPropagation()}
                  // withLabels
                />
                <div className="flex ">
                  <Button className="w-full mt-1 mr-1" color="gray" onClick={() => setIsAllLocations(false)}>
                    <span>Set Location</span>
                  </Button>
                  <Button
                    className="button w-full mt-1 align-center justify-center w-33"
                    onClick={() => setIsAllLocations(true)}>
                    <FaEarthAmericas color="#fff" />
                  </Button>
                </div>
              </div>
            </Dropdown>
          </div>
        </span>
        {!isAllLocations && (
          <span>
            <span>in radius of</span>
            <div className={s.filterBox}>
              <Dropdown className={s.dropdown} label={`${watch('radius') > 0 ? watch('radius') : '∞'} Km`} inline>
                {RADIUS_LIST.map(val => {
                  let key = val
                  if (val === -1) val = '∞'
                  return (
                    <Dropdown.Item key={key} className={s.item} onClick={() => setValue('radius', key)}>
                      {val} Km
                    </Dropdown.Item>
                  )
                })}
              </Dropdown>
            </div>
          </span>
        )}
      </div>
    </form>
  )
}

export default FeedFilters
