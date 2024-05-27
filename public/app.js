document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');

    if (!form) {
        console.error("Form not found");
        return;
    }


    fetchTodos();
});

async function addTodo() {
    // Get the value from the input field
    var todoInput = document.querySelector('input[name="title"]').value;
    if (todoInput.trim() === '') {
        alert('Please enter a todo item.');
        return;
    }

    // Here you would typically send a request to your server to add the todo item
    // For now, let's just log it to the console
    console.log('Adding todo:', todoInput);

    // Optionally, clear the input after adding
    document.querySelector('input[name="title"]').value = '';


    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'title': todoInput })
    });

    console.log("Response status:", response.status);

    if (response.ok) {
        const result = await response.json();
        console.log("Success response:", result);
        alert(result.message);
    } else {
        const error = await response.json();
        console.log("Error response:", error);
        alert(error.message);
    }
}


async function fetchTodos() {
    const response = await fetch('/');
    const data = await response.text();
    document.documentElement.innerHTML = data;
    setupDeleteForms();
}

function setupDeleteForms() {
    document.querySelectorAll('.inline-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = form.closest('tr').dataset.id;
            if (confirm("Are you sure you want to delete this item?")) {
                const response = await fetch(`/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const result = await response.json();
                    //alert(result.message);
                    form.closest('tr').remove();
                } else {
                    const error = await response.json();
                    alert('Failed to delete TODO: ' + error.message);
                }
            }
        });
    });
}
