import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//1 - importar ferramentas do dom
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

//Paginas
import Courses from "./routes/Courses.jsx"
import Home from "./routes/Home.jsx"

/*criar objeto de configuraçao de roteamento, define o menu principal das paginas 
e so muda o meio
*/ 
const route = createBrowserRouter([
  {
    element: <App />,
    children: [ //vai ser as  rotas para alteraçao das paginas
      {
        path: "/",
        element: <Home/>

      },
      {
        path: "/courses",
        element: <Courses/>
      },
      {
        path: "/departments",
        
      },
      {
        path: "/professors",
        
      },
      {
        path: "allocations",
        
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>,
)
