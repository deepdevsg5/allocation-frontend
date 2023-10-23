//importar o componente que vai fazer a chamada pela configuracao da const rout no main
import { Outlet } from 'react-router-dom'
import './App.css'
//Importar navbar
import Navbar from './components/Navbar'

function App() {
  
  return (
  
    <div className="App">
      <Navbar />
      <div className="container">
        <Outlet />
       </div>
    </div>
      
  )
}

export default App
