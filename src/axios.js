import axios from 'axios'
//axios должен создать свою новую оболочку
const instance = axios.create({
	//всегда делаем запрос на http://localhost:4444 (backend)
	baseURL: 'http://localhost:4444',
})

//пишем middleware которы при каждом запросе будет проверять есть ли у нас token или нет и если есть то будет добавлять его к запросу, чтобы каждый раз его не доставать в компонентах, а сделаем раз и навсегда
//берём interceptors,объясняем что мы делаем middleware на любой запрос(request) и будем использовать config axios
instance.interceptors.request.use(config => {
	//проверяем при любом запросе что есть ли что т о в localStorage и если там что то есть то вшивай это в headers.Authorizations
	// необходжимо в headers.Authorization прикрутить то что есть в localStorage, т.е. token

	config.headers.Authorization = window.localStorage.getItem('token')
	//и возвращаем изменённые конфигурации axios
	return config
})

//всё это сделано для того чтобы каждый раз создавая запрос нам не приходилось писать каждый раз этот путь
// вместо axios.get('http://localhost:4444/posts')
// будем писать axios.get('/posts')

export default instance
