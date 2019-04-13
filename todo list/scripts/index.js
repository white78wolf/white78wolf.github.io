var addButton = document.getElementById('add'),
    inputTask = document.getElementById('new-task'),	
    unfinishedTasks = document.getElementById('unfinished-tasks'),
    finishedTasks = document.getElementById('finished-tasks');

inputTask.focus();

function createNewElement(task, finished) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('button');
    var label = document.createElement('label');
    label.innerHTML = task;

    if (finished) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    } else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }

    var input = document.createElement('input');
    input.type = "text";
    input.setAttribute('disabled', true);                                               
    input.style.display = 'none';
    input.style.width = '70%';

    var editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";
    editButton.style.float = 'right';

    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";
    deleteButton.style.float = 'right';

    listItem.appendChild(checkbox);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(label);
    listItem.appendChild(input);


    return listItem;
}

function addTask() {
    if (inputTask.value) {
        var listItem = createNewElement(inputTask.value, false);
        unfinishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, finishTask);
        inputTask.value = "";
    }
    save();
}

addButton.onclick = addTask;

function deleteTask() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    save();
}

function editTask() {
    var editButton = this;
    var listItem = this.parentNode;
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input[type=text]');

    var containsClass = listItem.classList.contains('editMode');

    if (containsClass) {
        label.style.display = 'inline-block';
        label.innerHTML = input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        input.value = "";
        input.setAttribute('disabled', true);
        input.style.display = 'none';
        save();
    } else {
        input.value = label.innerHTML;
        input.removeAttribute('disabled');
        input.style.display = 'inline-block';
        label.style.display = 'none';
        input.focus();
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }
    listItem.classList.toggle('editMode');
}

function finishTask() {
    var listItem = this.parentNode,
        checkbox = listItem.querySelector('button.checkbox'),
        label = listItem.querySelector('label'),
        editButton = listItem.querySelector('button.material-icons.edit'),
        input = listItem.querySelector('input[type=text]');

    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";

    label.style.display = 'inline-block';
    label.innerHTML = '<s>' + label.innerHTML + '</s>';

    input.value = "";
    input.setAttribute('disabled', true);
    input.style.display = 'none';

    listItem.style.opacity = '0.5';

    if (editButton) {
        editButton.style.display = 'none';
    } else {
        editButton = listItem.querySelector('button.material-icons.save');
        editButton.style.display = 'none';
    }

    bindTaskEvents(listItem, unfinishTask);
    finishedTasks.appendChild(listItem);
    save();
}

function unfinishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.material-icons.edit');
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input[type=text]');
    listItem.style.opacity = '1.0';
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    unfinishedTasks.appendChild(listItem);
    label.innerHTML = (label.innerHTML).slice(3, (label.innerHTML.length - 4));
    if (editButton) {
        editButton.style.display = 'inline-block';
    } else {
        editButton = document.createElement('button');
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        editButton.style.float = 'right';
        listItem.appendChild(editButton);
    }
    bindTaskEvents(listItem, finishTask);
    save();
}

function bindTaskEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    if (editButton) {
        editButton.onclick = editTask;
    }
    deleteButton.onclick = deleteTask;
}

function save() {

    var unfinishedTasksArr = [];
    for (var i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerHTML);
    }

    var finishedTasksArr = [];
    for (i = 0; i < finishedTasks.children.length; i++) {
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerHTML);
    }

    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));
}

function load() {
    return JSON.parse(localStorage.getItem('todo'));
}

var data = load();
for (var i = 0; i < data.unfinishedTasks.length; i++) {
    var listItem = createNewElement(data.unfinishedTasks[i], false);
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
}

for (var i = 0; i < data.finishedTasks.length; i++) {
    var listItem = createNewElement(data.finishedTasks[i], true);
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
}