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
            'Authorization': `Bearer ${token}`,
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
        data = fetchedData.map(item => ({
            ...item,
            loadQuantity: 0  // Add loadQuantity to each item with initial value of 0
        }));
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

        const warehouseCell = document.createElement('td');
        warehouseCell.textContent = item.quantity;
        row.appendChild(warehouseCell);

        // Quantity to Load Cell
        const loadCell = document.createElement('td');
        loadCell.textContent = item.loadQuantity;  // Display the current load quantity
        row.appendChild(loadCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = item.category;
        row.appendChild(categoryCell);

        const actionsCell = document.createElement('td');
        actionsCell.style.display = 'flex';
        actionsCell.style.gap = '10px'; // Adjust spacing as needed
        
        const decreaseLoadBtn = document.createElement('button');
        decreaseLoadBtn.textContent = '-';
        decreaseLoadBtn.disabled = parseInt(loadCell.textContent === 0); // Disable if loadQuantity is 0
        decreaseLoadBtn.onclick = () => updateQuantityToLoad(index + start, -1, loadCell);  // Pass loadCell
        actionsCell.appendChild(decreaseLoadBtn);

        const increaseLoadBtn = document.createElement('button');
        increaseLoadBtn.textContent = '+';
        increaseLoadBtn.disabled = parseInt(loadCell.textContent === 0); // Disable if no more quantity in the warehouse
        increaseLoadBtn.onclick = () => updateQuantityToLoad(index + start, 1, loadCell);  // Pass loadCell
        actionsCell.appendChild(increaseLoadBtn);

        row.appendChild(actionsCell);
        itemList.appendChild(row);
    });

    document.getElementById('load-items-btn').addEventListener('click', loadItems);
    updatePaginationControls(page, start + 1, end);
}


function updateQuantityToLoad(index, change, loadCell) {
    const item = data[index];

    if (change > 0 && item.quantity > 0) {
        // Increase load quantity and decrease warehouse quantity
        item.loadQuantity += change;  // Add to the load quantity
        item.quantity -= change;      // Decrease warehouse quantity
    } else if (change < 0 && item.loadQuantity > 0) {
        // Decrease load quantity and increase warehouse quantity
        item.loadQuantity += change;  // Subtract from the load quantity
        item.quantity -= change;      // Increase warehouse quantity
    }

    // Update the Load Quantity cell directly
    loadCell.textContent = item.loadQuantity;

    // Update the warehouse quantity cell if you need to reflect changes
    const warehouseCell = loadCell.previousSibling;
    warehouseCell.textContent = item.quantity;

    checkItemsToLoad(); // Check if any item has a load quantity to enable the "Load" button
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

function loadItems() {
    const itemsToLoad = data
    .filter(item => item.loadQuantity > 0)
    .map(item => ({
        id: item.id,
        item: item.item,
        load_quantity: item.loadQuantity
    }));

    fetch('/api/load_items', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: itemsToLoad })
    })
    .then(response => response.json())
    .then(result => {
        $('#paginationModal').modal('hide');
    })
    .catch(error => {
        alert('Failed to load items.');
    });
}

function checkItemsToLoad() {
    const loadButton = document.getElementById('load-items-btn');
    const hasItemsWithQuantity = data.some(item => item.loadQuantity > 0);
    
    if (hasItemsWithQuantity) {
        loadButton.disabled = false;  // Enable the Load button
    } else {
        loadButton.disabled = true;   // Disable the Load button
    }
}