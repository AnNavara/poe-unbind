import './app.css'
import Client from './Client.svelte'

const app = new Client({
  target: document.getElementById('app')
})

export default app
