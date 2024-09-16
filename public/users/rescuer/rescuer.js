$(document).ready(function () {
    const token = localStorage.getItem('auth-token');
    if (!token) {
        window.location.href = '/login';
    } else {
        $('#welcome-message').text('Welcome, Rescuer!');
    }
    const map = L.map('map')

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Fetch warehouse location and add the baseMarker
    let warehouseLocation = null
    $.ajax({
        url: '/admin/get_warehouse_location',
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            let location = JSON.parse(response)
            warehouseLocation = [location[0].latitude, location[0].longitude];
            // Add the warehouse marker
            const baseMarker = L.marker(warehouseLocation, {
                icon: L.icon({
                    iconUrl: 'assets/warehouse.png', // Example warehouse icon
                    iconSize: [32, 32],
                    iconAnchor: [16, 32], // Anchor the icon at the center bottom
                    popupAnchor: [0, -32] // Position the popup correctly relative to the icon
                })
            }).addTo(map);

            // Bind a popup to the warehouse marker
            baseMarker.bindPopup('<strong>Warehouse Location</strong>').openPopup();

            // Adjust the map view to include the warehouse location
            map.setView(warehouseLocation, 12);

        },
        error: function (error) {
            console.error('Error fetching warehouse location:', error);
        }
    });
    $('#confirm-unload-btn').on('click', function () {
        $('#confirmUnloadModal').modal('hide');

        $.ajax({
            url: '/api/unload_items',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth-token'), // Replace with actual token
                'Content-Type': 'application/json'
            },
            success: function (response) {
                alert('Unload operation completed successfully!');
            },
            error: function (error) {
                console.error('Error during unload operation:', error);
                alert('Failed to complete the unload operation.');
            }
        });
    });


    const taskMarkers = [];
    const polylines = [];

    $.ajax({
        url: '/api/get_rescuer_map_info',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        success: function (response) {
            const records = JSON.parse(response)
            console.log(records)
            // Assuming 'tasks' is your array from the JSON response
            let rescuerLatitude = 23.786087036132816;
            let rescuerLongitude = 37.99237479543426;

            const rescuerMarker = L.marker([rescuerLatitude, rescuerLongitude], {
                icon: L.icon({
                    iconUrl: 'assets/rescuer.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                }),
                draggable: true
            }).addTo(map);

            // Bind a popup to the rescuer marker
            rescuerMarker.bindPopup(`
                <div style="text-align: center;">
                     <button id="showLoadButton" class="btn btn-primary" style="margin-top: 10px; background-color: #FF8C00; border-color: #FF8C00; color: white;">Προβολή Φορτίου</button>
                </div>
            `);

            rescuerMarker.on('popupopen', function () {
                document.getElementById('showLoadButton').addEventListener('click', function () {
                    // Trigger AJAX call to get the load information
                    $.ajax({
                        url: '/api/get_vehicle_load',
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        success: function (response) {
                            let parsedData = JSON.parse(response);
                            let loadItems = JSON.parse(parsedData[0].load)
                            let loadDetailsHTML = '';
                            if (loadItems && loadItems.length > 0) {

                                loadItems.forEach(function (item) {
                                    loadDetailsHTML += `
                                        <div class="load-item">
                                            <strong>Item:</strong> ${item.item}<br>
                                            <strong>Quantity:</strong> ${item.load_quantity}<br>
                                        </div>
                                        <hr>`;
                                });
                            } else {
                                loadDetailsHTML = '<p>No items found in the load.</p>';
                            }

                            // Inject the content into the modal body
                            document.getElementById('loadDetailsBody').innerHTML = loadDetailsHTML;

                            // Show the modal
                            $('#loadDetailsModal').modal('show');
                        },
                        error: function (error) {
                            console.error('Error fetching load details:', error);
                        }
                    });
                });
            });

            const taskPanel = $('#task-panel');
            records.forEach((record, index) => {
                const date_submited = new Date(record.date_submited);
                const formattedDateSumbited = date_submited.toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                const date_assigned = new Date(record.date_assigned);
                const formattedDateAssigned = date_assigned.toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                //Task Panel
                if (record.rescuer_id && record.status === 'in_progress') {
                    // Create a div for the task item
                    const taskItem = $(`
                            <div class="task-item ${record.type === 'request' ? 'request-border' : 'offer-border'}" 
                                data-task-type="${record.type}" 
                                data-quantity="${record.quantity}"
                                data-item-id="${record.item_id}"
                                data-item-name="${record.item_name}">
                                <h4>${record.type === 'request' ? 'Αίτημα' : 'Προσφορά'}</h4>
                                <p><strong>Ονοματεπώνυμο:</strong> ${record.citizen}</p>
                                <p><strong>Τηλέφωνο:</strong> ${record.citizen_phone_number}</p>
                                <p><strong>Είδος:</strong> ${record.item_name}</p>
                                <p><strong>Ποσότητα:</strong> ${record.quantity}</p>
                                <p><strong>Ημερομηνία Καταχώρησης:</strong> ${formattedDateSumbited}</p>
                                <p><strong>Ημερομηνία Ανάληψης:</strong> ${formattedDateAssigned}</p>
                                <button class="complete-task-btn" data-task-id="${record.task_id}" disabled>Complete</button>
                                <button class="cancel-task-btn" data-task-id="${record.task_id}">Abort</button>
                            </div>
                        `);

                    // Append the task item to the panel
                    taskPanel.append(taskItem);
                }

                const citizenLocation = [record.citizen_latitude, record.citizen_longitude];

                // Add a marker for the citizen's location
                let iconURL = null
                let type = null
                if (record.type === 'request' && record.status === 'not_assigned') {
                    iconURL = 'assets/person_raised_hand_black.png'
                    type = 'pending_request'
                }
                else if (record.type === 'request' && record.status != 'not_assigned') {
                    iconURL = 'assets/person_raised_hand_orange.png'
                    type = 'in_progress_request'
                }
                else if (record.type === 'offer' && record.status === 'not_assigned') {
                    iconURL = 'assets/person_raised_hand_black.png'
                    type = 'pending_offer'
                }
                else {
                    iconURL = 'assets/person_raised_hand_red.png'
                    type = 'in_progress_offer'
                }

                const taskMarker = L.marker(citizenLocation, {
                    type: type,
                    icon: L.icon({
                        iconUrl: iconURL,
                        iconSize: [42, 42],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    })
                }).addTo(map).bindPopup(`
                        <strong>${record.type === 'request' ? 'Αίτημα' : 'Προσφορά'}</strong><br>
                        Ονοματεπώνυμο: ${record.citizen}<br>
                        Τηλέφωνο: ${record.citizen_phone_number}<br>
                        Κατάσταση: ${record.status}<br>
                        Είδος: ${record.item_name}<br>
                        Ημερομηνία Καταχώρησης: ${formattedDateSumbited}<br>
                        Ημερομηνία Ανάληψης: ${formattedDateAssigned}<br>
                        Ποσότητα: ${record.quantity}<br>
                        ${record.status === 'not_assigned' ? `
                        <div style="margin-top: 10px;">
                            <button id="rescue-btn-${record.task_id}" class="rescue-btn">
                                Ανάληψη
                            </button>
                        </div>` : ''}
                    `).on('popupopen', function () {
                    const button = document.getElementById(`rescue-btn-${record.task_id}`);
                    if (button) {
                        button.addEventListener('click', function () {
                            $.ajax({
                                url: '/api/assign_task',
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify({
                                    task_id: record.task_id
                                }),
                                success: function (response) {
                                    alert(response.message)
                                },
                                error: function (error) {
                                    console.error('Error assigning task:', error);
                                    alert('Failed to assign the task.');
                                }
                            });
                            location.reload()
                        });
                    }
                });

                taskMarkers.push(taskMarker);
                taskMarkers.forEach(taskMarker => {
                    if (taskMarker.options.type === "in_progress_request" || taskMarker.options.type === "in_progress_offer") {
                        const line = L.polyline([rescuerMarker.getLatLng(), taskMarker.getLatLng()], {
                            color: 'blue',
                            weight: 3,
                            opacity: 0.7
                        }).addTo(map);

                        polylines.push(line);
                    }

                });

                rescuerMarker.on('dragend', function (event) {
                    const newLocation = event.target.getLatLng();
                    if (record.status === 'in_progress') {
                        const citizen_latitude = record.citizen_latitude
                        const citizen_longitude = record.citizen_longitude
                        const taskRescuerDistance = calculateDistance(newLocation.lat, newLocation.lng, citizen_latitude, citizen_longitude);
                        const completeButton = $(`.complete-task-btn[data-task-id="${record.task_id}"]`);

                        if (taskRescuerDistance <= 50) {
                            completeButton.prop('disabled', false);
                        } else {
                            completeButton.prop('disabled', true);
                        }
                    }

                    const warehouseRescuerDistance = calculateDistance(newLocation.lat, newLocation.lng, warehouseLocation[0], warehouseLocation[1]);
                    const loadButton = $('#load-button')
                    const unloadButton = $('#unload-button')
                    if (warehouseRescuerDistance <= 100) {
                        loadButton.prop('disabled', false);
                        unloadButton.prop('disabled', false);
                    } else {
                        loadButton.prop('disabled', true);
                        unloadButton.prop('disabled', true);
                    }
                    polylines.forEach(polyline => {
                        polyline.setLatLngs([newLocation, polyline.getLatLngs()[1]]);
                    });

                    $.ajax({
                        url: '/api/save_rescuer_location',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            latitude: newLocation.lat,
                            longitude: newLocation.lng
                        }),
                        success: function (response) {
                        },
                        error: function (error) {
                            console.error('Error saving new rescuer location:', error);
                        }
                    });
                });

                map.fitBounds([
                    rescuerMarker.getLatLng(),
                    ...taskMarkers.map(marker => marker.getLatLng())
                ]);
            });

            // Handle button clicks for completing or canceling tasks
            $('.complete-task-btn').on('click', function () {
                const taskId = $(this).data('task-id');
                const $taskItem = $(this).closest('.task-item');
                const taskType = $taskItem.attr('data-task-type');
                const quantity = $taskItem.attr('data-quantity');
                const item_id = $taskItem.attr('data-item-id');
                const item_name = $taskItem.attr('data-item-name');
                updateTaskStatus(taskId, 'complete', taskType, quantity, item_id, item_name);
            });

            $('.cancel-task-btn').on('click', function () {
                const taskId = $(this).data('task-id');
                const $taskItem = $(this).closest('.task-item');
                const taskType = $taskItem.attr('data-task-type');
                updateTaskStatus(taskId, 'not_assigned', taskType, 0, 0, "");
            });
        },
        error: function (error) {
            alert('Error fetching data: ' + error.responseText);
        }

    })

    function updateTaskStatus(taskId, status, taskType, item_quantity, itemId, itemName) {
        $.ajax({
            url: '/api/update_task_status',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                task_id: taskId,
                status: status,
                task_type: taskType,
                quantity: item_quantity,
                item_id: itemId,
                item_name: itemName
            }),
            success: function (response) {
                location.reload(); // Reload the page to update the task list
            },
            error: function (error) {
                alert('Error updating task status: ' + error.responseText);
            }
        });
    }
    function applyFilters() {
        const showInProgressRequests = $('#in-progress-requests').is(':checked');
        const showPendingRequests = $('#pending-requests').is(':checked');
        const showInProgressOffers = $('#in-progress-offers').is(':checked');
        const showPendingOffers = $('#pending-offers').is(':checked');
        console.log(taskMarkers)
        // Loop through each marker and apply filters
        taskMarkers.forEach(marker => {
            const markerType = marker.options.type;

            let shouldShow = false;
            if (markerType === 'in_progress_request' && showInProgressRequests) {
                shouldShow = true;
            } else if (markerType === 'pending_request' && showPendingRequests) {
                shouldShow = true;
            } else if (markerType === 'in_progress_offer' && showInProgressOffers) {
                shouldShow = true;
            } else if (markerType === 'pending_offer' && showPendingOffers) {
                shouldShow = true;
            }

            // Show or hide the marker based on the filter
            if (shouldShow) {
                marker.addTo(map);  // Add the marker to the map
            } else {
                map.removeLayer(marker);  // Remove the marker from the map
            }
        });
    }
    $('#in-progress-requests').on('change', applyFilters);
    $('#pending-requests').on('change', applyFilters);
    $('#in-progress-offers').on('change', applyFilters);
    $('#pending-offers').on('change', applyFilters);
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
}

$('#logout-button').click(function () {
    localStorage.removeItem('auth-token');
    window.location.href = '/login.html';
});