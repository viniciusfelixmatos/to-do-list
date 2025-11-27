const buttonAddTask = document.querySelectorAll(".button-task_container button");

buttonAddTask.forEach(button => {
    button.addEventListener('click', () => {
        const coluna = button.closest(".col");
        createTask(coluna);
    });
});

function createTask(coluna) {

    // pegar lista onde as tasks serão inseridas
    const tasksList = coluna.querySelector(".tasks_list");

    // criar o bloco task_content (este é o que deve ser repetido)
    const taskContent = document.createElement("div");
    taskContent.classList.add("task_content");

    // conteúdo interno da task
    taskContent.innerHTML = `
        <div class="task_box">
            <div class="task_text">
                <span>New Task</span>
            </div>

            <div class="task_footer">
                <span class="task_move">
                    <i class="bi bi-arrow-up"></i>
                </span>

                <div class="task_editor">
                    <span class="task_edit">
                        <i class="bi bi-pencil"></i>
                    </span>
                    <span class="task_delete">
                        <i class="bi bi-trash"></i>
                    </span>
                </div>
            </div>
        </div>
    `;

    // inserir o novo bloco na lista
    tasksList.appendChild(taskContent);
}




/* const tasktrigger = document.getElementById("button-task");

tasktrigger.addEventListener('click', (e) => {
    const taskContainer = document.querySelector(".task_content");
    taskContainer.innerHTML = "";
    const taskBox = document.createElement("Div");
    taskBox.classList.add("task_box");
    console.log("Aqui!")
    taskBox.innerHTML = `
        <div class="task_text">
            <textarea></textarea>
        </div>
        
        <div class="task_footer">
            <span>
                <i class="bi bi-arrow-up"></i>
            </span>
            <div class="task_editor">
                <span>
                    <i class="bi bi-pencil"></i>
                </span>
                <span>
                    <i class="bi bi-trash"></i>
                </span>
            </div>
        </div>
    `;
    taskContainer.appendChild(taskBox);
})

*/