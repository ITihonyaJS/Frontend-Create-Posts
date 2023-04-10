import React, { useEffect } from 'react'

//импортируем useDispatch для того чтобы можно было отправлять actions (типа fetchPosts)
import { useDispatch, useSelector } from 'react-redux'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

export const Home = () => {
	const dispatch = useDispatch()
	//берём state, а именно state.postsDevTools(мы так его назвали в файле store.js)
	const { posts, tags } = useSelector(state => state.postsDevTools)
	const userData = useSelector(state => state.authDevTools.data)

	//проверяем...идёт ли загрузка
	const isPostsLoading = posts.status === 'loading'
	//проверяем...идёт ли загрузка
	const isTagsLoading = tags.status === 'loading'
	//говорим,что при первом рендере нам необходимо сделать запрос при помощи axios
	useEffect(() => {
		//теперь мы отправляем action(fetchPosts) с помощью dispatch и вызываем его!!!
		dispatch(fetchPosts())
		//теперь мы отправляем action(fetchTags) с помощью dispatch и вызываем его!!!
		dispatch(fetchTags())
	}, [])

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' />
				<Tab label='Популярные' />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((post, index) =>
						isPostsLoading ? (
							<Post
								key={index}
								//добавляем пропс isLoading чтобы отображать загрузку статей когда это происходит.Этим управляет redux
								isLoading={true}
							/>
						) : (
							<Post
								id={post._id}
								title={post.title}
								imageUrl={`http://localhost:4444${post.imageUrl}`}
								user={post.authorPost}
								createdAt={post.createdAt}
								viewsCount={post.viewCountPost}
								commentsCount={3}
								tags={post.tags}
								isEditable={userData?._id === post.authorPost._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
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
					/>
				</Grid>
			</Grid>
		</>
	)
}
