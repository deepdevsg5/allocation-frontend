let department_Id = 0;

function listDepartments() {
  console.log("listDepartments() foi chamado pelo HTML");
  const departmentTableBody = document.getElementById("departmentTableBody");

  axios
    .get("https://professor-allocation-node-git.onrender.com/department/list")
    .then(function (response) {
      const departments = response.data;

      departments.forEach(function (department) {
        var newRow = document.createElement("tr");
        newRow.innerHTML =
          '<td><span class="custom-checkbox"><input type="checkbox" class="checkbox" data-id="' +
          department.id +
          '"><label for="checkbox' +
          department.id +
          '"></label></span></td>' +
          '<td class="department-name">' +
          department.name +
          "</td>" +
          '<td><a href="#edit" class="edit" data-toggle="modal" data-id="' +
          department.id +
          '"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>' +
          '<a href="#delete" class="delete" data-toggle="modal" data-id="' +
          department.id +
          '"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a></td>';

        departmentTableBody.appendChild(newRow);
      });

      const checkboxes = document.querySelectorAll(".checkbox");
      checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("click", function () {
          if (checkbox.checked) {
            const departmentId = checkbox.getAttribute("data-id");
            console.log("ID do departamento selecionado: " + departmentId);
          }
        });
      });

      const deleteButtons = document.querySelectorAll(".delete");
      deleteButtons.forEach(function (deleteButton) {
        deleteButton.addEventListener("click", function () {
          const departmentId = deleteButton.getAttribute("data-id");
          console.log("ID do departamento a ser excluído: " + departmentId);
          deleteDepartment(departmentId);
        });
      });

      const updateButtons = document.querySelectorAll(".edit");
      updateButtons.forEach(function (updateButton) {
        updateButton.addEventListener("click", function () {
          const departmentId = updateButton.getAttribute("data-id");
          console.log("ID do departamento a ser atualizado: " + departmentId);

          findById(departmentId, function (departmentName) {
            if (departmentName) {
              document.getElementById("editDepartmentNameInput").value =
                departmentName;
              console.log("Nome do Departamento: " + departmentName);
            } else {
              console.log(
                "Departamento não encontrado ou erro ao buscar o Departamento."
              );
            }

            $("#editModal").modal("show");

            const saveButton = document.getElementById("saveUpdateButton");
            saveButton.addEventListener("click", function () {
              updatedepartment(departmentId);

              $("#edit").modal("hide");
              listDepartments();
            });
          });
        });
      });
    })
    .catch(function (error) {
      console.error("Erro ao obter a lista de Departamento: " + error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  listDepartments();
});

function findById(departmentId, callback) {
  let department_Id = Number(departmentId);
  console.log("findById recebeu id: " + department_Id);
  axios
    .get(
      "https://professor-allocation-node-git.onrender.com/department/" +
        department_Id
    )
    .then(function (response) {
      const department = response.data;

      if (department && department.name) {
        callback(department.name);
      } else {
        callback(null);
      }
    })
    .catch(function (error) {
      console.log("Erro ao buscar o departamento: " + error);
      callback(null);
    });
}

function updatedepartment(departmentId) {
  let department_Id = Number(departmentId);
  const updateDepartmentNameInput = document.getElementById(
    "editDepartmentNameInput"
  );
  const newDepartmentName = updateDepartmentNameInput.value;

  console.log("updatedepartment recebeu id: " + department_Id);

  axios
    .put(
      `https://professor-allocation-node-git.onrender.com/department/update/${departmentId}`,
      { name: newDepartmentName }
    )
    .then(function (response) {
      console.log("departamento atualizado com sucesso:", response.data);

      // Limpar os campos de entrada
      updateDepartmentNameInput.value = "";

      // Atualize a lista de departamentos após a atualização
      listDepartments();
    })
    .catch(function (error) {
      console.error("Erro ao atualizar o departamento: " + error);
    });
}

function savedepartment(event) {
  event.preventDefault(); // Impede o envio do formulário

  const departmentNameInput = document.getElementById("addDepartmentNameInput");
  const departmentName = departmentNameInput.value;

  axios
    .post("https://professor-allocation-node-git.onrender.com/department/new", {
      name: departmentName,
    })
    .then(function (response) {
      console.log("departamento salvo com sucesso:", response.data);
      departmentNameInput.value = ""; // Limpa o campo do nome do departamento
      listDepartments();

      //fechar o modal
      $("#add").modal("hide");
    })
    .catch(function (error) {
      console.error("Erro ao salvar departamento:", error);
    });
}

// delete
function deleteDepartment(departmentId) {
  let department_Id = Number(departmentId);
  console.log("deleteDepartment recebeu id : " + department_Id);
  axios
    .delete(
      "https://professor-allocation-node-git.onrender.com/department/" +
        department_Id
    )
    .then(function (response) {
      console.log(
        "departamento com ID " + department_Id + " excluído com sucesso."
      );
    })
    .catch(function (error) {
      console.error("Erro ao excluir o departamento: " + error);
    });
}
