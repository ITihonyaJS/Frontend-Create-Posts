import React, { useEffect, useState } from 'react'
//необходим чтобы вытащить id  из url
import { useParams } from 'react-router-dom'
import { Post } from '../components/Post'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import ReactMarkdown from 'react-markdown'
import axios from '../axios.js'

export const FullPost = () => {
	const [post, setPost] = useState()
	const [isLoadingPost, setIsLoadingPost] = useState(true)
	const { id } = useParams()

	//теперь делаем запрос при первом рендере...уже локально.Нет смысла хранить одну статью в redux
	useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then(resp => {
				setPost(resp.data)
				setIsLoadingPost(false)
			})
			.catch(err => {
				console.warn(err)
				alert('Ошибка при получении статьи')
			})
	}, [])
	if (isLoadingPost) {
		return <Post isFullPost isLoading={isLoadingPost} />
	}

	return (
		<>
			<Post
				id={post._id}
				title={post.title}
				imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
				user={post.authorPost}
				createdAt={post.createdAt}
				viewsCount={post.viewCountPost}
				commentsCount={3}
				tags={post.tags}
				//полная запись
				isFullPost
			>
				{/* красивое отображение текста */}
				{/* <p>{post.text}</p> */}
				<ReactMarkdown children={post.text} />
			</Post>
			<CommentsBlock
				items={[
					{
						user: {
							fullName: 'Вася Пупкин',
							avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
						},
						text: 'Это тестовый комментарий 555555',
					},
					{
						user: {
							fullName: 'Иван Иванов',
							avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
						},
						text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
					},
				]}
				isLoading={false}
			>
				<Index />
			</CommentsBlock>
		</>
	)
}
