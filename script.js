document.addEventListener('DOMContentLoaded', () => {
    const deadlineListEl = document.getElementById('deadlineList');
    const taskNameInput = document.getElementById('taskName');
    const taskDeadlineInput = document.getElementById('taskDeadline');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const toggleAddBtn = document.getElementById('toggleAddBtn');
    const addSection = document.getElementById('addSection');

    // Toggle Add Section
    toggleAddBtn.addEventListener('click', () => {
        addSection.classList.toggle('hidden');
        if (addSection.classList.contains('hidden')) {
            toggleAddBtn.textContent = '+ Add Deadline';
        } else {
            toggleAddBtn.textContent = 'Close';
        }
    });

    // Default tasks or load from localStorage
    let tasks = JSON.parse(localStorage.getItem('urgentTasks')) || [
        { id: Date.now(), name: "Submit Portfolio", deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() }
    ];

    function saveTasks() {
        localStorage.setItem('urgentTasks', JSON.stringify(tasks));
    }

    function calculateTimeRemaining(deadlineIso) {
        const total = Date.parse(deadlineIso) - Date.parse(new Date());
        if (total <= 0) return { expired: true, text: "Expired" };

        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        let text = "";
        if (days > 0) text += `${days}d `;
        if (hours > 0 || days > 0) text += `${hours}h `;
        text += `${minutes}m ${seconds}s`;

        return { expired: false, text };
    }

    function renderTasks() {
        deadlineListEl.innerHTML = '';
        
        // Filter only active tasks
        const activeTasks = tasks.filter(task => !calculateTimeRemaining(task.deadline).expired);
        
        activeTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        if(activeTasks.length === 0) {
            deadlineListEl.innerHTML = '<div style="text-align:center; padding: 20px; font-size: 13px; opacity: 0.6; font-style: italic;">No active deadlines. Relax! ✨</div>';
            return;
        }

        activeTasks.forEach(task => {
            const timeInfo = calculateTimeRemaining(task.deadline);
            
            const taskEl = document.createElement('div');
            taskEl.className = 'deadline-item';
            
            taskEl.innerHTML = `
                <div class="item-header">
                    <div class="task-name">${task.name}</div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
                </div>
                <div class="time-remaining ${timeInfo.expired ? 'time-expired' : ''}">
                    ${timeInfo.text}
                </div>
            `;
            
            deadlineListEl.appendChild(taskEl);
        });
    }

    // Global function for inline onclick
    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    };

    addTaskBtn.addEventListener('click', () => {
        const name = taskNameInput.value.trim();
        const deadline = taskDeadlineInput.value;

        if (name && deadline) {
            tasks.push({
                id: Date.now(),
                name,
                deadline: new Date(deadline).toISOString()
            });
            saveTasks();
            renderTasks();
            
            // Clear inputs and hide section
            taskNameInput.value = '';
            taskDeadlineInput.value = '';
            addSection.classList.add('hidden');
            toggleAddBtn.textContent = '+ Add Deadline';
        }
    });

    // Initial render
    renderTasks();

    // Update countdown every second
    setInterval(renderTasks, 1000);
});
