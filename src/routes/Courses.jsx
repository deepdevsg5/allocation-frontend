import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Courses = () => {

  const[course, courseList] = useState([])

  //Realizando as chamdas da API
  const listAllCourses = async () => {
    try {

      const response = await axios.get("https://professor-allocation-node-git.onrender.com/course/list")

      const dataCourses = response.data

      courseList(dataCourses)

      console.log(dataCourses)
    } catch (error) {
      console.error(error)
    }
    
  }

  useEffect(() => {

    listAllCourses()

  },[]) // permite usar apenas uma vez a chamada e nao  toda vez que carregar

  return (
    <div>
      <h1> Lista de Cursos</h1>
      {course.length === 0 ? (<p>Carregando....</p>) : (
        course.map((course) => (
          <div className="Cursos" key={course.id} >
            <h2> Nome: {course.name}<h3>
                 Id: {course.id}</h3></h2>
          </div>
        ))
      ) }
    </div>
    
  )
}

export default Courses