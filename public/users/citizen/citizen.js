document.addEventListener('DOMContentLoaded', function () {
    // Fetch requests and populate the request table
    fetchRequests();

    // Fetch offers and populate the offer table
    fetchOffers();
});

// Fetch new requests
$(document).ready(function () {
    let token = localStorage.getItem('auth-token');
    let categories = {};

    // Trigger when the modal is opened
    $('#requestModal').on('show.bs.modal', function () {
        let token = localStorage.getItem('auth-token');

        // Fetch categories and items when the modal opens
        $.ajax({
            url: '/admin/get_items',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                const data = JSON.parse(response);

                // Populate categories and group items by category
                data.forEach(item => {
                    if (!categories[item.category]) {
                        categories[item.category] = [];
                    }
                    categories[item.category].push({ id: item.id, name: item.item });
                });

                // Populate the category select dropdown
                const categorySelect = $('#category-select');
                categorySelect.empty().append('<option value="">Select a Category</option>');

                for (const category in categories) {
                    categorySelect.append(`<option value="${category}">${category}</option>`);
                }

                // Enable the category dropdown
                categorySelect.prop('disabled', false);

                // Reset the items dropdown
                $('#item-select').empty().append('<option value="">Select an Item</option>').prop('disabled', true);
            },
            error: function (error) {
                $('#message').text('Error fetching items: ' + error.responseText);
            }
        });
    });

    // Handle category selection to populate items
    $('#category-select').on('change', function () {
        const selectedCategory = $(this).val();

        if (selectedCategory) {
            const items = categories[selectedCategory];
            const itemSelect = $('#item-select');

            // Populate the items select dropdown based on the selected category
            itemSelect.empty().append('<option value="">Select an Item</option>');

            items.forEach(item => {
                itemSelect.append(`<option value="${item.id}">${item.name}</option>`);
            });

            // Enable the items dropdown
            itemSelect.prop('disabled', false);
        } else {
            // If no category is selected, disable the items dropdown
            $('#item-select').empty().append('<option value="">Select an Item</option>').prop('disabled', true);
        }
    });

    // Handle form submission
    $('#create-request-form').on('submit', function (e) {
        e.preventDefault();
        const item = $('#item-select').val();
        const peopleCount = $('#people-count').val();
        const quantityCount =  $('#quantity-count').val();

        if (!item || !peopleCount || !quantityCount) {
            alert("Please fill out all fields.");
            return;
        }

        // Submit the request
        $.ajax({
            url: '/api/create_request',
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                item_id: item,
                number_of_people: peopleCount,
                quantity: quantityCount
            }),
            success: function (response) {
                alert('Request submitted successfully');
                $('#requestModal').modal('hide');
            },
            error: function (error) {
                alert('Error submitting request: ' + error.responseText);
            }
        });

    });
});


function filterUniqueItems(items) {
    const uniqueItems = [];
    const seenIds = new Set();

    items.forEach(item => {
        if (!seenIds.has(item.item_id)) {
            uniqueItems.push(item);
            seenIds.add(item.item_id);
        }
    });

    return uniqueItems;
}

