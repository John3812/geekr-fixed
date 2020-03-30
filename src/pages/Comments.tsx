import React, { useState, useEffect } from 'react'
import Comments from '../components/blocks/Comments/Main'
import { useParams } from 'react-router'
import PostItem from '../components/blocks/PostItem'
import { Typography } from '@material-ui/core'
import { getPost } from '../api'
import { Post } from '../interfaces'
import PostSkeleton from '../components/skeletons/Post'
import Scrollbar from '../components/Scrollbar'

const CommentsPage = () => {
  const [post, setPost] = useState<Post.Post>()
  const [error, setError] = useState<string>()
  const { id } = useParams()

  useEffect(() => {
    const get = async () => {
      // Reset error state
      setError(null)

      try {
        setPost((await getPost(id)).data.article)
      } catch (e) {
        if (e.statusCode === 404) return setError('Статья не найдена')
        else return setError(e.message)
      }
    }
    get()
  }, [id])

  if (error) return <Typography>error: {error}</Typography>
  
  return (
    <Scrollbar>
      {!post && <PostSkeleton />}
      {post &&<PostItem style={{ marginBottom: 0 }} post={post} />}
      <Comments authorId={Number(post?.author?.id || 0)} postId={id} />
    </Scrollbar>
  )
}

export default CommentsPage