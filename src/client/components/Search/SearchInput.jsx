import { $Wrapper } from './SearchInput.styled'
import { MdSearch } from 'react-icons/md'
import { TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import profileImg from '../../assets/images/profile-img.jpeg'
import List from './List'
import useUsers from '../../api/users/useUsers'
import { useDebounce } from '@uidotdev/usehooks'
import { useLocation } from 'react-router-dom'

const SearchInput = ({ onBlur, active }) => {
  const location = useLocation()

  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const debouncedSearchValue = useDebounce(searchValue, 600)

  const { data: users, isFetching: isFetchingUsers } = useUsers({
    filters: { searchQuery: debouncedSearchValue },
    enabled: !!debouncedSearchValue
  })

  const searchRef = useRef(null)

  const handleBlur = () => {
    setIsSearchFocused(false)
    setSearchValue('')
    searchRef.current.blur()

    setTimeout(() => {
      onBlur?.()
    }, 100)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        handleBlur()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleOverlayClick = () => {
    setSearchValue('')
  }

  useEffect(() => {
    if (active) {
      searchRef.current.focus()
      handleSearchFocus()
    }
  }, [active])

  return (
    <$Wrapper>
      <TextInput
        icon={MdSearch}
        onChange={e => setSearchValue(e.target.value)}
        color="light"
        value={searchValue}
        onFocus={handleSearchFocus}
        onBlur={handleBlur}
        placeholder="Search profiles"
        ref={searchRef}
      />

      <List {...{ users, isSearchFocused, isFetchingUsers }} onClick={handleBlur} />

      <div className={`overlay ${isSearchFocused ? 'visible' : ''}`} onClick={handleOverlayClick} />
    </$Wrapper>
  )
}

export default SearchInput
