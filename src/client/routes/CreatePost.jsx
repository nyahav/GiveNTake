import styles from './CreatePost.module.scss'
import PostForm from '../components/Posts/PostForm.jsx'
import { useCreatePost } from '../api/posts/useCreatePost.jsx'

const CreatePost = () => {
  const { mutate: createPost, isPending } = useCreatePost()

  return (
    <div className={styles.postCreator}>
      <h4>Let's Start!</h4>
      <p>
        Ready to tap into the collective wisdom of our amazing community?
        <br /> Don't hesitate to create a new post if you find yourself in need of assistance.
        <br /> <i>Just as you've helped others, it's now your turn to ask for support.</i>
        <br /> Together, we can overcome any challenge. Describe your situation, and let the magic of our community work
        its wonders! <br />{' '}
      </p>

      <PostForm onSubmit={createPost} {...{ isPending }} />
    </div>
  )
}

export default CreatePost
