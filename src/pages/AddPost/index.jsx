import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'
import { selectorIsAuth } from '../../redux/slices/auth.js'
import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import axios from '../../axios.js'

export const AddPost = () => {
	//определяем,авторизован ли пользак или нет
	const isAuth = useSelector(selectorIsAuth)
	//useNavigate используем для редиректа пользака на нужную страницу.
	//Другая реализация редиректа это <Navigate to={'/'}/>
	const navigation = useNavigate()
	//нужен для скрытого инпута, кот. отвечает за выбот файла(он скрыт(hidden))
	const inputFileRef = useRef(null)

	//для редактирования статьи
	const { id } = useParams()

	//проверяем есть ли id в url, если есть то значим мы на странице редактирования
	const isEditing = !!id

	//в value я сохраняю данные кот. получаю из редактора SimpleMDE
	//эти данные пойдут в тело запроса
	//и они соответствуют виду запроса на back
	const [text, setText] = React.useState('')
	//загрузка новой статьи
	//изначально false так как не отправляется запрос
	const [isLoading, setIsLoading] = React.useState(false)
	//для заголовка
	//эти данные пойдут в тело запроса
	//и они соответствуют виду запроса на back
	const [title, setTitle] = React.useState('')
	//для тегов
	//эти данные пойдут в тело запроса
	//и они соответствуют виду запроса на back
	const [tags, setTags] = React.useState('')
	//превью
	//эти данные пойдут в тело запроса
	//и они соответствуют виду запроса на back
	const [imageUrlPost, setImageUrlPost] = React.useState('')

	//обработчик input загрузки файлов
	const handleChangeFile = async e => {
		try {
			//специальный формат FormData, который позволяет отправлять и вшивать картинку в backend
			const formData = new FormData()
			const file = e.target.files[0]
			//добавляем ключ image и как значение добавляем файл кот.выбрали...вшиваем в formData
			formData.append('image', file)
			//теперь с помощью axios отправим этот файл на сервак(backend)
			const { data } = await axios.post('/upload', formData)
			//вшиваем адрес до картинки
			setImageUrlPost(data.url)
		} catch (err) {
			console.warn(err)
			alert('Не удалось загрузить картинку')
		}
	}

	const onClickRemoveImage = () => {
		setImageUrlPost('')
	}
	//получаю данные из редактора SimpleMDE в виде переменной value и сохраняю их в useState.Делаю контралируемую библиотеку SimpleMDE
	//useCallback нужен SimpleMDE
	const onChange = React.useCallback(value => {
		setText(value)
	}, [])

	//если есть id(т.е. мы на странице редактирования и смогли извлечь id из url)
	useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(res => {
				setImageUrlPost(res.data.imageUrl)
				setTitle(res.data.title)
				setTags(res.data.tags.join(','))
				setText(res.data.text)
			})
		}
	}, [])

	//это настройки для SimpleMDE и обязательно обернуть в useMemo чтобы эта библиотека(SimpleMDE) работала корректно
	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	)

	//это сделано для того чтобы пока не выполнился запрос fetchAuthMe меня не выкидывало
	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	//отправка статьи на сервак(backend)
	//делаем запрос асинхронным
	//И вешаем как обработчик на кнопку Опубликовать
	const onSubmit = async () => {
		try {
			//начинается отправка запроса
			setIsLoading(true)

			//передаём необходимые параметры в запросе(согласно back)Объект с нашими заполненными полями на сервак
			const field = {
				text,
				tags,
				title,
				imageUrlPost,
			}

			//в зависимости от того...находимся мы на странице редактирования или создания новой статьи,отправляем разные запросы...
			if (isEditing) {
				await axios.patch(`/posts/${id}`, field)
				navigation(`/posts/${id}`)
				return
			}
			//получаем ответ из axios запроса в виде созданной статьи
			const { data } = await axios.post('/posts', field)
			//достаём из ответа id статьи
			const idNewPost = data._id
			//если статья успешно создана
			//с помощью хука useNavigate редиректим пользака на страницу с только что созданной статьёй
			navigation(`/posts/${idNewPost}`)
		} catch (err) {
			////если статья не создана кидаем ошибку
			console.warn(err)
			alert('Статья не создана')
		}
	}

	return (
		<Paper style={{ padding: 30 }}>
			{/* когда будем кликать на эту кнопку, то переводим клик на скрытый инпут */}
			<Button
				onClick={() => inputFileRef.current.click()}
				variant='outlined'
				size='large'
			>
				Загрузить превью
			</Button>
			{/* на этот инпут я буду вещать обработчики событий */}
			<input
				ref={inputFileRef}
				type='file'
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrlPost && (
				<Button variant='contained' color='error' onClick={onClickRemoveImage}>
					Удалить
				</Button>
			)}
			{imageUrlPost && (
				<img
					className={styles.image}
					src={`http://localhost:4444${imageUrlPost}`}
					alt='Uploaded'
				/>
			)}
			<br />
			<br />
			<TextField
				value={title}
				onChange={e => setTitle(e.target.value)}
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статьи...'
				fullWidth
			/>
			<TextField
				value={tags}
				onChange={e => setTags(e.target.value)}
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Тэги'
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size='large' variant='contained'>
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href='/'>
					<Button size='large'>Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
