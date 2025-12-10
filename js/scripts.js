/* SELECIONANDO O BOTÃO DE CRIAR TASK */
const buttonAddTask = document.querySelectorAll(".button-task_container button");

/* ABRIR O MODAL */
buttonAddTask.forEach(button => { // para cada botão
    button.addEventListener('click', () => { // adicionar o evento de clique
        $('#modalAddTask').modal('show');
    });
});

/* CRIAR A TASK AO CLICAR EM CONFIRM */
const addTaskButton = document.getElementById('confirmAddTask');
    addTaskButton.addEventListener('click', () => {
        createTask();
    });

/* FUNÇÃO PARA CRIAR A TASK */
function createTask() {
    /* SELECIONAR OS INPUTS MARCADOS */
    const selectedColumn = document.querySelector('input[name="flexRadioDefault"]:checked').value;

    /* OBJETO GUARDANDO OS PARES */
    const columnMap = {
        "todo": document.querySelector(".to-do_list"),
        "doing": document.querySelector(".doing_list"),
        "testing": document.querySelector(".testing_list"),
        "done": document.querySelector(".done_list")
    }
    /* SELCIONA A COLUNA COM BASE NO VALOR MARCADO NO INPUT */
    const tasksList = columnMap[selectedColumn];

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
                <span class="task_move" onclick="updateTask(this)">
                    <i class="bi bi-arrow-up"></i>
                </span>

                <div class="task_editor">
                    <span class="task_edit" onclick="openEditModal()">
                        <i class="bi bi-pencil"></i>
                    </span>
                    <span class="task_delete" onclick="openDelModal(this)">
                        <i class="bi bi-trash"></i>
                    </span>
                </div>
            </div>
        </div>
    `;
    // INSERIR A TASK NA COLUNA SELECIONADA
    tasksList.appendChild(taskContent);

    // FECHAR O MODAL E LIMPAR O INPUT
    inputTitle.value = "";
    $('#modalAddTask').modal('hide');
    countTasks();
}

/* FUNÇÃO PARA ARIR O MODAL DE EDITAR */
function openEditModal() {
    $('#modalEditTask').modal('show');
}

/* FUNÇÃO PARA ABRIR O MODAL DE DELETAR */
function openDelModal(element) {
    taskToDelete = element.closest(".task_content");
    $('#modalDeleteTask').modal('show');
}

/* FUNÇÃO PARA DELETAR A TASK */
function deleteTask() {
    if (taskToDelete) {
        taskToDelete.remove();
        taskToDelete = null;
    }
    $('#modalDeleteTask').modal('hide');
}

/* FUNÇÃO PARA CONTAR QUANTAS TASKS FORAM CRIADAS */
function countTasks() {
    const taskCounts = document.querySelectorAll('.task_count');

    taskCounts.forEach(countElement => {
        const column = countElement.getAttribute('data-column');
        const taskList = document.querySelector(`.${column}_list`);

        if (!taskList) return;

        const taskCount = taskList.children.length;
        countElement.querySelector('span').textContent = `${taskCount} Total`;
    });
}

function updateTask(element) {
    // pega o card inteiro
    const task = element.closest('.task_content');
    if (!task) return;

    // pega a coluna onde A TASK ESTÁ HOJE
    const currentColumnDiv = task.closest(".col");
    if (!currentColumnDiv) return;

    // pega o nome da coluna (to-do, doing, testing, done)
    const currentColumn = currentColumnDiv.getAttribute("data-column");

    // ordem de rotação
    const columnOrder = ["to-do", "doing", "testing", "done"];
    const currentIndex = columnOrder.indexOf(currentColumn);

    // próxima coluna (cíclica)
    const nextIndex = currentIndex === columnOrder.length - 1 ? 0 : currentIndex + 1;
    const nextColumn = columnOrder[nextIndex];

    // lista da próxima coluna
    const nextList = document.querySelector(`.${nextColumn}_list`);
    if (!nextList) return;

    // move a task
    nextList.appendChild(task);

    // atualiza data-status para compatibilidade com drag-and-drop
    task.setAttribute("data-status", nextColumn);

    // atualiza contagens
    countTasks();
}

$(function () {
    $(".tasks_list").sortable({
        connectWith: ".tasks_list",
        placeholder: "task_placeholder",

        start: function (event, ui) {
            ui.placeholder.height(ui.item.height());
        },

        receive: function (event, ui) {
            const task = ui.item;

            // pega a coluna onde o card FOI SOLTO
            const newColumn = $(this).closest(".col").data("column");

            // atualiza visualmente (apenas se você quiser marcar a coluna atual na task)
            task.attr("data-status", newColumn);

            // recalcula as contagens
            countTasks();
        }
    }).disableSelection();
});



