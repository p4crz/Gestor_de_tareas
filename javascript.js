// 1. Clase que representa cada tarea individual
class Tarea {
    constructor(id, nombre, completada = false) { 
        this.id = id;
        this.nombre = nombre;
        this.completada = completada;
    }
    
    // Método para alternar el estado entre completa e incompleta
    toggleEstado() {
        this.completada = !this.completada;
    }

    // Método para actualizar el texto de la tarea
    editarNombre(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}



// Clase que gestiona la colección de tareas y las operaciones sobre ellas (POO)
class GestorDeTareas {
    constructor() {
        this.tareas = [];
    }

    // Método para agregar una nueva tarea
    agregarTarea(nombre) {
        const nuevaTarea = new Tarea(Date.now(), nombre);
        this.tareas.push(nuevaTarea);
        this.guardarEnLocalStorage();
    }

    // Método para eliminar una tarea usando filter (ES6+)
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== id);
        this.guardarEnLocalStorage();
    }

    // Método para alternar el estado de una tarea
    toggleTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.toggleEstado();
            this.guardarEnLocalStorage();
        }
    }

    // Método para editar el nombre de una tarea
    editarTarea(id, nuevoNombre) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.editarNombre(nuevoNombre);
            this.guardarEnLocalStorage();
        }
    }

    // Desafío adicional: Guardar en LocalStorage
    guardarEnLocalStorage() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    // Cargar tareas guardadas al iniciar la página
    cargarDeLocalStorage() {
        const datos = localStorage.getItem('tareas');
        if (datos) {
            const tareasJSON = JSON.parse(datos);
            // Reconstruimos los objetos utilizando la clase Tarea
            this.tareas = tareasJSON.map(t => new Tarea(t.id, t.nombre, t.completada));
        }
    }
}



// --- MANIPULACIÓN DEL DOM E INTERACCIÓN CON EL USUARIO ---

const gestor = new GestorDeTareas();
gestor.cargarDeLocalStorage(); // Cargamos datos previos si existen

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Función para renderizar las tareas dinámicamente usando ES6+
const renderizarTareas = () => {
    taskList.innerHTML = ''; // Limpiamos la lista antes de volver a pintarla

    gestor.tareas.forEach(tarea => {
        const li = document.createElement('li');
        if (tarea.completada) {
            li.classList.add('completed');
        }

        // Uso de template literals (ES6+) para inyectar HTML dinámico
        li.innerHTML = `
            <span class="task-text" contenteditable="true">${tarea.nombre}</span>
            <div class="task-actions">
                <button class="complete-btn">${tarea.completada ? 'Marcar Incompleta' : 'Completar'}</button>
                <button class="delete-btn">Eliminar</button>
            </div>
        `;

        // Evento para completar/descompletar tarea
        li.querySelector('.complete-btn').addEventListener('click', () => {
            gestor.toggleTarea(tarea.id);
            renderizarTareas();
        });

        // Evento para eliminar tarea
        li.querySelector('.delete-btn').addEventListener('click', () => {
            gestor.eliminarTarea(tarea.id);
            renderizarTareas();
        });

        // Evento para editar el texto directamente al perder el foco (blur)
        const textSpan = li.querySelector('.task-text');
        textSpan.addEventListener('blur', () => {
            const nuevoTexto = textSpan.textContent.trim();
            if (nuevoTexto !== '') {
                gestor.editarTarea(tarea.id, nuevoTexto);
            } else {
                textSpan.textContent = tarea.nombre;
            }
        });

        taskList.appendChild(li);
    });
};

// Evento del botón "Agregar Tarea" con validación de entradas vacías
addTaskBtn.addEventListener('click', () => {
    const textoTarea = taskInput.value.trim();
    
    if (textoTarea === '') {
        alert('Por favor, ingresa un nombre válido para la tarea.');
        return;
    }

    gestor.agregarTarea(textoTarea);
    taskInput.value = ''; // Limpiamos el input
    renderizarTareas();
});

// Permitir agregar tarea presionando la tecla "Enter"
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Renderizar al cargar la página por primera vez
renderizarTareas();