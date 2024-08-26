let data = [];
const itemsPerPage = 10;
let currentPage = 1;
const authToken = localStorage.getItem('auth-token'); 
document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender();
});

function fetchDataAndRender() {
    fetch('/admin/get_items', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`, // Add the authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(fetchedData => {
        data = fetchedData;
        renderPage(currentPage);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // Optionally, handle errors here (e.g., show an error message to the user)
    });
}

function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = data.slice(start, end);

    const itemList = document.getElementById('item-list');
    itemList.innerHTML = ''; // Clear previous items

    itemsToShow.forEach((item, index) => {
        const row = document.createElement('tr');

        const itemCell = document.createElement('td');
        itemCell.textContent = item.item;
        row.appendChild(itemCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = item.category;
        row.appendChild(categoryCell);

        const actionsCell = document.createElement('td');

        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.onclick = () => updateQuantity(index + start, -1);
        actionsCell.appendChild(decreaseBtn);

        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => updateQuantity(index + start, 1);
        actionsCell.appendChild(increaseBtn);

        row.appendChild(actionsCell);

        itemList.appendChild(row);
    });

    updatePaginationControls(page);
}

function updateQuantity(index, change) {
    if (index >= 0 && index < data.length) {
        data[index].quantity = Math.max(0, data[index].quantity + change);
        // Optional: Make an API call to update the server-side data
        // Example: updateQuantityOnServer(index, data[index].quantity);
        renderPage(currentPage); // Re-render to update quantities
    }
}

function updatePaginationControls(page) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    document.getElementById('prev-btn').disabled = (page === 1);
    document.getElementById('next-btn').disabled = (page === totalPages);
    document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
}

function nextPage() {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
}

// Optional: Function to send updated quantity to the server
function updateQuantityOnServer(index, quantity) {
    fetch(`/admin/update_item_quantity/${data[index].id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(updatedItem => {
        // Handle the server response if needed
    })
    .catch(error => {
        console.error('Error updating item:', error);
        // Optionally, handle errors here (e.g., revert the quantity change)
    });
}
