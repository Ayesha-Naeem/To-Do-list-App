window.addEventListener('load', () => {
    const form = document.querySelector('#New-Tasks');
    const input = document.querySelector('#new-Tasks-input');
    const list_element = document.querySelector('#Tasks');

    // Load tasks from localStorage on page load
    loadData();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value;

        if (task === '') {
            alert('Please enter a task');
            return;
        } else {
            const task_el = createTaskElement(task);
            list_element.appendChild(task_el);

            input.value = '';

            task_el.querySelector('.edit').addEventListener('click', (e) => {
                toggleEditState(task_el);
                saveData();
            });

            task_el.querySelector('.delete').addEventListener('click', (e) => {
                task_el.remove();
                saveData();
            });

            saveData();
        }
    });

    function createTaskElement(taskText) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');
        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = taskText;
        task_input_el.setAttribute('readonly', 'readonly');
        task_content_el.appendChild(task_input_el);

        const task_btn_el = document.createElement('div');
        task_btn_el.classList.add('buttons');

        const task_edit_btn = document.createElement('button');
        task_edit_btn.classList.add('edit');
        task_edit_btn.innerHTML = 'Edit';

        const task_delete_btn = document.createElement('button');
        task_delete_btn.classList.add('delete');
        task_delete_btn.innerHTML = 'Delete';

        task_btn_el.appendChild(task_edit_btn);
        task_btn_el.appendChild(task_delete_btn);
        task_el.appendChild(task_btn_el);

        return task_el;
    }

    function toggleEditState(task_el) {
        const task_input_el = task_el.querySelector('.text');
        if (task_input_el.getAttribute('readonly')) {
            task_input_el.removeAttribute('readonly');
            task_input_el.focus();
            task_el.querySelector('.edit').innerHTML = 'Save';
        } else {
            task_input_el.setAttribute('readonly', 'readonly');
            task_el.querySelector('.edit').innerHTML = 'Edit';
        }
    }

    function saveData() {
        const tasks = [];
        const taskElements = list_element.querySelectorAll('.task');
        taskElements.forEach((task_el) => {
            const taskText = task_el.querySelector('.text').value;
            tasks.push({
                text: taskText,
                editable: !task_el.querySelector('.text').getAttribute('readonly')
            });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadData() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            const task_el = createTaskElement(task.text);
            list_element.appendChild(task_el);

            if (!task.editable) {
                toggleEditState(task_el);
            }

            task_el.querySelector('.edit').addEventListener('click', (e) => {
                toggleEditState(task_el);
                saveData();
            });

            task_el.querySelector('.delete').addEventListener('click', (e) => {
                task_el.remove();
                saveData();
            });
        });
    }
});
