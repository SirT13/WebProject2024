// Region Notifications
$(document).ready(function () {
    const token = localStorage.getItem('auth-token');
    let items = [];
    let selectedItems = [];

    // When the user clicks the button to create an announcement
    $('#create-announcement-button').click(function () {
        // Make an API call to get_items
        $.ajax({
            url: '/admin/get_items',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                items = JSON.parse(response);

                // Clear the search input, results, and selected items list
                $('#category-search').val('');
                $('#category-results').empty();
                $('#selected-categories-list').empty();

                // Show the modal
                $('#add-announcement-modal').modal('show');
            },
            error: function (error) {
                console.error('Error fetching items:', error);
                alert('Failed to load categories.');
            }
        });
    });

    // Search logic for category search bar
    $('#category-search').on('input', function () {
        const searchQuery = $(this).val().toLowerCase();
        $('#category-results').empty();

        if (searchQuery) {
            // Filter categories from the items
            const filteredCategories = [...new Set(items.filter(item => item.category.toLowerCase().includes(searchQuery)).map(item => item.category))];

            // Display filtered categories
            filteredCategories.forEach(category => {
                $('#category-results').append(`
            <button class="btn btn-light btn-block mb-1 select-category" data-category="${category}">
                ${category}
            </button>
        `);
            });
        }
    });

    // When a user selects a category, display the items for that category
    $('#category-results').on('click', '.select-category', function () {
        const selectedCategory = $(this).data('category');
        $('#category-results').empty();

        // Filter items by the selected category
        const filteredItems = items.filter(item => item.category === selectedCategory);

        // Display items in the selected category
        filteredItems.forEach(item => {
            $('#category-results').append(`
        <div class="form-check">
            <input class="form-check-input select-item" type="checkbox" data-id="${item.id}" data-name="${item.item}" id="item-${item.id}">
            <label class="form-check-label" for="item-${item.id}">
                ${item.item}
            </label>
        </div>
    `);
        });
    });

    // Track selected items
    $('#category-results').on('change', '.select-item', function () {
        const itemId = $(this).data('id');
        const itemName = $(this).data('name');

        if (this.checked) {
            // Add item to selected list
            if (!selectedItems.some(item => item.id === itemId)) {
                selectedItems.push({ id: itemId, name: itemName });

                // Add to selected items display
                $('#selected-categories-list').append(`
            <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${itemId}">
                ${itemName}
                <button class="btn btn-danger btn-sm remove-item" data-id="${itemId}">Remove</button>
            </li>
        `);
            }
        } else {
            // Remove item from selected list
            selectedItems = selectedItems.filter(item => item.id !== itemId);

            // Remove from selected items display
            $(`#selected-categories-list li[data-id="${itemId}"]`).remove();
        }
    });

    // Remove item from selected list
    $('#selected-categories-list').on('click', '.remove-item', function () {
        const itemId = $(this).data('id');
        selectedItems = selectedItems.filter(item => item.id !== itemId);

        // Uncheck the checkbox in the category results
        $(`#category-results input[data-id="${itemId}"]`).prop('checked', false);

        // Remove the item from the selected list in the UI
        $(this).closest('li').remove();
    });

    // Handle form submission to create the notification
    $('#add-announcement-form').submit(function (event) {
        event.preventDefault();

        if (selectedItems.length === 0) {
            alert('Please select at least one item.');
            return;
        }

        const itemIds = selectedItems.map(item => item.id);

        // Make API call to create_notification
        $.ajax({
            url: '/admin/create_notification',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ items: itemIds }),
            success: function (response) {
                alert('Notification created successfully.');
                $('#add-announcement-modal').modal('hide');
            },
            error: function (error) {
                alert('Error creating notification: ' + error.responseText);
            }
        });
    });
});
// End Region Notifications

// Update Warehouse button
$(document).ready(function () {
    const token = localStorage.getItem('auth-token');
    if (!token) {
        window.location.href = '/login';
    }

    $('#logout-button').click(function () {
        localStorage.removeItem('auth-token');
        window.location.href = '/login.html';
    });

    $('#update-warehouse-button').click(function () {
        $.ajax({
            url: '/admin/update_warehouse',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                $('#message').text(response);
            },
            error: function (error) {
                $('#message').text('Error updating warehouse: ' + error.responseText);
            }
        });
    });
});

