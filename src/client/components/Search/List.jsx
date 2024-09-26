import Item from './Item'
import { $Wrapper } from './List.styled'
import profileImg from '../../assets/images/profile-img.jpeg'
import { Spinner } from 'flowbite-react'

const List = ({ isSearchFocused, users, isFetchingUsers, onClick }) => {
  return (
    <$Wrapper>
      {!isSearchFocused && !isFetchingUsers}
      {users?.map(user => (
        <Item
          key={user._id}
          title={`${user.firstName} ${user.lastName}`}
          imgSrc={user.imgUrl || profileImg}
          link={`/profile/${user._id}`}
          {...{ onClick }}
        />
      ))}

      {isFetchingUsers && <Item title={<Spinner />} style={{ cursor: 'normal' }} />}

      {isSearchFocused && !isFetchingUsers && users.length === 0 && (
        <Item title="No matching results." style={{ cursor: 'normal' }} />
      )}
    </$Wrapper>
  )
}

export default List
