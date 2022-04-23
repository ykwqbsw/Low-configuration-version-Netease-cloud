import axios from 'axios'

var http = axios.create({
  baseURL: '/api'
})

export default http