// Region Add new vehicle
$(document).ready(function () {

    // Open the Add Vehicle modal and fetch rescuers
    $('#add-vehicle-button').on('click', function () {
        $('#add-vehicle-modal').modal('show');  // Ensure the modal is shown

        // Fetch rescuers from the API
        $.ajax({
            url: '/admin/get_rescuers',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                let rescuers = response;

                // Check if response is a string and needs to be parsed as JSON
                if (typeof rescuers === 'string') {
                    rescuers = JSON.parse(rescuers);
                }

                const rescuerList = $('#rescuer-list');
                rescuerList.empty(); // Clear any previous data

                if (Array.isArray(rescuers) && rescuers.length > 0) {
                    // Populate rescuers into the modal
                    rescuers.forEach(rescuer => {
                        const firstName = rescuer.first_name ? rescuer.first_name : "N/A";  // Handle null first_name
                        const lastName = rescuer.last_name ? rescuer.last_name : "N/A";    // Handle null last_name

                        console.log(firstName, lastName);  // Log for debugging

                        // Create the rescuer list item
                        const rescuerItem = `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>${rescuer.username}</span>
                                    <button class="btn btn-primary choose-rescuer-button" data-user-id="${rescuer.id}" data-user-name="${rescuer.username}">
                                        Choose
                                    </button>
                                </div>
                            `;
                        // Append the rescuer to the list
                        rescuerList.append(rescuerItem);
                    });

                    // Handle rescuer selection and trigger add_vehicle API
                    $('.choose-rescuer-button').on('click', function () {
                        const userId = $(this).data('user-id');     // Get the selected rescuer's ID
                        const username = $(this).data('user-name'); // Get the selected rescuer's username
                        console.log(userId, username)
                        // Trigger the API call to add a vehicle
                        $.ajax({
                            url: '/admin/add_vehicle',
                            type: 'POST',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                rescuer_id: userId,       // Send the selected userId
                                username: username    // Send the selected username
                            }),
                            success: function (response) {
                                $('#add-vehicle-modal').modal('hide');
                            },
                            error: function (error) {
                                alert('Error adding vehicle: ' + error.responseText);
                            }
                        });
                    });
                } else {
                    // No rescuers found, display a message
                    rescuerList.append('<p>No rescuers without vehicle found.</p>');
                }
            },
            error: function (error) {
                alert('Error fetching rescuers: ' + error.responseText);
            }
        });
    });
});
// End Region add new vehicle


// Region Add Rescuer
$('#add-rescuer-form').submit(function (event) {
    const token = localStorage.getItem('auth-token');

    event.preventDefault();
    const rescuer_username = $('#reg-rescuer-username').val();
    const resucer_password = $('#reg-rescuer-pass').val();
    $.ajax({
        url: '/admin/register_rescuer',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            username: rescuer_username,
            password: resucer_password
        }),
        success: function (response) {
            $('#add-rescuer-modal').modal('hide');
        },
        error: function (error) {
            $('#message').text('Error registering rescuer: ' + error.responseText);
        }
    });
});
// End Region add rescuer

// Redirect buttons
document.getElementById("redirectButton").onclick = function () {
    window.location.href = "admin_map.html";
};

$('#view-items').click(function () {
    window.location.href = 'items.html';
});
// End Region of redirect buttons

$(document).ready(function () {
    // Ensure the token is available
    const token = localStorage.getItem('auth-token');
    if (!token) {
        console.error('Authorization token is missing');
    }

    // Show the modal with the form when the "Manage Categories" button is clicked
    $('#category-management-button').click(function () {
        $('#add-category-modal').modal('show'); // Show the modal
    });

    // Handle the form submission for adding categories
    $('#add-category-form').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const categoryName = $('#new-category-name').val();
        // Get the entered category name
        if (!categoryName) {
            alert('Please enter a category name.');
            return;
        }

        // Make the API call to add the category
        $.ajax({
            url: '/admin/add_category', // API endpoint (adjust the URL as needed)
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Authorization token
                'Content-Type': 'application/json' // Setting the content type to JSON
            },
            data: JSON.stringify({
                name: categoryName // The category name being passed to the API
            }),
            success: function (response) {
                alert('Category added successfully!');
                $('#add-category-modal').modal('hide'); // Hide the modal after successful submission
                $('#category-list').append('<div class="list-item">' + categoryName + '</div>'); // Update the category list dynamically
                $('#add-category-form')[0].reset(); // Reset the form
            },
            error: function (error) {
                console.error('Error adding category:', error); // Debugging log for any errors
                alert('Error adding category: ' + error.responseText);
            }
        });
    });
});


// Trigger the file input click event when the "Choose File" button is clicked
$('#choose-file-button').click(function () {
    $('#json-file-input').click();
});

$('#upload-json-button').click(function () {
    console.log("clocickckckdssdf")
    const formData = new FormData();
    const fileInput = $('#json-file-input')[0].files[0];
    if (fileInput) {
        formData.append('file', fileInput);
        $.ajax({
            url: 'admin/upload_file',  // The endpoint you want to send the file to
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData,
            contentType: false, // Tell jQuery not to set content-type
            processData: false, // Tell jQuery not to process data
            success: function (response) {
                $('#responseMessage').text('File uploaded and processed successfully.');
                console.log('Server Response:', response);
            },
            error: function (xhr, status, error) {
                const errMessage = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
                $('#responseMessage').text(`Error: ${errMessage}`);
            }
        });
    } else {
        $('#upload-message').text('Please select a JSON file to upload.');
    }
});