const tasktrigger = document.getElementById("button-task");

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
            <i class="bi bi-arrow-up"></i>
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