$(document).ready(function () {
    // Open the announcements modal
    $('#view-announcements-btn').on('click', function () {
        $('#announcementsModal').modal('show');

        // Fetch notifications from the API
        $.ajax({
            url: '/api/get_notifications',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                const notifications = response;
                const announcementList = $('#announcement-list');

                // Clear previous announcements
                announcementList.empty();

                // Group notifications by category
                const groupedByCategory = {};

                notifications.forEach(notification => {
                    if (notification.is_active === 1) {
                        if (!groupedByCategory[notification.category]) {
                            groupedByCategory[notification.category] = [];
                        }
                        groupedByCategory[notification.category].push(notification);
                    }
                });

                // Display grouped notifications with a "Make Offer" button in the category header
                Object.keys(groupedByCategory).forEach(category => {
                    const categoryHeader = `
                <li class="list-group-item active d-flex justify-content-between align-items-center shadow">
                    ${category}
                    <button class="btn btn-sm btn-secondary make-offer-category-btn" data-category="${category}">Make Offer</button>
                </li>`;
                    announcementList.append(categoryHeader);

                    groupedByCategory[category].forEach(notification => {
                        const listItem = `
                    <li class="list-group-item">
                        <ol class="text-dark"> <strong>${notification.name}</strong><br> </ol>
                        <small>Quantity: ${notification.quantity}</small><br>
                        <small>Created at: ${new Date(notification.created_at).toLocaleString()}</small>
                    </li>`;
                        announcementList.append(listItem);
                    });
                });

                // Handle the Make Offer button click at the category level
                $('.make-offer-category-btn').on('click', function () {
                    const category = $(this).data('category');
                    let items = groupedByCategory[category]; // Get all items under this category

                    console.log(category);
                    console.log(items);

                    // Check if items are undefined or empty
                    if (!items || items.length === 0) {
                        alert('No items found for this category');
                        return;
                    }

                    // Filter out duplicate items based on item_id
                    items = filterUniqueItems(items);

                    // Open the offer modal and display all unique items under this category
                    $('#items-list').empty();
                    items.forEach(item => {
                        const itemName = item.name || 'Unnamed Item';
                        const itemQuantity = item.quantity !== undefined ? item.quantity : 'N/A';
                        const itemId = item.item_id || 'Unknown ID';

                        const itemInput = `
                    <div class="list-group-item">
                        <strong>${itemName}</strong><br>
                        <small>Quantity: ${itemQuantity}</small><br>
                        <label for="quantity-${itemId}">Enter Offer Quantity:</label>
                        <input type="number" id="quantity-${itemId}" class="form-control offer-quantity" data-item-id="${itemId}" min="1">
                    </div>`;
                        $('#items-list').append(itemInput);
                    });

                    // Show the offer modal
                    $('#offerModal').modal('show');
                });
            },
            error: function (error) {
                alert('Error fetching announcements: ' + error.responseText);
            }
        });
    });

    // Submit the offers when the "Submit Offer" button is clicked
    $('#submit-offer-btn').on('click', function () {
        const offers = [];

        // Gather all the items and their offer quantities
        $('.offer-quantity').each(function () {
            const itemId = $(this).data('item-id');
            const quantity = $(this).val();

            // If the user entered a quantity, add it to the offers array
            if (quantity) {
                offers.push({
                    item_id: itemId,
                    quantity: quantity
                });
            }
        });

        if (offers.length === 0) {
            alert('Please enter at least one offer.');
            return;
        }

        // Trigger the API call to submit all offers
        $.ajax({
            url: '/api/create_offer',
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                items: offers
            }),
            success: function (response) {
                alert('Offers submitted successfully');
                $('#offerModal').modal('hide');
            },
            error: function (error) {
                alert('Error submitting offers: ' + error.responseText);
            }
        });
    });
});

// Fetch requests from the server
function fetchRequests() {
    fetch('/api/get_requests', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            populateRequestTable(data);
        })
        .catch(error => console.error('Error fetching requests:', error));
}

// Fetch offers from the server
function fetchOffers() {
    fetch('/api/get_offers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            populateOfferTable(data);
        })
        .catch(error => console.error('Error fetching offers:', error));
}

