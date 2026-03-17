document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  const progressBar = document.getElementById("progress");
  const progressNumber = document.getElementById("number")


  const updateProgress = (checkCompletion = true) => {
    const totalTask = taskList.children.length;
    const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;
    progressBar.style.width = totalTask ? `${(completedTasks / totalTask) * 100}%`: "0%";
    progressNumber.textContent = `${completedTasks} / ${totalTask}`;

    if(checkCompletion && totalTask > 0 && completedTasks === totalTask) {
      confetti();
    }
  }
  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
      text: li.querySelector('span').textContent,
      completed: li.querySelector('.checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks))
  };

  const  loadTaskFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem(tasks)) || [];
    savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
    updateProgress();
  }

  const addTask = (text, completed = false,
    checkCompletion = true) => {
   
    const taskText = text || taskInput.value.trim();
    if(!taskText) {  
      return 
    }
    const li = document.createElement("li");
    li.innerHTML =  `
    <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
    <span>${taskText}</span>
    <div class='task-btn'>
    <button class='edit-btn'><i class="fa-solid fa-pen"></i></button>
    <button class='del-btn'><i class="fa-solid fa-trash"></i></button>
    </div>
    `;
    
  li.querySelector('.del-btn').addEventListener('click', () => {
    li.remove();
    updateProgress();
     saveTaskToLocalStorage();
   });

   const checkbox = li.querySelector(".checkbox");
   const editBtn = li.querySelector('.edit-btn');

if(completed) {
  li.classList.add("completed");
  editBtn.disabled = true;
  editBtn.style.opacity = "0.5";
editBtn.style.pointerEvents = "none";
}
checkbox.addEventListener("change", () => {
  const isChecked = checkbox.checked;
  li.classList.toggle("completed", isChecked);
  editBtn.disabled = isChecked;
  editBtn.style.opacity = isChecked ? "0.5" : "1";
  editBtn.style.pointerEvents = isChecked ? "none" : "auto";
  updateProgress();
  saveTaskToLocalStorage();
})

   editBtn.addEventListener("click", () => {
    if(!checkbox.checked) {
      taskInput.value = li.querySelector("span").textContent;
      li.remove();
      updateProgress(false);
       saveTaskToLocalStorage();
    }
   });
   
    taskList.appendChild(li);
    taskInput.value = "";
    updateProgress(checkCompletion);
     saveTaskToLocalStorage();
  }
  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
        addTask();
  })

  taskInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
 e.preventDefault();
      addTask();
    }
  })

   loadTaskFromLocalStorage();
})
const confetti = () => {
  tsParticles.confetti({
    spread: 360,
    startVelocity: 45,
    particleCount: 100,
    origin: { y: 0.6 },
    colors: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
    shapes: ["circle", "square"],
    scalar: 1.2
  });
}