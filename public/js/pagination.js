let data = [];
const itemsPerPage = 12; // Adjust according to your requirements
let currentPage = 1;
const token = localStorage.getItem('auth-token');

document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender();
});

function fetchDataAndRender() {
    fetch('/admin/get_items', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the authorization header
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
        setupPageSelection();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // Optionally, handle errors here (e.g., show an error message to the user)
    });
}

function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, data.length);
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

    updatePaginationControls(page, start + 1, end);
}

function updateQuantity(index, change) {
    if (index >= 0 && index < data.length) {
        data[index].quantity = Math.max(0, data[index].quantity + change);
        updateQuantityOnServer(index,data[index].quantity)
        renderPage(currentPage); // Re-render to update quantities
    }
}

function updatePaginationControls(page, start, end) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    document.getElementById('prev-btn').disabled = (page === 1);
    document.getElementById('next-btn').disabled = (page === totalPages);
    document.getElementById('range-info').textContent = `${start}-${end} of ${data.length}`;
    document.getElementById('page-info').textContent = `Page: ${page}`;
}

function setupPageSelection() {
    const totalPages = Math.ceil(data.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
    }

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

function goToPage(page) {
    currentPage = parseInt(page);
    renderPage(currentPage);
}

function updateQuantityOnServer(index, quantity) {
    fetch(`/admin/update_item_quantity`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, // Add the authorization header
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: data[index].id,  // Pass the ID in the body
            quantity: quantity   // Pass the quantity in the body
        })
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