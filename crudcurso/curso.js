let course_Id = 0;

function listCourses() {
  console.log("listCourses() foi chamado pelo HTML");
  const courseTableBody = document.getElementById("courseTableBody");

  axios
    .get("https://professor-allocation-node-git.onrender.com/course/list")
    .then(function (response) {
      const courses = response.data;

      courses.forEach(function (course) {
        var newRow = document.createElement("tr");
        newRow.innerHTML =
          '<td><span class="custom-checkbox"><input type="checkbox" class="checkbox" data-id="' +
          course.id +
          '"><label for="checkbox' +
          course.id +
          '"></label></span></td>' +
          '<td class="course-name">' +
          course.name +
          "</td>" +
          '<td><a href="#edit" class="edit" data-toggle="modal" data-id="' +
          course.id +
          '"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>' +
          '<a href="#delete" class="delete" data-toggle="modal" data-id="' +
          course.id +
          '"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td>';

        courseTableBody.appendChild(newRow);
      });

      const checkboxes = document.querySelectorAll(".checkbox");
      checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("click", function () {
          if (checkbox.checked) {
            const courseId = checkbox.getAttribute("data-id");
            console.log("ID do curso selecionado: " + courseId);
          }
        });
      });

      const deleteButtons = document.querySelectorAll(".delete");
      deleteButtons.forEach(function (deleteButton) {
        deleteButton.addEventListener("click", function () {
          const courseId = deleteButton.getAttribute("data-id");
          console.log("ID do curso a ser excluído: " + courseId);
          deleteCourse(courseId);
        });
      });

      const updateButtons = document.querySelectorAll(".edit");
      updateButtons.forEach(function (updateButton) {
        updateButton.addEventListener("click", function () {
          const courseId = updateButton.getAttribute("data-id");
          console.log("ID do curso a ser atualizado: " + courseId);

          findById(courseId, function (courseName) {
            if (courseName) {
              document.getElementById("editCourseNameInput").value = courseName;
              console.log("Nome do curso: " + courseName);
            } else {
              console.log("Curso não encontrado ou erro ao buscar o curso.");
            }

            $("#editModal").modal("show");

            const saveButton = document.getElementById("saveUpdateButton");
            saveButton.addEventListener("click", function () {
              updateCourse(courseId);

              $("#edit").modal("hide");
              listCourses();
            });
          });
        });
      });
    })
    .catch(function (error) {
      console.error("Erro ao obter a lista de cursos: " + error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  listCourses();
});

function findById(courseId, callback) {
  let course_Id = Number(courseId);
  console.log("findById recebeu id: " + course_Id);
  axios
    .get(
      "https://professor-allocation-node-git.onrender.com/course/" + course_Id
    )
    .then(function (response) {
      const course = response.data;

      if (course && course.name) {
        callback(course.name);
      } else {
        callback(null);
      }
    })
    .catch(function (error) {
      console.log("Erro ao buscar o curso: " + error);
      callback(null);
    });
}

function updateCourse(courseId) {
  let course_Id = Number(courseId);
  const updateCourseNameInput = document.getElementById("editCourseNameInput");
  const newCourseName = updateCourseNameInput.value;

  console.log("updateCourse recebeu id: " + course_Id);

  axios
    .put(
      `https://professor-allocation-node-git.onrender.com/course/update/${courseId}`,
      { name: newCourseName }
    )
    .then(function (response) {
      console.log("Curso atualizado com sucesso:", response.data);

      // Limpar os campos de entrada
      updateCourseNameInput.value = "";

      // Atualize a lista de cursos após a atualização
      listCourses();
    })
    .catch(function (error) {
      console.error("Erro ao atualizar o curso: " + error);
    });
}

function saveCourse(event) {
  event.preventDefault(); // Impede o envio do formulário

  const courseNameInput = document.getElementById("addCourseNameInput");
  const courseName = courseNameInput.value;

  axios
    .post("https://professor-allocation-node-git.onrender.com/course/new", {
      name: courseName,
    })
    .then(function (response) {
      console.log("Curso salvo com sucesso:", response.data);
      courseNameInput.value = ""; // Limpa o campo do nome do curso
      listCourses();

      //fechar o modal
      $("#add").modal("hide");
    })
    .catch(function (error) {
      console.error("Erro ao salvar curso:", error);
    });
}

// delete
function deleteCourse(courseId) {
  let course_Id = Number(courseId);
  console.log("deleteCourse recebeu id : " + course_Id);
  axios
    .delete(
      "https://professor-allocation-node-git.onrender.com/course/" + course_Id
    )
    .then(function (response) {
      console.log("Curso com ID " + course_Id + " excluído com sucesso.");
    })
    .catch(function (error) {
      console.error("Erro ao excluir o curso: " + error);
    });
}
