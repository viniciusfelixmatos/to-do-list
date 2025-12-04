const buttonAddTask = document.querySelectorAll(".button-task_container button");

/* ABRIR O MODAL */
buttonAddTask.forEach(button => {
    button.addEventListener('click', () => {
        $('#modalAddTask').modal('show');
    });
});

/* CRIAR A TASK AO CLICAR EM CONFIRM */
const addTaskButton = document.getElementById('confirmAddTask');
    addTaskButton.addEventListener('click', () => {
        createTask();
    });

function createTask() {

    // pegar lista onde as tasks serão inseridas
    const tasksList = document.querySelector(".tasks_list");

    // criar o bloco task_content (este é o que deve ser repetido)
    const taskContent = document.createElement("div");
    taskContent.classList.add("task_content");

    // CAPTURANDO VALORES DO QUE FOI ESCRITO NO MODAL
    let inputTitle = document.getElementById('editTaskTitle');
    let valueTitle = inputTitle.value;

    // conteúdo interno da task
    taskContent.innerHTML = `
        <div class="task_box">
            <div class="task_text">
                <span>${valueTitle || 'New Task'}</span>
            </div>

            <div class="task_footer">
                <span class="task_move">
                    <i class="bi bi-arrow-up"></i>
                </span>

                <div class="task_editor">
                    <span class="task_edit" onclick="openEditModal()">
                        <i class="bi bi-pencil"></i>
                    </span>
                    <span class="task_delete" onclick="openDelModal()">
                        <i class="bi bi-trash"></i>
                    </span>
                </div>
            </div>
        </div>
    `;

    if () {

    }


    // inserir o novo bloco na lista
    tasksList.appendChild(taskContent);
}

/* FUNÇÃO PARA ARIR O MODAL DE EDITAR */
function openEditModal() {
    $('#modalEditTask').modal('show');
}

/* FUNÇÃO PARA ABRIR O MODAL DE DELETAR */
function openDelModal() {
    $('#modalDeleteTask').modal('show');
}