// Populate the request table
function populateRequestTable(requests) {
    const requestList = document.getElementById('request-list');
    requestList.innerHTML = '';

    if (requests.length === 0) {
        requestList.innerHTML = '<tr><td colspan="6">No requests found.</td></tr>';
        return;
    }

    requests.forEach(request => {
        const row = document.createElement('tr');

        const itemCell = document.createElement('td');
        itemCell.textContent = request.name;
        row.appendChild(itemCell);

        const peopleCell = document.createElement('td');
        peopleCell.textContent = request.number_of_people;
        row.appendChild(peopleCell);

        const statusCell = document.createElement('td');

        statusCell.classList.add('status-cell');
        if (request.status === 'complete') {
            statusCell.textContent = "Completed";
            statusCell.classList.add('status-completed');
        } else if (request.status === 'not_assigned') {
            statusCell.textContent = "Pending";
            statusCell.classList.add('status-pending');
        } else {
            statusCell.textContent = "In Progress";
            statusCell.classList.add('status-in-progress');
        }
        row.appendChild(statusCell);

        const dateSubmitedCell = document.createElement('td');
        dateSubmitedCell.textContent = formatDate(request.date_submited);
        row.appendChild(dateSubmitedCell);

        const dateAssignedCell = document.createElement('td');
        dateAssignedCell.textContent = request.date_completed != null ? formatDate(request.date_assigned) : '-';
        row.appendChild(dateAssignedCell);

        const dateCompletedCell = document.createElement('td');
        dateCompletedCell.textContent = request.date_completed != null ? formatDate(request.date_completed) : '-';
        row.appendChild(dateCompletedCell);

        requestList.appendChild(row);
    });
}

// Populate the offer table
function populateOfferTable(offers) {
    const offerList = document.getElementById('offer-list');
    offerList.innerHTML = ''; // Clear any existing data

    if (offers.length === 0) {
        offerList.innerHTML = '<tr><td colspan="7">No offers found.</td></tr>';
        return;
    }

    offers.forEach(offer => {
        const row = document.createElement('tr');

        const itemCell = document.createElement('td');
        itemCell.textContent = offer.name;
        row.appendChild(itemCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = offer.quantity;
        row.appendChild(quantityCell);

        const statusCell = document.createElement('td');
        statusCell.classList.add('status-cell');
        if (offer.status === 'complete') {
            statusCell.textContent = "Completed";
            statusCell.classList.add('status-completed');
        } else if (offer.status === 'not_assigned') {
            statusCell.textContent = "Pending";
            statusCell.classList.add('status-pending');
        } else {
            statusCell.textContent = "In Progress";
            statusCell.classList.add('status-in-progress');
        }
        row.appendChild(statusCell);

        const dateSubmitedCell = document.createElement('td');
        dateSubmitedCell.textContent = formatDate(offer.date_submited);
        row.appendChild(dateSubmitedCell);

        const dateAssignedCell = document.createElement('td');
        dateAssignedCell.textContent = formatDate(offer.date_assigned);
        row.appendChild(dateAssignedCell);

        const dateCompletedCell = document.createElement('td');
        dateCompletedCell.textContent = formatDate(offer.date_completed);
        row.appendChild(dateCompletedCell);

        // Actions column with buttons
        const actionsCell = document.createElement('td');
        if (offer.status == 'in_progress') {
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.classList.add('btn', 'btn-danger', 'delete-task-btn');

            // Add event listener for the cancel button
            cancelButton.addEventListener('click', function () {
                // Confirm before deletion
                deleteOffer(offer.id, row);  // Call deleteOffer function
            });

            actionsCell.appendChild(cancelButton);
        } else {
            actionsCell.textContent = '-';
        }

        row.appendChild(actionsCell);
        offerList.appendChild(row);
    });
}

// Function to send the DELETE request via AJAX
function deleteOffer(offerId, row) {
    fetch(`/api/delete_offer/${offerId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Successfully deleted, remove the row from the table
                row.remove();
                alert('Offer has been successfully canceled.');
            } else {
                // Handle errors (e.g., offer couldn't be deleted)
                alert('Failed to cancel the offer. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error deleting the offer:', error);
            alert('An error occurred. Please try again later.');
        });
}


// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

$('#logout-button').click(function () {
    localStorage.removeItem('auth-token');
    window.location.href = '/login.html';
});