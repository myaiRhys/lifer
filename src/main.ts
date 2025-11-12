import './app.css'
import App from './App.svelte'
import { initializeStorage } from './lib/db/init'

// Initialize database on app start
initializeStorage()
  .then(() => {
    const app = new App({
      target: document.getElementById('app')!
    })
    return app
  })
  .catch((error) => {
    console.error('Failed to initialize app:', error)
    document.getElementById('app')!.innerHTML = `
      <div style="padding: 2rem; color: red;">
        <h1>Initialization Error</h1>
        <p>${error.message}</p>
      </div>
    `
  })
