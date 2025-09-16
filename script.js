
/***** Local storage keys *****/
const KEY_NAME = 'todo_username_v1';
const KEY_TASKS = 'todo_tasks_v1';

/***** State *****/
let tasks = [];
let filter = 'all';

/***** DOM refs *****/
const greeting = document.getElementById('greeting');
const resetBtn = document.getElementById('resetBtn');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const saveNameBtn = document.getElementById('saveNameBtn');

const taskInput = document.getElementById('taskInput');
const dueInput = document.getElementById('dueInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const filters = document.querySelectorAll('.filter');
const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statCompleted = document.getElementById('statCompleted');
const sortSelect = document.getElementById('sortSelect');

/***** Utilities *****/
function uid(){return Date.now().toString(36) + Math.random().toString(36).slice(2,7)}
function saveTasks(){localStorage.setItem(KEY_TASKS, JSON.stringify(tasks))}
function loadTasks(){
  try{const raw = localStorage.getItem(KEY_TASKS); tasks = raw ? JSON.parse(raw) : [];}
  catch(e){tasks = []}
}

function formatDate(d){
  if(!d) return '';
  const dt = new Date(d);
  if(isNaN(dt)) return '';
  return dt.toLocaleDateString();
}

/***** Name logic *****/
function getName(){return localStorage.getItem(KEY_NAME)}
function setName(n){localStorage.setItem(KEY_NAME, n)}
function clearAll(){localStorage.removeItem(KEY_NAME);localStorage.removeItem(KEY_TASKS);tasks=[]}

function openNameModalIfNeeded(){
  const nm = getName();
  if(!nm){nameModal.style.display='flex';nameInput.focus();}
  else updateGreeting(nm);
}

function updateGreeting(nm){
  greeting.textContent = `Hi, ${nm}`;
}

saveNameBtn.addEventListener('click', ()=>{
  const v = nameInput.value.trim();
  if(!v) return nameInput.focus();
  setName(v);
  nameModal.style.display='none';
  updateGreeting(v);
});

nameInput.addEventListener('keydown', (e)=>{if(e.key==='Enter') saveNameBtn.click();});

/***** Task CRUD *****/
function addTask(text, due){
  const t = {id:uid(), text, due: due||null, created: new Date().toISOString(), completed:false};
  tasks.push(t); saveTasks(); render();
}

function updateTask(id, updates){
  const i = tasks.findIndex(x=>x.id===id); if(i<0) return;
  tasks[i] = {...tasks[i], ...updates}; saveTasks(); render();
}

function deleteTask(id){
  tasks = tasks.filter(x=>x.id!==id); saveTasks(); render();
}

function toggleComplete(id){
  const t = tasks.find(x=>x.id===id); if(!t) return; t.completed = !t.completed; saveTasks(); render();
}

/***** Render *****/
function applyFilterAndSort(list){
  let out = list.slice();
  if(filter==='active') out = out.filter(t=>!t.completed);
  if(filter==='completed') out = out.filter(t=>t.completed);

  const sortBy = sortSelect.value;
  if(sortBy==='created-desc') out.sort((a,b)=> new Date(b.created) - new Date(a.created));
  if(sortBy==='created-asc') out.sort((a,b)=> new Date(a.created) - new Date(b.created));
  if(sortBy==='due-asc') out.sort((a,b)=>{
    if(!a.due) return 1; if(!b.due) return -1; return new Date(a.due) - new Date(b.due);
  });
  if(sortBy==='due-desc') out.sort((a,b)=>{
    if(!a.due) return 1; if(!b.due) return -1; return new Date(b.due) - new Date(a.due);
  });
  return out;
}

function render(){
  tasksList.innerHTML = '';
  const visible = applyFilterAndSort(tasks);
  if(visible.length===0){
    tasksList.innerHTML = '<div class="empty">No tasks yet — add your first task ✨</div>';
  } else {
    visible.forEach(t=>{
      const el = document.createElement('div'); el.className='task';

      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = !!t.completed; cb.addEventListener('change', ()=>toggleComplete(t.id));

      const meta = document.createElement('div'); meta.className='meta';
      const title = document.createElement('div'); title.className='title'; title.textContent = t.text || '(no title)';
      if(t.completed) title.classList.add('completed');
      title.title = 'Click to edit';

      // edit on click
      title.addEventListener('click', ()=>enterEditMode(t.id, title));

      const due = document.createElement('div'); due.className='due muted'; due.textContent = t.due ? 'Due: ' + formatDate(t.due) : 'No due date';

      meta.appendChild(title); meta.appendChild(due);

      const controls = document.createElement('div'); controls.className='controls';
      const editBtn = document.createElement('button'); editBtn.className='icon-btn'; editBtn.title='Edit'; editBtn.innerHTML='✎'; editBtn.addEventListener('click', ()=>enterEditMode(t.id, title));
      const delBtn = document.createElement('button'); delBtn.className='icon-btn'; delBtn.title='Delete'; delBtn.innerHTML='🗑'; delBtn.addEventListener('click', ()=>{ if(confirm('Delete this task?')) deleteTask(t.id); });

      controls.appendChild(editBtn); controls.appendChild(delBtn);

      el.appendChild(cb); el.appendChild(meta); el.appendChild(controls);
      tasksList.appendChild(el);
    });
  }

  // stats
  statTotal.textContent = `Total: ${tasks.length}`;
  statCompleted.textContent = `Completed: ${tasks.filter(t=>t.completed).length}`;
  statActive.textContent = `Active: ${tasks.filter(t=>!t.completed).length}`;
}

/***** Edit mode inline *****/
function enterEditMode(id, titleEl){
  const t = tasks.find(x=>x.id===id); if(!t) return;
  const input = document.createElement('input'); input.type='text'; input.value = t.text; input.style.width='100%'; input.style.padding='8px'; input.style.borderRadius='8px';

  const dueInputLocal = document.createElement('input'); dueInputLocal.type='date'; dueInputLocal.value = t.due ? t.due.split('T')[0] : '';
  dueInputLocal.style.marginTop='8px'; dueInputLocal.style.width='100%'; dueInputLocal.style.padding='8px'; dueInputLocal.style.borderRadius='8px';

  const save = ()=>{
    const newText = input.value.trim() || '(no title)';
    const newDue = dueInputLocal.value ? new Date(dueInputLocal.value).toISOString() : null;
    updateTask(id, {text: newText, due: newDue});
  }

  // replace meta content
  const meta = titleEl.parentElement;
  meta.innerHTML='';
  meta.appendChild(input);
  meta.appendChild(dueInputLocal);

  input.focus();
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') save(); if(e.key==='Escape') render(); });
  dueInputLocal.addEventListener('keydown', (e)=>{ if(e.key==='Enter') save(); if(e.key==='Escape') render(); });
  // save on blur (give a short timeout so clicks to save/del still register)
  input.addEventListener('blur', ()=>setTimeout(save,150));
  dueInputLocal.addEventListener('blur', ()=>setTimeout(save,150));
}

/***** Events *****/
addBtn.addEventListener('click', ()=>{
  const txt = taskInput.value.trim(); if(!txt) { taskInput.focus(); return; }
  const due = dueInput.value ? new Date(dueInput.value).toISOString() : null;
  addTask(txt, due);
  taskInput.value=''; dueInput.value=''; taskInput.focus();
});
taskInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') addBtn.click(); });

filters.forEach(f=>f.addEventListener('click', ()=>{
  filters.forEach(x=>x.classList.remove('active')); f.classList.add('active'); filter = f.dataset.filter; render();
}));

sortSelect.addEventListener('change', render);

resetBtn.addEventListener('click', ()=>{
  if(confirm('This will clear all your data (name and tasks). Are you sure?')){
    clearAll(); render(); greeting.textContent='Hi —'; nameModal.style.display='flex';
  }
});

/***** Init *****/
loadTasks();
openNameModalIfNeeded();
render();

// expose for debugging (optional)
window._app = {tasks, addTask, updateTask, deleteTask, toggleComplete};