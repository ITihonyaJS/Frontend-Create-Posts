import React from 'react'
//с помощью этого компонента редиректим пользака, когда он авторизовался на главную страницу
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import { fetchAuth, selectorIsAuth } from '../../redux/slices/auth.js'

import styles from './Login.module.scss'

export const Login = () => {
	//будет true когда data с null поменяется на инф.о пользаке,т.е. когда back вернёт что такой пользак найден в базе данных
	const isAuth = useSelector(selectorIsAuth)
	const dispatch = useDispatch()
	//подключаем библиотеку react-hook-form
	//и вытаскиваем специальные методы для работы с формой
	//register это функция кот.позволит нам зарегистрировать два поля(email и password), чтобы react-hook-form понимал что есть такие поля
	const {
		register,
		handleSubmit,
		setError,
		//достаём отсюда ошибки и isValid(хорошо ли у нас всё или нет)
		formState: { errors, isValid },
	} = useForm({
		//изначальны все её параметры ,будут пустые (''),но для удобства отладки приложения по умолчанию впихнём fake
		defaultValues: {
			email: 'testg@mail.ru',
			password: '123546',
		},
		//обработка ошибок будет выполняться после отправки формы(нажать на кнопку Войти(например))
		mode: 'onChange',
	})

	//создаём функцию onSubmit и она будет выполняться только в том случае если react-hook-form понял что валидация прошла успешно
	//в values значения из формы
	const onSubmit = async values => {
		//получив данные из формы мы должны их отправить в store(redux)для этого использжуем dispatch
		//передайм в dispatch action fetchUserData, он принимает в себя данные из формы и отправляет их на back
		//получаем ответ с back и проверяем...
		const data = await dispatch(fetchAuth(values))
		//если data.payload undefined
		if (!data.payload) {
			return alert('Авторизоваться не удалось')
		}
		//если data.payload НЕ undefined и ключ token есть в объекте data.payloa, то сохраняем token в localStorage
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	if (isAuth) {
		return <Navigate to='/' />
	}
	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Вход в аккаунт
			</Typography>
			{/* все поля формы оборачиваем в form(react-hook-form) */}
			<form
				//выполнится в том случае если все поля фомы корректно проваледируются
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextField
					className={styles.field}
					label='E-Mail'
					//браузерная валидации.Будет выскакивать сообщение если фрмат не email
					type='email'
					//если инфа об ошибке есть, то будет true и тогда подсвечиваем красным цветом
					error={Boolean(errors.email?.message)}
					//берём ошибки из formState.errors
					//если в списке ошибок есть email, то покажи сообщение
					helperText={errors.email?.message}
					fullWidth
					// регистрируем поля формы
					//объясняем как поле будет называться 'email'
					//и простая валидация.Если поле не заполнено...оповещаем
					{...register('email', { required: 'Укажите почту' })}
				/>
				<TextField
					className={styles.field}
					label='Пароль'
					fullWidth
					//берём ошибки из formState.errors
					//если в списке ошибок есть email, то покажи сообщение
					//если инфа об ошибке есть, то будет true и тогда подсвечиваем красным цветом
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					// регистрируем поля формы
					//объясняем как поле будет называться 'email'
					//и простая валидация.Если поле не заполнено...оповещаем
					{...register('password', { required: 'Введите пароль' })}
				/>
				<Button
					//если форма не заполнена то кнопка отправки формы не активна
					disabled={!isValid}
					//обязательный пропс или форма не отправится
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Войти
				</Button>
			</form>
		</Paper>
	)
}
