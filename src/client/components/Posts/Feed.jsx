import Post from './Post'
import styles from './Feed.module.scss'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { LeftArrow, RightArrow } from './Arrows'
import { ScrollMenu } from 'react-horizontal-scrolling-menu'
import { useInView, InView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { usePaginatedPosts } from '../../api/posts/usePosts'
import { Spinner } from 'flowbite-react'
import EmptyState from '../EmptyState'
import NoPostsImg from '../../assets/images/empty-states/no-posts.svg'
import { usePostAction } from '../../api/posts/usePostAction'

export const showAs = {
  LIST: 'list', // default
  GRID: 'grid',
  MASONRY: 'masonry',
  ROW: 'row'
}

const Feed = ({
  filters,
  enabled,
  styleOrder = showAs.LIST,
  noTitle = false,
  noActions = false,
  isLoggedIn,
  featuredPosts,
  emptyState = (
    <EmptyState img={NoPostsImg} title="No posts" content="It seems like we don't have any post to show you." />
  )
}) => {
  const { data: posts, isLoading, refetch: refetchPosts, fetchNextPage } = usePaginatedPosts({ filters, enabled })
  const { mutate: postAction } = usePostAction({ filters })
  const { ref: refPost, inView: inViewPost } = useInView() // infintie scrolling  // { threshold: 0.01 }

  let postsWrapperClass = styles.list
  if (styleOrder === showAs.GRID) postsWrapperClass = styles.grid
  else if (styleOrder === showAs.MASONRY) postsWrapperClass = styles.masonry
  else if (styleOrder === showAs.ROW) postsWrapperClass = styles.row

  let postsMapped = []
  postsMapped = posts?.pages?.map(group =>
    group.docs?.map(post => {
      const postParams = {
        postId: post._id,
        userId: post.user._id,
        fullName: `${post.user.firstName} ${post.user.lastName}`,
        profilePic: post.user?.imgUrl,
        helpDate: post.helpDate,
        createdAt: post.createdAt,
        location: post?.location,
        postPic: post.imgUrl,
        title: post?.title,
        description: post.description,
        likes: post.usersSaved?.length || 0,
        interested: post.usersInterested?.length || 0,
        isSavedByUser: post.isSavedByUser,
        isUserInterested: post.isUserInterested,
        isUserReported: post.isUserReported,
        isSelf: post.isSelf,
        featuredPost: featuredPosts
      }
      let postTag = (
        <Post key={post._id} {...postParams} {...{ isLoading, noTitle, noActions, isLoggedIn, post, postAction }} />
      )

      return (
        <InView as="div" key={post._id} style={{ width: '100%' }}>
          {postTag}
        </InView>
      )
    })
  )

  if (styleOrder === showAs.MASONRY) {
    postsMapped = postsMapped ? (
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="10px">
          {postsMapped}
          <InView as="div">
            <div ref={refPost} style={{ width: '100px', height: '10px' }}></div>
          </InView>
        </Masonry>
      </ResponsiveMasonry>
    ) : (
      <></>
    )
  } else if (styleOrder === showAs.ROW) {
    postsMapped = (
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {postsMapped}
        <InView as="div">
          <div ref={refPost} style={{ width: '100px', height: '10px' }}></div>
        </InView>
      </ScrollMenu>
    )
  } else if (styleOrder === showAs.LIST) {
    postsMapped = (
      <>
        {postsMapped}
        <InView as="div">
          <div ref={refPost} style={{ width: '100px', height: '10px' }}></div>
        </InView>
      </>
    )
  }

  useEffect(() => {
    if (inViewPost) {
      // console.log('inViewPost: ', inViewPost)
      fetchNextPage()
    }
  }, [inViewPost])

  if (isLoading) return <Spinner />

  const postsLength = posts.pages[posts.pages.length - 1].totalDocs
  if (!postsLength) return emptyState
  return (
    <>
      <div className={postsWrapperClass}>{postsMapped}</div>
      {/* <div style={{ width: '100px', height: '300px' }}></div> */}
    </>
  )
}

export default Feed
