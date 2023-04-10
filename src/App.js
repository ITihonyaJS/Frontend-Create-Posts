import { useEffect } from 'react'
import Container from '@mui/material/Container'
import { useDispatch, useSelector } from 'react-redux'
// для(роутинга) перехода по страницам
import { Routes, Route } from 'react-router-dom'
import { Header } from './components'
import { Home, FullPost, Registration, AddPost, Login } from './pages'
import { fetchAuthMe, selectorIsAuth } from './redux/slices/auth'

function App() {
	const dispatch = useDispatch()
	//будет true когда data с null поменяется на инф.о пользаке,т.е. когда back вернёт что такой пользак найден в базе данных
	const isAuth = useSelector(selectorIsAuth)
	useEffect(() => {
		//проверяем,если токен есть в localStorage , то отправляем запрос на проверку прав
		if (window.localStorage.getItem('token')) {
			dispatch(fetchAuthMe())
		}
	}, [])

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Routes>
					{/* задаём роутинг(адреса страниц) и прикрепляем к каждой странице компоненты кот.там будут отрисовываться */}
					<Route path='/' element={<Home />}></Route>
					<Route path='/posts/:id' element={<FullPost />}></Route>
					<Route path='/add-post' element={<AddPost />}></Route>
					<Route path='/posts/:id/edit' element={<AddPost />}></Route>
					<Route path='/login' element={<Login />}></Route>
					<Route path='/register' element={<Registration />}></Route>
				</Routes>
			</Container>
		</>
	)
}

export default App
