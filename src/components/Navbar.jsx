
import { Link } from "react-router-dom"

function Navbar() {
  return (
      <nav className="navbar">
          <h2>
            <Link to={'/'}>  Projeto Allocação de Professores </Link>
          </h2>
          <ul>
              <li>
                  <Link to={'/'}>Home</Link>
              </li>
              <li>
                  <Link to={'/courses'} className="new-course-btn">Courses</Link>
              </li>
          </ul>

    </nav>
  )
}

export default Navbar