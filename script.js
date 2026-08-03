document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    const emptyImage = document.querySelector('.empty');

    const todosContainer =
        document.querySelector('.todo-container');

    const progressBar =
        document.getElementById('progress');

    const progressNumber =
        document.getElementById('numbers');


    // Show / Hide Empty Image
    const toggleEmptyState = () => {

        const isEmpty =
            taskList.children.length === 0;

        emptyImage.style.display =
            isEmpty ? 'block' : 'none';

        todosContainer.style.width =
            isEmpty ? '100%' : '100%';
    };


    // Update Progress
    const updateProgress = () => {

        const totalTask =
            taskList.children.length;

        const completedTask =
            taskList.querySelectorAll(
                '.checkbox:checked'
            ).length;


        const progress =
            totalTask
                ? (completedTask / totalTask) * 100
                : 0;


        progressBar.style.width =
            `${progress}%`;


        progressNumber.textContent =
            `${completedTask}/${totalTask}`;
    };


    // Save Tasks
    const saveTaskToLocalStorage = () => {

        const tasks =
            Array.from(
                taskList.querySelectorAll('li')
            ).map(li => ({

                text:
                    li.querySelector('span').textContent,

                completed:
                    li.querySelector('.checkbox').checked
            }));


        localStorage.setItem(
            'tasks',
            JSON.stringify(tasks)
        );
    };


    // Add Task
    const addTask = (
        event,
        text = null,
        completed = false
    ) => {

        if (event) {
            event.preventDefault();
        }


        const taskText =
            text !== null
                ? text
                : taskInput.value.trim();


        if (!taskText) {
            return;
        }


        const li =
            document.createElement('li');


        li.innerHTML = `
            <input
                type="checkbox"
                class="checkbox"
                ${completed ? 'checked' : ''}
            >

            <span>${taskText}</span>

            <div class="task-button">

                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;


        const checkbox =
            li.querySelector('.checkbox');

        const editBtn =
            li.querySelector('.edit-btn');


        // Completed Task
        if (completed) {

            li.classList.add('completed');

            editBtn.disabled = true;

            editBtn.style.opacity = '0.5';

            editBtn.style.pointerEvents = 'none';
        }


        // Checkbox Change
        checkbox.addEventListener('change', () => {

            const isChecked =
                checkbox.checked;


            li.classList.toggle(
                'completed',
                isChecked
            );


            editBtn.disabled =
                isChecked;


            editBtn.style.opacity =
                isChecked ? '0.5' : '1';


            editBtn.style.pointerEvents =
                isChecked ? 'none' : 'auto';


            updateProgress();

            saveTaskToLocalStorage();
        });


        // Edit Task
        editBtn.addEventListener('click', () => {

            if (!checkbox.checked) {

                taskInput.value =
                    li.querySelector('span').textContent;

                li.remove();

                toggleEmptyState();

                updateProgress();

                saveTaskToLocalStorage();
            }
        });


        // Delete Task
        li.querySelector('.delete-btn')
            .addEventListener('click', () => {

                li.remove();

                toggleEmptyState();

                updateProgress();

                saveTaskToLocalStorage();
            });


        taskList.appendChild(li);

        taskInput.value = '';

        toggleEmptyState();

        updateProgress();

        saveTaskToLocalStorage();
    };


    // Add Button
    addTaskButton.addEventListener(
        'click',
        (event) => {
            addTask(event);
        }
    );


    // Enter Key
    taskInput.addEventListener(
        'keypress',
        (e) => {

            if (e.key === 'Enter') {
                addTask(e);
            }

        }
    );


    // Load Tasks
    const loadTaskFromLocalStorage = () => {

        const savedTasks =
            JSON.parse(
                localStorage.getItem('tasks')
            ) || [];


        savedTasks.forEach(task => {

            addTask(
                null,
                task.text,
                task.completed
            );

        });


        toggleEmptyState();

        updateProgress();
    };


    // Start App
    loadTaskFromLocalStorage();

});