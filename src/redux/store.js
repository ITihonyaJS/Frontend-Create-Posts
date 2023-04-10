import { configureStore } from '@reduxjs/toolkit'

import { postsReducer } from './slices/posts.js'
import { authReducer } from './slices/auth.js'

//создаём хранилище
const store = configureStore({
	reducer: {
		//postsDevTools: так будет отображаться state в reduxDevTools
		postsDevTools: postsReducer,
		//authDevTools: так будет отображаться state в reduxDevTools
		authDevTools: authReducer,
	},
})

export default store
