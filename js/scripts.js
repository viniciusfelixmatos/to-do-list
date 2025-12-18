// EXECUTAR A FUNÇÃO APÓS O CARREGAMENTO DA PÁGINA
window.addEventListener("DOMContentLoaded", () => {
    loadTasks(); // Chama a função loadTasks()
    countTasks(); // Chama a função countTasks()
});

function loadTasks() {
    // Carregar tarefas de cada status do localStorage
    const allTasks = {
        todo: JSON.parse(localStorage.getItem('toDoTasks')) || [],
        doing: JSON.parse(localStorage.getItem('doingTasks')) || [],
        testing: JSON.parse(localStorage.getItem('testingTasks')) || [],
        donetaks: JSON.parse(localStorage.getItem('doneTasks')) || []
    };
    console.log(allTasks);
    // Iterar sobre cada status e suas tarefas
    for (const status in allTasks) {
       console.log(`Carregando tarefas para o status: ${status}`);
       allTasks[status].forEach(task=> {
        console.log(status);
            console.log(`Carregando tarefa: ${task.title} (ID: ${task.id})`);
            // Selecionar a lista de tarefas correspondente
            const TaskSelect = document.querySelector(`.${status}_list`);
            if (!TaskSelect) return;
            console.log(`Adicionando tarefa à coluna: ${status}`);
            // Criar o bloco task_content
            const taskContent = document.createElement("div");
            taskContent.classList.add("task_content");
            // Definir o conteúdo interno da tarefa
            taskContent.innerHTML = `
                <div class="task_box" id=${task.id}>
                    <div class="task_text">
                        <span>${task.title}</span>
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
            // Adicionar a tarefa à lista correspondente
            TaskSelect.appendChild(taskContent);
            console.log(`Tarefa ${task.title} adicionada à coluna ${status}`);
       });
    }
};
/* SELECIONANDO O BOTÃO DE CRIAR TASK */
const buttonAddTask = document.querySelectorAll(".button-task_container button");

/* ABRIR O MODAL */
buttonAddTask.forEach(button => { // para cada botão
    button.addEventListener('click', () => { // adicionar o evento de clique
        $('#modalAddTask').modal('show');
    });
});

/* CRIAR A TASK AO CLICAR EM CONFIRM */
const addTaskButton = document.getElementById('confirmAddTask'); // Armazena 'confirmTask' em uma constante
    addTaskButton.addEventListener('click', () => { // Evento de clique sobre a constante
        createTask(); // Chama a função createTask()
    });

/* FUNÇÃO PARA CRIAR A TASK */
function createTask() {
    /* CHAMANDO A FUNÇÃO PARA GERAR O ID */
    let numero = randomInt(1, 1000); // inteiro entre 1 e 100

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

    // CRIAR O BLOCO TASK_CONTENT RESPONSÁVEL POR ENCAPSULAR CADA TASK
    const taskContent = document.createElement("div");
    taskContent.classList.add("task_content");

    // CAPTURANDO VALORES DO QUE FOI ESCRITO NO MODAL
    let inputTitle = document.getElementById('editTaskTitle');
    let valueTitle = inputTitle.value;
    if(valueTitle == '') {
        valueTitle = 'New Task';
    };

    // CONTEÚDO INTERNO DA TASK
    taskContent.innerHTML = `
        <div class="task_box" id=${numero}>
            <div class="task_text">
                <span>${valueTitle}</span>
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
    updateArrayTask(numero, valueTitle, selectedColumn);
    // 'numero' é o ID gerado aleatoriamente
    // 'valueTitle' é o título da task
    // 'selectedColumn' é a coluna onde a task foi criada, ou seja, 'todo', 'doing', 'testing' ou 'done'
}

// FUNÇÃO PARA CRIAR OS NÚMEROS DE ID
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// ARRAY PARA GUARDAR AS TASKS
let to_do_tasks = []
let doing_tasks = []
let testing_tasks = []
let done_tasks = []

// FUNÇÃO PARA ADICIONAR A TASK NO ARRAY
function updateArrayTask(id, title, status) {

    // Verifica o status e adiciona ao array correspondente
    if (status === 'to-do') {
        to_do_tasks.push({id, title, status});
        localStorage.setItem('toDoTasks', JSON.stringify(to_do_tasks));
        console.log('Tarefa adicionada em To Do');
    } else if (status === 'doing') {
        doing_tasks.push({id, title, status});
        localStorage.setItem('doingTasks', JSON.stringify(doing_tasks));
        console.log('Tarefa adicionada em Doing');
    } else if (status === 'testing') {
        testing_tasks.push({id, title, status});
        localStorage.setItem('testingTasks', JSON.stringify(testing_tasks));
        console.log('Tarefa adicionada em Testing');
    } else if (status === 'done') {
        done_tasks.push({id, title, status});
        localStorage.setItem('doneTasks', JSON.stringify(done_tasks));
        console.log('Tarefa adicionada em Done');
    }

    // all_tasks[0].id = id,
    // all_tasks[0].title = title,
    // all_tasks[0].status = status
    // localStorage.setItem('allTasks', JSON.stringify(all_tasks));
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
    countTasks();
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
