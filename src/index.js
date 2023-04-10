import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline'

import './index.scss'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'
//импортируем хранилище и передаём его в Provider
import store from './redux/store.js'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	//убираем React.StrictMode и оставляем пустой фрагмент чтобы не дублировались запросы
	<>
		<CssBaseline />
		<ThemeProvider theme={theme}>
			{/* теперь приложение понимает что у нас есть Роутинг */}
			<BrowserRouter>
				{/* оборачиваем приложение Provider и передаём туда пропсом наше зранилище(кот.теперь будет доступно всему приложению) */}
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</ThemeProvider>
	</>
)
