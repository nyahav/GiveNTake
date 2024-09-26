import styles from './Explore.module.scss'
import FeaturedCategories from '../components/Posts/FeaturedCategories.jsx'
import Feed, { showAs } from '../components/Posts/Feed.jsx'
import { usePaginatedPosts, usePosts } from '../api/posts/usePosts.jsx'
import { Spinner } from 'flowbite-react'
import FeedFilters from '../components/Posts/FeedFilters.jsx'
import { useUser } from '../api/users/useUser.jsx'
import { useState } from 'react'
import { usePostAction } from '../api/posts/usePostAction.jsx'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '../api/constants.js'
import WelcomeModal from '../components/WelcomeModal.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Explore() {
  const queryClient = useQueryClient()
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser, isLoggedIn } = useUser()
  const [filters, setFilters] = useState({
    location: user.location
  })

  const onFiltersChange = filters => {
    setFilters(filters)
    queryClient.invalidateQueries(key => key.includes(QUERY_KEY.posts))
  }

  return (
    <>
      {user?.flags?.hideWelcomeModal === false && <WelcomeModal />}

      <div className={styles.feedWrap}>
        <FeedFilters defaultValues={isLoggedIn ? { location: user.location } : {}} onChange={onFiltersChange} />
        <hr />
        <h4 className="mb-0 font-normal">Explore</h4>
        <Feed {...{ isLoggedIn, filters }} styleOrder={showAs.MASONRY} />
      </div>
    </>
  )
}
