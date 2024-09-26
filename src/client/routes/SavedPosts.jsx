import { usePosts } from '../api/posts/usePosts.jsx'
import { Spinner } from 'flowbite-react'
import Feed, { showAs } from '../components/Posts/Feed.jsx'
import { useUser } from '../api/users/useUser.jsx'
import { usePostAction } from '../api/posts/usePostAction.jsx'
import EmptyState from '../components/EmptyState.jsx'
import NoPostsImg from '../assets/images/empty-states/no-posts.svg'

export default function SavedPosts() {
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser, isLoggedIn } = useUser()

  const filters = { onlySavedPosts: 1 }

  return (
    <>
      <div>

        <Feed
          {...{ filters, isLoggedIn }}
          styleOrder={showAs.MASONRY}
          emptyState={
            <EmptyState img={NoPostsImg} title="No saved posts" content="You can save posts to read later." />
          }
        />
      </div>
    </>
  )
}
