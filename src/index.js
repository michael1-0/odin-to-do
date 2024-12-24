import "./styles.css";
import kanbanSvg from "./assets/kanban.svg";
import Project from "./classes/project.js";
import Task from "./classes/task.js";
import deleteTaskSvg from "./assets/trash.svg";
import editTaskSvg from "./assets/pencil-square.svg";
import viewMoreTaskSvg from "./assets/chevron-right.svg";

const initialize = (() => {
    if (!localStorage.getItem('initialized')) {
        const initialData = [new Project("Default")];
        initialData[0].projectTasks.push(new Task(
            "bottom text",
            false,
            "slamin",
            "2024-12-05",
            document.getElementById("taskPriority").value
        ));
        localStorage.setItem('key', JSON.stringify(initialData));
        
        localStorage.setItem('initialized', 'true');
    }

    const projects = JSON.parse(localStorage.getItem('key'));
    
    showProject();
    showTaskToday();
    document.querySelector(".create-project").addEventListener("click", () => {
        document.querySelector("[project-modal]").showModal();
        document.querySelector("[create-projects-form]").addEventListener("submit", createProject);
    });
    document.querySelector(".today-task-container").addEventListener("click", showTaskToday);
    document.querySelector(".completed-task-container").addEventListener("click", showCompletedTasks);
    
    document.querySelector(".close-project-modal").addEventListener("click", () => {
        document.querySelector("[project-modal]").close();
    });
    document.querySelector(".close-task-modal").addEventListener("click", () => {
        document.querySelector("[task-modal]").close();
    })
    document.querySelector(".close-edit-task-modal").addEventListener("click", () => {
        document.querySelector("[task-edit-modal]").close();
    });
    document.querySelector(".close-view-task-modal").addEventListener("click", () => {
        document.querySelector("[task-view-modal]").close();
    });
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('key', JSON.stringify(projects));
    });
    
    
    
    
    function showProject() {
        document.querySelector(".projects").innerHTML = ""; // reset projects
        document.querySelector(".tasks").innerHTML = ""; // reset tasks
       
        for (let i = 0; i < projects.length; i++) {
            const divProjectContainer = document.createElement("div");
            divProjectContainer.classList.add("project-element-container");
    
            const svgIcon = document.createElement("img");
            svgIcon.alt = "project icon";
            svgIcon.src = kanbanSvg;
    
            const divTitle = document.createElement("div");
            divTitle.textContent = projects[i].projectName;
           
            const buttonProjectDelete = document.createElement("button");
            buttonProjectDelete.textContent = "delete";
            buttonProjectDelete.addEventListener("click", () => {
                projects.splice(i, 1);
                showProject();
            });

            divProjectContainer.append(svgIcon, divTitle, buttonProjectDelete);
    
            divProjectContainer.addEventListener("click", function showTask() {
                if (projects[i] === undefined) {
                    return 0;
                }

                document.querySelector(".tasks").innerHTML = ""; // reset tasks
    
                const divProjectTitle = document.createElement("div");
                divProjectTitle.classList.add("project-title");
                divProjectTitle.textContent = projects[i].projectName;
                
                document.querySelector(".tasks").appendChild(divProjectTitle);
    
                for (let j = 0; j < projects[i].projectTasks.length; j++) {
                    const divTaskElementContainer = document.createElement("div");
                    divTaskElementContainer.classList.add("task-element-container");
    
                    const checkboxTaskCompletion = document.createElement('input');
                    checkboxTaskCompletion.type = 'checkbox';
                    checkboxTaskCompletion.id = 'taskIsDone';
                    checkboxTaskCompletion.name = 'taskIsDone';
                    if (projects[i].projectTasks[j].isDone === true) {
                        checkboxTaskCompletion.checked = true;
                    } else {
                        checkboxTaskCompletion.checked = false;
                    }
                    checkboxTaskCompletion.addEventListener("click", () => {
                        if (projects[i].projectTasks[j].isDone === false) {
                            projects[i].projectTasks[j].isDone = true;
    
                        } else {
                            projects[i].projectTasks[j].isDone = false;
                        }
                        showTask();
                    });
    
                    const divTaskTitle = document.createElement("div");
                    divTaskTitle.classList.add("task-title");
                    if (projects[i].projectTasks[j].isDone === true) {
                        divTaskTitle.classList.add("task-strikethrough")
                    }
                    divTaskTitle.textContent = projects[i].projectTasks[j].title;
    
                    const divTaskPriority = document.createElement("div");
                    divTaskPriority.style.fontStyle = "italic";
                    if (projects[i].projectTasks[j].priority === "No Priority") {
                        divTaskPriority.style.color = "green";
                    } else if (projects[i].projectTasks[j].priority === "Low Priority") {
                        divTaskPriority.style.color = "lightgreen";
                    } else if (projects[i].projectTasks[j].priority === "Medium Priority") {
                        divTaskPriority.style.color = "orange";
                    } else {
                        divTaskPriority.style.color = "red";
                    }
                    divTaskPriority.textContent = projects[i].projectTasks[j].priority;
    
                    const divTaskStatus = document.createElement("div");
                    divTaskStatus.style.fontWeight = "700";
                    divTaskStatus.classList.add("task-status")
                    let todayDate = new Date();
                    let todayDateYearMonthDay = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}-${todayDate.getDate().toString().padStart(2, '0')}`;
                    let projectTaskDate = new Date(projects[i].projectTasks[j].dueDate);
                    let projectTaskDateYearMonthDay = `${projectTaskDate.getFullYear()}-${(projectTaskDate.getMonth() + 1).toString().padStart(2, '0')}-${projectTaskDate.getDate().toString().padStart(2, '0')}`;
                    if (
                        projectTaskDateYearMonthDay === todayDateYearMonthDay && projects[i].projectTasks[j].isDone === false 
                    ) {
                        divTaskStatus.textContent = "Due Today";
                    } else if ( projectTaskDateYearMonthDay > todayDateYearMonthDay && projects[i].projectTasks[j].isDone === false ) {
                        divTaskStatus.textContent = "Due";
                    }  else if (projectTaskDateYearMonthDay < todayDateYearMonthDay && projects[i].projectTasks[j].isDone === false ){
                        divTaskStatus.textContent = "OVERDUE!!!!!!";
                    }
    
                    const buttonTaskDelete = document.createElement("button");
                    const svgTaskDeleteIcon = document.createElement("img");
                    svgTaskDeleteIcon.alt = "task delete icon";
                    svgTaskDeleteIcon.src = deleteTaskSvg;
                    buttonTaskDelete.appendChild(svgTaskDeleteIcon);
                    buttonTaskDelete.addEventListener("click", function removeTask() {
                        projects[i].projectTasks.splice(j, 1);
                        showTask(); // DOM related 
                    });
    
                    const buttonTaskEdit = document.createElement("button");
                    const svgTaskEditIcon = document.createElement("img");
                    svgTaskEditIcon.alt = "task edit icon";
                    svgTaskEditIcon.src = editTaskSvg;
                    buttonTaskEdit.appendChild(svgTaskEditIcon);
                    buttonTaskEdit.addEventListener("click", () => {
                        document.getElementById("taskEditTitle").value = projects[i].projectTasks[j].title;
                        document.getElementById("taskEditDescription").value = projects[i].projectTasks[j].description;
                        let projectTaskDate = new Date(projects[i].projectTasks[j].dueDate);
                        let projectTaskDateYearMonthDay;
                        projectTaskDateYearMonthDay = `${projectTaskDate.getFullYear()}-${(projectTaskDate.getMonth() + 1).toString().padStart(2, '0')}-${projectTaskDate.getDate().toString().padStart(2, '0')}`;
                        document.getElementById("taskEditDueDate").value = projectTaskDateYearMonthDay;
                        document.getElementById("taskEditPriority").value = projects[i].projectTasks[j].priority;
    
                        document.querySelector("[edit-task-form]").addEventListener("submit", function submitEditTaskForm() {
                            projects[i].projectTasks[j].title = document.getElementById("taskEditTitle").value;
                            projects[i].projectTasks[j].description =  document.getElementById("taskEditDescription").value;
                            projects[i].projectTasks[j].dueDate = document.getElementById("taskEditDueDate").value;
                            projects[i].projectTasks[j].priority = document.getElementById("taskEditPriority").value;
    
                            showTask();
                            document.querySelector("[edit-task-form]").removeEventListener("submit", submitEditTaskForm);
                        });
    
                        document.querySelector("[task-edit-modal]").showModal();
                    });
    
    
                    const buttonTaskViewMore = document.createElement("button");
                    const svgTaskViewMoreIcon = document.createElement("img");
                    svgTaskViewMoreIcon.alt = "task view more icon";
                    svgTaskViewMoreIcon.src = viewMoreTaskSvg;
                    buttonTaskViewMore.appendChild(svgTaskViewMoreIcon);
                    buttonTaskViewMore.addEventListener("click", () => {
                        document.querySelector(".task-view-title").textContent = projects[i].projectTasks[j].title;
                        document.querySelector(".task-view-description").textContent = projects[i].projectTasks[j].description;
                        let projectTaskDate = new Date(projects[i].projectTasks[j].dueDate);
                        let projectTaskDateYearMonthDay = `${projectTaskDate.getFullYear()}-${(projectTaskDate.getMonth() + 1).toString().padStart(2, '0')}-${projectTaskDate.getDate().toString().padStart(2, '0')}`;
                        document.querySelector(".task-view-due-date").textContent = projectTaskDateYearMonthDay;
                        document.querySelector(".task-view-priority").textContent = projects[i].projectTasks[j].priority;
                        document.querySelector("[task-view-modal]").showModal();
                    });
    
                
                    divTaskElementContainer.append(
                        checkboxTaskCompletion,
                        divTaskTitle,
                        divTaskPriority,
                        divTaskStatus,
                        buttonTaskDelete,
                        buttonTaskEdit,
                        buttonTaskViewMore
                    );
    
                    document.querySelector(".tasks").appendChild(divTaskElementContainer);
                }
    
                const buttonCreateTask = document.createElement("button");
                buttonCreateTask.classList.add("create-task");
                buttonCreateTask.textContent = "New Task";
                const divCreateTaskIcon = document.createElement("div");
                divCreateTaskIcon.classList.add("create-task-icon");
                divCreateTaskIcon.textContent = "+";
                function eventHandlerCreateTask() {
                    function createTask(index) {
                        projects[index].projectTasks.push(new Task(
                            document.getElementById("taskTitle").value,
                            false,
                            document.getElementById("taskDescription").value,
                            document.getElementById("taskDueDate").value,
                            document.getElementById("taskPriority").value
                        ));
                    }
                    createTask(i);
                    showTask(); // DOM related
                    document.querySelector("[create-task-form]").removeEventListener("submit", eventHandlerCreateTask); 
                }
                buttonCreateTask.addEventListener("click", () => {
                    document.querySelector("[task-modal]").showModal();
                    document.querySelector("[create-task-form]").addEventListener("submit", eventHandlerCreateTask);
                });
    
                buttonCreateTask.appendChild(divCreateTaskIcon);
                document.querySelector(".tasks").appendChild(buttonCreateTask);
            });
            document.querySelector(".projects").appendChild(divProjectContainer);
        }
    }
    
    function createProject() {
        const newProject = new Project(
            document.getElementById("projectName").value
        );
        projects.push(newProject);
        showProject(); // DOM RELATED
        document.querySelector("[create-projects-form]").removeEventListener("click", createProject);
    }
    
    function showTaskToday() {
        document.querySelector(".tasks").innerHTML = "";
    
        const divProjectTitle = document.createElement("div");
        divProjectTitle.classList.add("project-title");
        divProjectTitle.textContent = "Today's Tasks";
    
        document.querySelector(".tasks").appendChild(divProjectTitle);
        
        for (let i = 0; i < projects.length; i++) {
    
            for (let j = 0; j < projects[i].projectTasks.length; j++) {
                let todayDate = new Date();
                let todayDateYearMonthDay = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}-${todayDate.getDate().toString().padStart(2, '0')}`;
                let projectTaskDate = new Date(projects[i].projectTasks[j].dueDate);
                let projectTaskDateYearMonthDay = `${projectTaskDate.getFullYear()}-${(projectTaskDate.getMonth() + 1).toString().padStart(2, '0')}-${projectTaskDate.getDate().toString().padStart(2, '0')}`;
                
                if (todayDateYearMonthDay === projectTaskDateYearMonthDay && projects[i].projectTasks[j].isDone === false) {
                    const divTaskElementContainer = document.createElement("div");
                    divTaskElementContainer.classList.add("task-element-container");
    
                    const checkboxTaskCompletion = document.createElement('input');
                    checkboxTaskCompletion.type = 'checkbox';
                    checkboxTaskCompletion.id = 'taskIsDone';
                    checkboxTaskCompletion.name = 'taskIsDone';
                    checkboxTaskCompletion.addEventListener("click", () => {
                        projects[i].projectTasks[j].isDone = true;
                        showTaskToday();
                    });
    
                    const divTaskTitle = document.createElement("div");
                    divTaskTitle.classList.add("task-title");
                    if (projects[i].projectTasks[j].isDone === true) {
                        divTaskTitle.classList.add("task-strikethrough")
                    }
                    divTaskTitle.textContent = projects[i].projectTasks[j].title;
    
                    const divTaskPriority = document.createElement("div");
                    divTaskPriority.style.fontStyle = "italic";
                    if (projects[i].projectTasks[j].priority === "No Priority") {
                        divTaskPriority.style.color = "green";
                    } else if (projects[i].projectTasks[j].priority === "Low Priority") {
                        divTaskPriority.style.color = "lightgreen";
                    } else if (projects[i].projectTasks[j].priority === "Medium Priority") {
                        divTaskPriority.style.color = "orange";
                    } else {
                        divTaskPriority.style.color = "red";
                    }
                    divTaskPriority.textContent = projects[i].projectTasks[j].priority;
    
                    const divTaskStatus = document.createElement("div");
                    divTaskStatus.style.fontWeight = "700";
                    divTaskStatus.classList.add("task-status")
                    if (
                        projectTaskDateYearMonthDay === todayDateYearMonthDay && projects[i].projectTasks[j].isDone === false 
                    ) {
                        divTaskStatus.textContent = "Due Today";
                    } else if (
                        projectTaskDateYearMonthDay > todayDateYearMonthDay && projects[i].projectTasks[j].isDone === false
                    ) {
                        divTaskStatus.textContent = "Due";
                    } else if (
                        projectTaskDateYearMonthDay < todayDateYearMonthDay && projects[i].projectTasks[j].isDone === false
                    ) {
                        divTaskStatus.textContent = "OVERDUE!!!!!!";
                    }
    
                    const buttonTaskDelete = document.createElement("button");
                    const svgTaskDeleteIcon = document.createElement("img");
                    svgTaskDeleteIcon.alt = "task delete icon";
                    svgTaskDeleteIcon.src = deleteTaskSvg;
                    buttonTaskDelete.appendChild(svgTaskDeleteIcon);
                    buttonTaskDelete.addEventListener("click", function removeTask() {
                        projects[i].projectTasks.splice(j, 1);
                        showTaskToday(); // DOM related 
                    });
    
                    const buttonTaskViewMore = document.createElement("button");
                    const svgTaskViewMoreIcon = document.createElement("img");
                    svgTaskViewMoreIcon.alt = "task view more icon";
                    svgTaskViewMoreIcon.src = viewMoreTaskSvg;
                    buttonTaskViewMore.appendChild(svgTaskViewMoreIcon);
                    buttonTaskViewMore.addEventListener("click", () => {
                        document.querySelector(".task-view-title").textContent = projects[i].projectTasks[j].title;
                        document.querySelector(".task-view-description").textContent = projects[i].projectTasks[j].description;
                        let projectTaskDate = new Date(projects[i].projectTasks[j].dueDate);
                        let projectTaskDateYearMonthDay = `${projectTaskDate.getFullYear()}-${(projectTaskDate.getMonth() + 1).toString().padStart(2, '0')}-${projectTaskDate.getDate().toString().padStart(2, '0')}`;
                        document.querySelector(".task-view-due-date").textContent = projectTaskDateYearMonthDay;
                        document.querySelector(".task-view-priority").textContent = projects[i].projectTasks[j].priority;
                        document.querySelector("[task-view-modal]").showModal();
                    });
    
                
                    divTaskElementContainer.append(
                        checkboxTaskCompletion,
                        divTaskTitle,
                        divTaskPriority,
                        divTaskStatus,
                        buttonTaskDelete,
                        buttonTaskViewMore
                    );
    
                    document.querySelector(".tasks").appendChild(divTaskElementContainer);
                }
            }
        }
    }
    
    function showCompletedTasks() {
        document.querySelector(".tasks").innerHTML = "";
    
        const divProjectTitle = document.createElement("div");
        divProjectTitle.classList.add("project-title");
        divProjectTitle.textContent = "Completed Tasks";
    
        document.querySelector(".tasks").appendChild(divProjectTitle);
    
        for (let i = 0; i < projects.length; i++) {
    
            for (let j = 0; j < projects[i].projectTasks.length; j++) {
          
                
                if (projects[i].projectTasks[j].isDone === true) {
                    const divTaskElementContainer = document.createElement("div");
                    divTaskElementContainer.classList.add("task-element-container");
    
                    const checkboxTaskCompletion = document.createElement('input');
                    checkboxTaskCompletion.type = 'checkbox';
                    checkboxTaskCompletion.id = 'taskIsDone';
                    checkboxTaskCompletion.name = 'taskIsDone';
                    checkboxTaskCompletion.checked = true;
                    checkboxTaskCompletion.addEventListener("click", () => {
                        projects[i].projectTasks[j].isDone = false;
                        showCompletedTasks();
                    });
    
                    const divTaskTitle = document.createElement("div");
                    divTaskTitle.classList.add("task-title");
                    if (projects[i].projectTasks[j].isDone === true) {
                        divTaskTitle.classList.add("task-strikethrough")
                    }
                    divTaskTitle.textContent = projects[i].projectTasks[j].title;
    
                    const divTaskPriority = document.createElement("div");
                    divTaskPriority.style.fontStyle = "italic";
                    if (projects[i].projectTasks[j].priority === "No Priority") {
                        divTaskPriority.style.color = "green";
                    } else if (projects[i].projectTasks[j].priority === "Low Priority") {
                        divTaskPriority.style.color = "lightgreen";
                    } else if (projects[i].projectTasks[j].priority === "Medium Priority") {
                        divTaskPriority.style.color = "orange";
                    } else {
                        divTaskPriority.style.color = "red";
                    }
                    divTaskPriority.textContent = projects[i].projectTasks[j].priority;
    
                    const divTaskStatus = document.createElement("div");
                    divTaskStatus.style.fontWeight = "700";
                    divTaskStatus.classList.add("task-status")
    
                    const buttonTaskDelete = document.createElement("button");
                    const svgTaskDeleteIcon = document.createElement("img");
                    svgTaskDeleteIcon.alt = "task delete icon";
                    svgTaskDeleteIcon.src = deleteTaskSvg;
                    buttonTaskDelete.appendChild(svgTaskDeleteIcon);
                    buttonTaskDelete.addEventListener("click", function removeTask() {
                        projects[i].projectTasks.splice(j, 1);
                        showCompletedTasks(); // DOM related 
                    });
    
                    const buttonTaskViewMore = document.createElement("button");
                    const svgTaskViewMoreIcon = document.createElement("img");
                    svgTaskViewMoreIcon.alt = "task view more icon";
                    svgTaskViewMoreIcon.src = viewMoreTaskSvg;
                    buttonTaskViewMore.appendChild(svgTaskViewMoreIcon);
                    buttonTaskViewMore.addEventListener("click", () => {
                        document.querySelector(".task-view-title").textContent = projects[i].projectTasks[j].title;
                        document.querySelector(".task-view-description").textContent = projects[i].projectTasks[j].description;
                        let projectTaskDate = new Date(projects[i].projectTasks[j].dueDate);
                        let projectTaskDateYearMonthDay = `${projectTaskDate.getFullYear()}-${(projectTaskDate.getMonth() + 1).toString().padStart(2, '0')}-${projectTaskDate.getDate().toString().padStart(2, '0')}`;
                        document.querySelector(".task-view-due-date").textContent = projectTaskDateYearMonthDay;
                        document.querySelector(".task-view-priority").textContent = projects[i].projectTasks[j].priority;
                        document.querySelector("[task-view-modal]").showModal();
                    });
    
                
                    divTaskElementContainer.append(
                        checkboxTaskCompletion,
                        divTaskTitle,
                        divTaskPriority,
                        divTaskStatus,
                        buttonTaskDelete,
                        buttonTaskViewMore
                    );
    
                    document.querySelector(".tasks").appendChild(divTaskElementContainer);
                }
            }
        }
    }
})();
