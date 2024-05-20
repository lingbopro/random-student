var students = [];

function randomStudent() {
    let amount = document.getElementById('choose_amount').value;
    let active = [];
    let choosed = [];
    if(!isNaN(amount)) {
        if(amount > 0) {
            console.log('[随机] 开始随机');
            for(let i = 0; i < students.length; i++) {
                if(students[i].active == true) {
                    active.push(students[i]);
                }
            }
            console.log(active);
            if(amount <= active.length) {
                for(let i = 1; i<= amount; i++) {
                    console.debug('[随机] 第' + i + '次抽取');
                    while(true) {
                        let now = randint(0,active.length - 1);
                        if(choosed.includes(now)) {
                            console.debug('[随机] 检测到重复');
                            continue;
                        }
                        choosed[choosed.length] = now;
                        break;
                    }
                }
                console.log(choosed);
                let dom = '';
                for(let i = 0; i < choosed.length; i++) {
                    dom += `<li>${active[choosed[i]].name}</li>`
                }
                document.getElementById('output').innerHTML = dom;
            }
            else {
                window.alert('人数应小于等于选中的人数');
            }
        }
        else {
            window.alert('人数应大于0')
        }
    }
    else {
        window.alert(amount + ' 不是一个数字')
    }
}
function saveData() {
    localStorage.setItem('randomStudent', JSON.stringify(students));
}


function addStudent(name) {
    students[students.length] = {name: name, active: false};
}
function refreshStudents(save = true) {
    let listEl = document.getElementById('students');
    let listDOM = '';
    console.debug('[刷新] 开始刷新数据DOM')
    for(let i = 0; i < students.length; i++) {
        listDOM += `
<li class="${students[i].active? 'active': ''}" id="student_${i}">
    <div class="name" onclick="toggleStudent(${i})">${students[i].name}</div>
    <div class="options">
        <div class="edit_button" title="编辑" onclick="event_editButton(${i})">
            <i class="bi bi-pencil-square"></i>
        </div>
        <div class="delete_button" title="删除" onclick="event_deleteButton(${i})">
            <i class="bi bi-x-lg"></i>
        </div>
    </div>
</li>
`;
    }
    listEl.innerHTML = listDOM;
    console.debug('[刷新] 刷新结束');
    if(save) {
        saveData();
    }
}
function deleteStudent(id) {
    students.splice(id, 1);
    console.log('[删除] 删除ID:' + id);
}
function toggleStudent(id, save = true) {
    students[id].active = !students[id].active;
    let studentEl = document.getElementById('student_' + id);
    studentEl.classList.toggle('active');
    if(save) {
        saveData();
    }
}
function deleteAll() {
    if(window.confirm('确认要全部删除吗？\n所有数据将会永远丢失（真的很久！）')) {
        students = [];
    }
    refreshStudents();
}

function event_load() {
    console.log('[初始化] 页面加载');
    let storage = localStorage.getItem('randomStudent');
    let parsed;
    if(storage === null) {
        addStudent('示例数据');
    }
    else {
        try {
            parsed = JSON.parse(storage);
        } catch (error) {
            console.error('遇到错误:\n' + error.message);
            addStudent('示例数据');
            refreshStudents();
            return;
        }
        students = parsed;
    }
    refreshStudents();
}
function event_addButton() {
    let addStudentArray = document.getElementById('add_students').value.split('\n');
    console.debug(addStudentArray);
    for(let i = 0; i < addStudentArray.length; i++) {
        if(addStudentArray[i].length > 0) {
            addStudent(addStudentArray[i]);
        }
        
    }
    refreshStudents();
    closedialog();
}
function event_deleteButton(id) {
    deleteStudent(id);
    refreshStudents();
}
function event_editButton(id) {
    document.getElementById('edit_id').innerText = id.toString();
    document.getElementById('edit_student').value = students[id].name;
    opendialog('edit');
}
function event_editSubmit(id) {
    students[(document.getElementById('edit_id').innerText)].name = document.getElementById('edit_student').value;
    refreshStudents();
    closedialog();
}
function event_import(id) {
    let inputEl = document.getElementById('import');
    let parsed;
    try {
        parsed = JSON.parse(inputEl.value);
    } catch (error) {
        window.alert('遇到错误:\n' + error.message);
        return;
    }
    students = parsed;
    refreshStudents();
    closedialog();
}
function event_export(id) {
    let textBoxEl = document.getElementById('export');
    try {
        textBoxEl.value = JSON.stringify(students);
    } catch (error) {
        window.alert('遇到错误:\n' + error.message);
        return;
    }
    opendialog('export');
}
function toggleSelectAll() {
    let isSelectAll = students.every(function (currentValue) {
        return currentValue.active;
    });
    for(let i = 0; i < students.length; i++) {
        students[i].active = !isSelectAll;
    }
    refreshStudents();
}

function opendialog(child) {
    let dialogEl = document.getElementById('dialog');
    let dialogChildrenEl = document.getElementById('dialog_children');
    for(let i=0; i<dialogChildrenEl.children.length; i++) {
        dialogChildrenEl.children[i].hidden = true;
    }
    document.getElementById('dialog_' + child).hidden = false;
    dialogEl.classList.add('open');
}
function closedialog() {
    document.getElementById('dialog').classList.remove('open');
}

// 生成从minNum到maxNum的随机数
// https://www.runoob.com/w3cnote/js-random.html
function randint(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 