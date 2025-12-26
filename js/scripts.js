// VARIÁVEL GLOBAL PARA ARMAZENAR A TASK
let to_do_tasks = [];
let doing_tasks = [];
let testing_tasks = [];
let done_tasks = [];

// VARIÁVEL GLOBAL PARA ARMAZENAR A TASK A SER DELETADA
let currentEditingTaskId = null;
let currentEditingTaskStatus = null;

// EXECUTAR A FUNÇÃO APÓS O CARREGAMENTO DA PÁGINA
window.addEventListener("DOMContentLoaded", () => {
    loadTasks(); // Chama a função loadTasks()
    countTasks(); // Chama a função countTasks()
});

function loadTasks() {

    // LIMPAR TODAS AS COLUNAS ANTES DE RECARREGAR
    const lists = document.querySelectorAll(
        '.todo_list, .doing_list, .testing_list, .done_list'
    );

    // limpar o conteúdo de cada lista
    lists.forEach(list => {
        list.innerHTML = '';
    });

    // ATUALIZAR OS ARRAYS GLOBAIS A PARTIR DO LOCALSTORAGE
    to_do_tasks = JSON.parse(localStorage.getItem('toDoTasks')) || [];
    doing_tasks = JSON.parse(localStorage.getItem('doingTasks')) || [];
    testing_tasks = JSON.parse(localStorage.getItem('testingTasks')) || [];
    done_tasks = JSON.parse(localStorage.getItem('doneTasks')) || [];

    // MAPA DE STATUS PARA RENDERIZAÇÃO
    const allTasks = {
        todo: to_do_tasks,
        doing: doing_tasks,
        testing: testing_tasks,
        done: done_tasks
    };

    // RENDERIZAR AS TASKS
    for (const status in allTasks) {

        const taskList = document.querySelector(`.${status}_list`);
        if (!taskList) continue;

        allTasks[status].forEach(task => {

            if (!task || !task.id || !task.title) return;

            const taskContent = document.createElement("div");
            taskContent.classList.add("task_content");

            taskContent.innerHTML = `
                <div class="task_box" id="${task.id}">
                    <div class="task_text">
                        <span>${task.title}</span>
                    </div>

                    <div class="task_footer">
                        <span class="task_move" onclick="updateTask(this)">
                            <i class="bi bi-arrow-up"></i>
                        </span>

                        <div class="task_editor">
                            <span class="task_edit" onclick="openEditModal(this)">
                                <i class="bi bi-pencil"></i>
                            </span>
                            <span class="task_delete" onclick="openDelModal(this)">
                                <i class="bi bi-trash"></i>
                            </span>
                        </div>
                    </div>
                </div>
            `;

            taskList.appendChild(taskContent);
        });
    };
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
    const id = `task-${crypto.randomUUID()}`;

    /* SELECIONAR OS INPUTS MARCADOS */
    const selectedRadio = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    if (!selectedRadio) {
        console.warn("Nenhuma coluna selecionada");
        return;
    }

    const selectedColumn = selectedRadio; // Armazena o valor do rádio selecionado

    /* OBJETO GUARDANDO OS PARES */
    const columnMap = {
        "todo": document.querySelector(".todo_list"),
        "doing": document.querySelector(".doing_list"),
        "testing": document.querySelector(".testing_list"),
        "done": document.querySelector(".done_list")
    }
    /* SELCIONA A COLUNA COM BASE NO VALOR MARCADO NO INPUT */
    const tasksList = columnMap[selectedColumn];
    if (!tasksList) return; // Verifica se a lista de tarefas existe

    // CAPTURAR TÍTULO DA TASK
    const inputTitle = document.getElementById('editTaskTitle');
    let valueTitle = inputTitle.value.trim();
    if (!valueTitle) valueTitle = 'New Task'; // Título padrão se vazio 

    // CRIAR O ELEMENTO DA TASK
    const taskContent = document.createElement("div");
    taskContent.classList.add("task_content");

    // CONTEÚDO INTERNO DA TASK
    taskContent.innerHTML = `
        <div class="task_box" id="${id}">
            <div class="task_text">
                <span>${valueTitle}</span>
            </div>

            <div class="task_footer">
                <span class="task_move" onclick="updateTask(this)">
                    <i class="bi bi-arrow-up"></i>
                </span>

                <div class="task_editor">
                    <span class="task_edit" onclick="openEditModal(this)">
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
    updateArrayTask(id, valueTitle, selectedColumn);
    // 'numero' é o ID gerado aleatoriamente
    // 'valueTitle' é o título da task
    // 'selectedColumn' é a coluna onde a task foi criada, ou seja, 'todo', 'doing', 'testing' ou 'done'
}



// FUNÇÃO PARA CRIAR OS NÚMEROS DE ID
// function randomInt(min, max) {
  // return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// FUNÇÃO PARA ATUALIZAR O ARRAY NO LOCALSTORAGE
function updateArrayTask(id, title, status) { // id, título e status da task
    const map = { // Mapeamento dos arrays e chaves do localStorage
        todo: {array: to_do_tasks, storage: 'toDoTasks'}, // Se o status for 'todo', usa o array to_do_tasks e a chave 'toDoTasks' no localStorage
        doing: {array: doing_tasks, storage: 'doingTasks'}, // Se o status for 'doing', usa o array doing_tasks e a chave 'doingTasks' no localStorage
        testing: {array: testing_tasks, storage: 'testingTasks'}, // Se o status for 'testing', usa o array testing_tasks e a chave 'testingTasks' no localStorage
        done: {array: done_tasks, storage: 'doneTasks'} // Se o status for 'done', usa o array done_tasks e a chave 'doneTasks' no localStorage
    };

    if (!map[status]) return; // Verifica se o status é válido

    map[status].array.push({id, title, status}); // Adiciona a nova task ao array correspondente
    localStorage.setItem( // Atualiza o localStorage com o array atualizado
        map[status].storage, // Chave do localStorage
        JSON.stringify(map[status].array) // Valor do localStorage (array convertido para string JSON)
    );
}

/* FUNÇÃO PARA ABRIR O MODAL DE DELETAR */
function openDelModal(element) {
    taskToDelete = element.closest(".task_content");
    $('#modalDeleteTask').modal('show');
}

function deleteTask() {
    if (!taskToDelete) return;

    // 🔴 sincroniza antes de qualquer coisa
    syncTasksFromStorage();

    const taskBox = taskToDelete.querySelector('.task_box');
    if (!taskBox) return;

    const taskId = String(taskBox.id);

    const column = taskToDelete.closest('.col');
    if (!column) return;

    const status = column.dataset.column;

    const map = {
        todo: { array: to_do_tasks, storage: 'toDoTasks' },
        doing: { array: doing_tasks, storage: 'doingTasks' },
        testing: { array: testing_tasks, storage: 'testingTasks' },
        done: { array: done_tasks, storage: 'doneTasks' }
    };

    if (!map[status]) return;

    const list = map[status].array;

    const index = list.findIndex(
        task => String(task.id) === taskId
    );

    if (index === -1) {
        console.warn('Task não encontrada no storage:', taskId);
        return;
    }

    list.splice(index, 1);

    localStorage.setItem(
        map[status].storage,
        JSON.stringify(list)
    );

    // remove do DOM por último
    taskToDelete.remove();
    taskToDelete = null;

    $('#modalDeleteTask').modal('hide');
    countTasks();
};

// FUNÇÃO PARA ABRIR O MODAL DE EDIÇÃO
function openEditModal(element) {
    // PEGANDO VALORES DA TASK A SER EDITADA
    const taskToEdit = element.closest(".task_content");
    const taskToEditStatus = taskToEdit.closest(".col").dataset.column;
    const taskToEditBox = taskToEdit.querySelector(".task_box");
    const taskToEditTitle = taskToEditBox.querySelector(".task_text span").textContent;
    const modal = document.getElementById("modalEditTask");

    modal.dataset.taskId = taskToEditBox.id;
    modal.dataset.taskStatus = taskToEditStatus;
    modal.dataset.taskTitle = taskToEditTitle;

    //modal.dataset.taskId = taskBoxId;
    $('#modalEditTask').modal('show');
};

// FUNÇÃO PARA DEFINIR OS VALORES NO MODAL DE EDIÇÃO
$('#modalEditTask').on('show.bs.modal', function () {
    const modal = this;
    const taskTitle = modal.dataset.taskTitle;
    const taskStatus = modal.dataset.taskStatus;

    // DEFININDO VALORES NOS INPUTS DO MODAL
    modal.querySelector('#editTaskTitle').value = taskTitle;
    modal.querySelector(`input[name="flexRadioDefault"][value="${taskStatus}"]`).checked = true;
});

// FUNÇÃO PARA SALVAR AS ALTERAÇÕES DA TASK EDITADA
function saveEditedTask() {

    // PEGANDO OS VALORES DO MODAL
    const modal = document.getElementById("modalEditTask");
    const taskId = modal.dataset.taskId;
    const oldStatus = modal.dataset.taskStatus; // STATUS ANTIGO

    // NOVOS VALORES
    const newTitle = modal.querySelector('#editTaskTitle').value.trim();
    const newStatus = modal.querySelector('input[name="flexRadioDefault"]:checked').value;

    // BUSCAR AS TASKS DO LOCALSTORAGE
    const to_do_tasks = JSON.parse(localStorage.getItem('toDoTasks')) || [];
    const doing_tasks = JSON.parse(localStorage.getItem('doingTasks')) || [];
    const testing_tasks = JSON.parse(localStorage.getItem('testingTasks')) || [];
    const done_tasks = JSON.parse(localStorage.getItem('doneTasks')) || [];

    const allTasks = {
        todo: to_do_tasks,
        doing: doing_tasks,
        testing: testing_tasks,
        done: done_tasks
    };

    // ARRAY DE ORIGEM E DESTINO
    const sourceArray = allTasks[oldStatus];
    const targetArray = allTasks[newStatus];

    if (!sourceArray || !targetArray) return;

    // ENCONTRAR A TASK NO ARRAY DE ORIGEM
    const taskIndex = sourceArray.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    // REMOVER A TASK DO ARRAY ANTIGO
    const [task] = sourceArray.splice(taskIndex, 1);

    // ATUALIZAR DADOS
    task.title = newTitle;
    task.status = newStatus;

    // INSERIR NO ARRAY DO NOVO STATUS
    targetArray.push(task);

    // SALVAR NO LOCALSTORAGE
    localStorage.setItem('toDoTasks', JSON.stringify(to_do_tasks));
    localStorage.setItem('doingTasks', JSON.stringify(doing_tasks));
    localStorage.setItem('testingTasks', JSON.stringify(testing_tasks));
    localStorage.setItem('doneTasks', JSON.stringify(done_tasks));

    // FECHAR O MODAL
    $('#modalEditTask').modal('hide');

    // OPCIONAL: RECARREGAR A TELA
    loadTasks();
    countTasks();
};

/* FUNÇÃO PARA CONTAR QUANTAS TASKS FORAM CRIADAS */
function countTasks() {
    const taskCounts = document.querySelectorAll('.task_count');

    taskCounts.forEach(countElement => { // para cada elemento com a classe 'task_count'
        const column = countElement.getAttribute('data-column');
        const taskList = document.querySelector(`.${column}_list`);

        if (!taskList) return;

        const taskCount = taskList.children.length;
        countElement.querySelector('span').textContent = `${taskCount} Total`;
    });
}

// FUNÇÃO PARA SINCRONIZAR AS TASKS DO LOCALSTORAGE
function syncTasksFromStorage() {
    to_do_tasks = JSON.parse(localStorage.getItem('toDoTasks')) || [];
    doing_tasks = JSON.parse(localStorage.getItem('doingTasks')) || [];
    testing_tasks = JSON.parse(localStorage.getItem('testingTasks')) || [];
    done_tasks = JSON.parse(localStorage.getItem('doneTasks')) || [];
}

/* FUNÇÃO PARA ATUALIZAR A TASK DE UMA COLUNA PARA OUTRA */
function updateTask(element) {
    const taskContent = element.closest('.task_content');
    if (!taskContent) return;

    const taskBox = taskContent.querySelector('.task_box');
    if (!taskBox) return;

    const taskId = taskBox.id;

    const currentColumnDiv = taskContent.closest('.col');
    if (!currentColumnDiv) return;

    const currentStatus = currentColumnDiv.dataset.column;

    const columnOrder = ["todo", "doing", "testing", "done"];
    const currentIndex = columnOrder.indexOf(currentStatus);
    if (currentIndex === -1) return;

    const nextStatus =
        currentIndex === columnOrder.length - 1
            ? columnOrder[0]
            : columnOrder[currentIndex + 1];

    const nextList = document.querySelector(`.${nextStatus}_list`);
    if (!nextList) return;

    // move no DOM
    nextList.appendChild(taskContent);
    taskContent.dataset.status = nextStatus;

    // move no estado + storage
    moveTaskInStorage(taskId, currentStatus, nextStatus);
    // atualiza os contadores
    countTasks();
};

// FUNÇÃO PARA MOVER A TASK NO LOCALSTORAGE
function moveTaskInStorage(taskId, fromStatus, toStatus) {
    syncTasksFromStorage();

    const map = {
        todo: { array: to_do_tasks, storage: 'toDoTasks' },
        doing: { array: doing_tasks, storage: 'doingTasks' },
        testing: { array: testing_tasks, storage: 'testingTasks' },
        done: { array: done_tasks, storage: 'doneTasks' }
    };

    if (!map[fromStatus] || !map[toStatus]) return;

    const fromArray = map[fromStatus].array;
    const toArray = map[toStatus].array;

    const index = fromArray.findIndex(
        task => String(task.id) === String(taskId)
    );

    if (index === -1) {
        console.warn('Task não encontrada no storage:', taskId);
        return;
    }

    const [task] = fromArray.splice(index, 1);
    task.status = toStatus;
    toArray.push(task);

    localStorage.setItem(map[fromStatus].storage, JSON.stringify(fromArray));
    localStorage.setItem(map[toStatus].storage, JSON.stringify(toArray));
}

// FUNÇÃO PARA ATUALIZAR A ORDEM DAS TASKS APÓS O DRAG AND DROP
function updateColumnOrder(status) {
    const map = {
        todo: { array: to_do_tasks, storage: 'toDoTasks' },
        doing: { array: doing_tasks, storage: 'doingTasks' },
        testing: { array: testing_tasks, storage: 'testingTasks' },
        done: { array: done_tasks, storage: 'doneTasks' }
    };

    if (!map[status]) return;

    const listElement = document.querySelector(`.${status}_list`);
    if (!listElement) return;

    const newOrder = [];

    listElement.querySelectorAll('.task_content').forEach(taskContent => {
        const taskBox = taskContent.querySelector('.task_box');
        if (!taskBox) return;

        const taskId = String(taskBox.id);

        const task = map[status].array.find(
            t => String(t.id) === taskId
        );

        if (task) newOrder.push(task);
    });

    map[status].array.length = 0;
    map[status].array.push(...newOrder);

    localStorage.setItem(
        map[status].storage,
        JSON.stringify(map[status].array)
    );
};

// FUNÇÃO PARA PERMITIR O DRAG AND DROP DAS TASKS
$(function () {
    $(".tasks_list").sortable({
        connectWith: ".tasks_list",
        placeholder: "task_placeholder",

        start: function (event, ui) {
            syncTasksFromStorage();

            const originColumn = ui.item.closest(".col").data("column");
            ui.item.data("fromStatus", originColumn);
        },

        receive: function (event, ui) {
            const taskContent = ui.item;
            const taskBox = taskContent.find(".task_box");
            if (!taskBox.length) return;

            const taskId = String(taskBox.attr("id"));

            const fromStatus = taskContent.data("fromStatus");
            const toStatus = $(this).closest(".col").data("column");

            if (!fromStatus || !toStatus || fromStatus === toStatus) return;

            moveTaskInStorage(taskId, fromStatus, toStatus);
            taskContent.attr("data-status", toStatus);

            // 🔴 atualiza ordem da coluna destino
            updateColumnOrder(toStatus);

            countTasks();
        },

        update: function (event, ui) {
            const status = ui.item.closest(".col").data("column");
            if (!status) return;

            // 🔴 atualiza ordem da coluna quando rearranjar
            updateColumnOrder(status);
        }
    }).disableSelection();
});

