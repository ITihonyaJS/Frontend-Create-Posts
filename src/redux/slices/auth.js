import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

//создаём асинхронный action
//в params попадёт информация из формы(email и password) авторизации и её мы передаём на back
export const fetchAuth = createAsyncThunk('auth/fetchAuth', async params => {
	const { data } = await axios.post('/auth/login', params)
	return data
})

//создаём action на регистрацию пользака
//в params попадёт информация из формы(email,fullName и password) авторизации и её мы передаём на back
export const fetchRegister = createAsyncThunk(
	'auth/fetchRegister',
	async params => {
		const { data } = await axios.post('/auth/register', params)
		return data
	}
)

//проверка авторизации
//не прокидываем ему параметры, т.к. axios сам из своего config достанет token и подставит его в запрос
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
	const { data } = await axios.get('/auth/me')
	return data
})

const initialState = {
	//данные опользаке будут храниться в data(и сначала она null)
	data: null,
	//идёт загрузка
	status: 'loading',
}

//создаём слайс
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: state => {
			state.data = null
		},
	},
	extraReducers: {
		//есть такой ключ fetchAuth, у него есть состояние pending и это функция, у кот.есть state и action(объект...если он нужен.В pending он не нужен)
		[fetchAuth.pending]: state => {
			//мы говорим,что когда идёт статус pending, то возьми state, ключу ststus значение 'loading'(загрузка идёт)
			state.status = 'loading'
			//также в state  есть ключ data изначально он null
			state.data = null
		},
		//есть такой ключ fetchAuth, у него есть состояние fulfilled и это функция, у кот.есть state и action(объект)
		[fetchAuth.fulfilled]: (state, action) => {
			//мы говорим,что когда идёт статус fulfilled, то возьми state, и присвой его ключу status значение 'loaded'(загрузка завершилась)
			state.status = 'loaded'
			//также в state есть ключ data и мы прикручиваем ему action.payload
			state.data = action.payload
		},
		//есть такой ключ fetchAuth, у него есть состояние fulfilled и это функция, у кот.есть state и action(объект)
		[fetchAuth.rejected]: state => {
			//мы говорим,что когда идёт статус rejected, то возьми state, аи присвой его ключу ststus значение 'error'(ошибка)
			state.status = 'loaded'
			//также в state есть ключ data и мы его обнуляем
			state.data = null
		},
		//обрабатываем асинхронный action fetchAuthMe
		[fetchAuthMe.pending]: state => {
			state.status = 'loading'
			state.data = null
		},

		[fetchAuthMe.fulfilled]: (state, action) => {
			state.status = 'loaded'
			state.data = action.payload
		},

		[fetchAuthMe.rejected]: state => {
			state.status = 'loaded'
			state.data = null
		},
		//обрабатываем асинхронный action fetchRegister
		[fetchRegister.pending]: state => {
			state.status = 'loading'
			state.data = null
		},

		[fetchRegister.fulfilled]: (state, action) => {
			state.status = 'loaded'
			state.data = action.payload
		},

		[fetchRegister.rejected]: state => {
			state.status = 'loaded'
			state.data = null
		},
	},
})

//делаем selector на проверку авторизации
//state.authDevTools.data (authDevTools это название из общего state, который отображается в redux и указан как ключ в index.js)
export const selectorIsAuth = state => Boolean(state.authDevTools.data)
// в authSlice.actions храняться action(не асинхронные)...типа logout
export const { logout } = authSlice.actions
// передаём в store.js как обработчик для state (authDevTools: authReducer)
export const authReducer = authSlice.reducer
