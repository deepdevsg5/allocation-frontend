function searchDepartmentName() {
  return axios.get(
    "https://professor-allocation-node-git.onrender.com/department/list"
  );
}

function listProfessors() {
  const professorsTableBody = document.getElementById("professorsTableBody");

  // Fazer a solicitação para obter a lista de departamentos
  searchDepartmentName()
    .then(function (departmentResponse) {
      // Suponha que a resposta contém um array de departamentos
      const departments = departmentResponse.data;

      axios
        .get(
          "https://professor-allocation-node-git.onrender.com/professor/list"
        )
        .then(function (response) {
          const professors = response.data;

          professors.forEach(function (professor) {
            var newRow = document.createElement("tr");
            newRow.innerHTML =
              '<td><span class="custom-checkbox"><input type="checkbox" class="checkbox" data-id="' +
              professor.id +
              '"><label for="checkbox' +
              professor.id +
              '"></label></span></td>' +
              '<td class="professor-name">' +
              professor.name +
              "</td>" +
              '<td class="professor-cpf">' +
              professor.cpf +
              "</td>";

            // Encontrar o departamento correspondente com base no ID do departamento do professor
            const department = departments.find(
              (dept) => dept.id === professor.department_id
            );
            if (department) {
              newRow.innerHTML +=
                '<td class="professor-departmentId">' +
                department.name +
                "</td>";
            } else {
              newRow.innerHTML +=
                '<td class="professor-departmentId">Departamento desconhecido</td>';
            }

            newRow.innerHTML +=
              '<td><a href="#edit" class="edit" data-toggle="modal" data-id="' +
              professor.id +
              '"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>' +
              '<a href="#delete" class="delete" data-toggle="modal" data-id="' +
              professor.id +
              '"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td>';

            professorsTableBody.appendChild(newRow);
          });

          const checkboxes = document.querySelectorAll(".checkbox");
          checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener("click", function () {
              if (checkbox.checked) {
                const professorId = checkbox.getAttribute("data-id");
                console.log("ID do professor selecionado: " + professorId);
              }
            });
          });

          const deleteButtons = document.querySelectorAll(".delete");
          deleteButtons.forEach(function (deleteButton) {
            deleteButton.addEventListener("click", function () {
              const professorId = deleteButton.getAttribute("data-id");
              console.log("ID do professor a ser excluído: " + professorId);
              deleteprofessor(professorId);
            });
          });

          const updateButtons = document.querySelectorAll(".edit");
          updateButtons.forEach(function (updateButton) {
            updateButton.addEventListener("click", function () {
              const professorId = updateButton.getAttribute("data-id");
              console.log("ID do professor a ser atualizado: " + professorId);

              findById(professorId, function (professor) {
                if (professor) {
                  document.getElementById("editProfessorNameInput").value =
                    professor.name;
                  document.getElementById("editProfessorCpfInput").value =
                    professor.cpf;
                  document.getElementById("editProfessorDptInput").value =
                    professor.department_id;

                  console.log("Nome do professor: " + professor.name);
                  console.log("CPF do professor: " + professor.cpf);
                  console.log("ID do departamento: " + professor.department_id);
                } else {
                  console.log(
                    "professor não encontrado ou erro ao buscar o professor."
                  );
                }

                $("#edit").modal("show");

                const saveButton = document.getElementById("saveUpdateButton");
                saveButton.addEventListener("click", function () {
                  updateprofessor(professorId);

                  $("#edit").modal("hide");
                  listProfessors();
                });
              });
            });
          });
        })
        .catch(function (error) {
          console.error("Erro ao obter a lista de professor: " + error);
        });
    })
    .catch(function (error) {
      console.error("Erro ao obter a lista de departamentos: " + error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  listProfessors();
});

function findById(professorId, callback) {
  let professor_Id = Number(professorId);
  console.log("findById recebeu id: " + professor_Id);
  axios
    .get(
      "https://professor-allocation-node-git.onrender.com/professor/" +
        professor_Id
    )
    .then(function (response) {
      const professor = response.data;

      if (professor) {
        callback(professor);
      } else {
        callback(null);
      }
    })
    .catch(function (error) {
      console.log("Erro ao buscar o professor: " + error);
      callback(null);
    });
}

function updateprofessor(professorId) {
  let professor_Id = Number(professorId);

  const updateProfessorNameInput = document.getElementById(
    "editProfessorNameInput"
  );
  const newProfessorName = updateProfessorNameInput.value;

  const updateProfessorCpfInput = document.getElementById(
    "editProfessorCpfInput"
  );
  const newProfessorCpf = updateProfessorCpfInput.value;

  const updateProfessorDptInput = document.getElementById(
    "editProfessorDptInput"
  );
  const newProfessorDptId = updateProfessorDptInput.value;

  console.log("updateprofessor recebeu id: " + professor_Id);

  axios
    .put(
      `https://professor-allocation-node-git.onrender.com/professor/update/${professorId}`,
      {
        name: newProfessorName,
        cpf: newProfessorCpf,
        department_id: newProfessorDptId,
      }
    )
    .then(function (response) {
      console.log("professor atualizado com sucesso:", response.data);

      // Limpar os campos de entrada
      updateProfessorNameInput.value = "";
      updateProfessorCpfInput.value = "";
      updateProfessorDptInput.value = "";

      // Atualize a lista de professors após a atualização
      listProfessors();
    })
    .catch(function (error) {
      console.error("Erro ao atualizar o professor: " + error);
    });
}

function saveprofessor(event) {
  event.preventDefault(); // Impede o envio do formulário

  const professorNameInput = document.getElementById("addProfessorNameInput");
  const professorName = professorNameInput.value;
  const professorCpfInput = document.getElementById("addProfessorCpfInput");
  const professorCpf = professorCpfInput.value;
  const professorDptInput = document.getElementById("addProfessorDptInput");
  const professorDptId = professorDptInput.value;

  axios
    .post("https://professor-allocation-node-git.onrender.com/professor/new", {
      name: professorName,
      cpf: professorCpf,
      department_id: professorDptId,
    })
    .then(function (response) {
      console.log("professor salvo com sucesso:", response.data);

      //limpar os campos
      professorNameInput.value = "";
      professorCpfInput.value = "";
      professorDptInput.value = "";

      listProfessors();

      //fechar o modal
      $("#add").modal("hide");
    })
    .catch(function (error) {
      console.error("Erro ao salvar professor:", error);
    });
}

// delete
function deleteprofessor(professorId) {
  let professor_Id = Number(professorId);
  console.log("deleteprofessor recebeu id : " + professor_Id);
  axios
    .delete(
      "https://professor-allocation-node-git.onrender.com/professor/" +
        professor_Id
    )
    .then(function (response) {
      console.log(
        "professor com ID " + professor_Id + " excluído com sucesso."
      );
    })
    .catch(function (error) {
      console.error("Erro ao excluir o professor: " + error);
    });
}
