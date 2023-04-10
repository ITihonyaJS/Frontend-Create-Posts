import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//импортируем instance, но для удобства называем axios
import axios from '../../axios'

//создаём первый асинхронный action(запрос)
//первый параметр это название action(оно произвольное...сейчас мы решили его назвать posts/fetchPosts)
//второй параметр это асинхронная функция обработчик
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	//объясняем что нам нужно достать data из запроса axios
	const { data } = await axios.get('/posts')
	//и возвращает то что нам прилетит с back
	return data
})

//запрос на получение тегов
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	//объясняем что нам нужно достать data из запроса axios
	const { data } = await axios.get('/tags')
	//и возвращает то что нам прилетит с back
	return data
})

//запрос на удаление статьи
export const fetchRemovePost = createAsyncThunk(
	'/posts/fetchRemovePost',
	async id => {
		const { data } = await axios.delete(`/posts/${id}`)
		//то что возвращается с back и попадает в action.payload
		return data
	}
)

//создаём reduser но он у нас называется slice,т.к. мы используем reduxjs/toolkit
//создаём начальное состояние.Так как у нас статья состоит из самой статьи,тегов и комментов к ним...отражаем это в initialState
const initialState = {
	//общий раздел статей
	posts: {
		//все статьи
		items: [],
		status: 'loading',
	},
	//общий раздел тегов
	tags: {
		//все теги
		items: [],
		status: 'loading',
	},
	//все комменты
	// comments: {
	// 	items: [],
	// 	status: 'loading',
	// },
}

//создаём slice
const postsSlice = createSlice({
	name: 'posts',
	initialState,
	//тут будут методы кот. будут позволять нам обновлять state
	reducers: {},
	//тут описываем действия кот.должны выполняться в зависимости от изменения состояния наших асинхронных actions (pending,fulfilled,rejected)
	extraReducers: {
		//Получение всех статей//
		//есть такой ключ fetchPosts, у него есть состояние pending и это функция, у кот.есть state и action(объект...если он нужен.В pending он не нужен)
		[fetchPosts.pending]: state => {
			//мы говорим,что когда идёт статус pending, то возьми state, а именно posts и присвой его ключу ststus значение 'loading'(загрузка идёт)
			state.posts.status = 'loading'
			//также в state.posts есть ключ items[] и мы его обнуляем
			state.posts.items = []
		},
		//есть такой ключ fetchPosts, у него есть состояние fulfilled и это функция, у кот.есть state и action(объект)
		[fetchPosts.fulfilled]: (state, action) => {
			//мы говорим,что когда идёт статус fulfilled, то возьми state, а именно posts и присвой его ключу ststus значение 'loaded'(загрузка завершилась)
			state.posts.status = 'loaded'
			//также в state.posts есть ключ items[] и мы прикручиваем ему action.payload
			state.posts.items = action.payload
		},
		//есть такой ключ fetchPosts, у него есть состояние fulfilled и это функция, у кот.есть state и action(объект)
		[fetchPosts.rejected]: state => {
			//мы говорим,что когда идёт статус rejected, то возьми state, а именно posts и присвой его ключу ststus значение 'error'(ошибка)
			state.posts.status = 'loaded'
			//также в state.posts есть ключ items[] и мы его обнуляем
			state.posts.items = []
		},

		//получение тегов//
		//есть такой ключ fetchTags, у него есть состояние pending и это функция, у кот.есть state и action(объект...если он нужен.В pending он не нужен)
		[fetchTags.pending]: state => {
			//мы говорим,что когда идёт статус pending, то возьми state, а именно tags и присвой его ключу ststus значение 'loading'(загрузка идёт)
			state.tags.status = 'loading'
			//также в state.tags есть ключ items[] и мы его обнуляем
			state.tags.items = []
		},
		//есть такой ключ fetchTags, у него есть состояние fulfilled и это функция, у кот.есть state и action(объект)
		[fetchTags.fulfilled]: (state, action) => {
			//мы говорим,что когда идёт статус fulfilled, то возьми state, а именно tags и присвой его ключу ststus значение 'loaded'(загрузка завершилась)
			state.tags.status = 'loaded'
			//также в state.posts есть ключ items[] и мы прикручиваем ему action.payload
			state.tags.items = action.payload
		},
		//есть такой ключ fetchTags, у него есть состояние fulfilled и это функция, у кот.есть state и action(объект)
		[fetchTags.rejected]: state => {
			//мы говорим,что когда идёт статус rejected, то возьми state, а именно tags и присвой его ключу ststus значение 'error'(ошибка)
			state.tags.status = 'error'
			//также в state.tags есть ключ items[] и мы его обнуляем
			state.tags.items = []
		},

		//удаление статьи
		[fetchRemovePost.pending]: state => {
			state.posts.status = 'loading'
		},
		[fetchRemovePost.fulfilled]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				post => post._id !== action.payload
			)
			state.posts.status = 'loaded'
		},
		[fetchRemovePost.rejected]: state => {
			state.posts.status = 'error'
		},
	},
})
//все редюсеры кладём в переменную postsReducer
export const postsReducer = postsSlice.reducer
