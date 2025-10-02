let currentSelectionMode = null;
let selectedParticipant = null;
const selectedFinalists = [];
let selectedChampion = null;
const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value);
const final_stage = document.getElementById('final_stage').value

function initializeEventListeners() {
    document.getElementById('final-pick').addEventListener('click', () => {
        currentSelectionMode = 'final';
        showFinalSelectionModal();
    });
    
    document.getElementById('confirm-selection').addEventListener('click', handleSelectionConfirmation);
    
    document.getElementById('selection-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    });
}

function showFinalSelectionModal() {
    const modal = document.getElementById('selection-modal');
    const optionsContainer = document.getElementById('participant-options');
    const confirmBtn = document.getElementById('confirm-selection');
    optionsContainer.innerHTML = '';
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Select a participant first';
    
    // Get all finalists (both original and clones)
    const finalists = Array.from(document.querySelectorAll('.finalist-slot, .finalist-clone'));
    
    finalists.forEach(participant => {
        const option = document.createElement('div');
        option.className = 'participant-option';
        const youtubeId = participant.dataset.youtubeId || '1T22wNvoNiU';
        
        option.innerHTML = `
        <div class="video-option">
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${youtubeId}?enablejsapi=1" 
                    frameborder="0"
                    allowfullscreen>
                </iframe>
            </div>
            <div class="participant-info">
                <img src="${participant.querySelector('img').src}">
                <h4>${participant.querySelector('.finalist-name, .obj_name').textContent}</h4>
                <button class="select-participant">Select This Participant</button>
            </div>
        </div>
        `;
        
        const selectBtn = option.querySelector('.select-participant');
        selectBtn.addEventListener('click', () => {
            document.querySelectorAll('.participant-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.select-participant').textContent = 'Select This Participant';
            });
            
            option.classList.add('selected');
            selectBtn.textContent = '✓ Selected';
            selectedParticipant = participant;
            
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm Selection';
        });
        
        optionsContainer.appendChild(option);
    });
    
    modal.style.display = 'flex';
}

function handleSelectionConfirmation() {
    if (!selectedParticipant) return;

    if (currentSelectionMode === 'final') {
        placeChampion();
    }
    closeModal();
}

function placeChampion() {
    const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value);
    console.log(amount_of_participants)
    
    // Remove existing champion if any
    const existingChamp = document.querySelector('.champion');
    if (existingChamp) existingChamp.remove();

    // Get elements (works with both original and cloned participants)
    const imgSrc = selectedParticipant.querySelector('img').src;
    const name = selectedParticipant.querySelector('.finalist-name, .obj_name').textContent;
    
    // Create champion container
    const champion = document.createElement('div');
    champion.className = 'champion winner-container';
    
    // Different styling based on bracket size
    if (amount_of_participants === 4 || amount_of_participants === 32 && final_stage == 'True') {
        champion.innerHTML = `
            <div class="winner-content">
                <div class="winner-name" style="font-size: 15px;">${name}</div>
                <img src="${imgSrc}" class="winner-image" style="width: 150px; height: 150px;">
            </div>
        `;
        champion.style.cssText = `
            position: absolute;
            top: 69.5%;
            left: 47.7%;
            transform: translate(-50%, -50%);
            z-index: 1000;
        `;
    } else if (amount_of_participants === 8 || amount_of_participants === 32 && final_stage == 'False' || amount_of_participants === 128 && final_stage == 'True') {
        champion.innerHTML = `
            <div class="winner-content">
                <div class="winner-name" style="font-size: 17px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</div>
                <img src="${imgSrc}" class="winner-image" style="width: 150px; height: 150px;">
            </div>
        `;
        champion.style.cssText = `
            position: absolute;
            top: 65%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
        `;
    }else if (amount_of_participants === 16 || amount_of_participants === 128 && final_stage == 'False') {
        champion.innerHTML = `
            <div class="winner-content">
                <div class="winner-name" style="font-size: 17px;">${name}</div>
                <img src="${imgSrc}" class="winner-image" style="width: 135px; height: 135px;">
            </div>
        `;
        champion.style.cssText = `
            position: absolute;
            top: 67.6%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px`;
 
    }

    document.querySelector('.bracket-wrapper').appendChild(champion);
    document.getElementById('final-pick').hidden = true;
    
    save_winner(selectedParticipant.dataset.id);
}

function closeModal() {
    document.getElementById('selection-modal').style.display = 'none';
    selectedParticipant = null;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializeEventListeners);

function save_winner(id) {
    if (amount_of_participants === 32 && final_stage == 'True'){

        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner_winner' })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save winner');
        console.log('Winner saved successfully');
    })
    .catch(error => console.error('Error saving winner:', error));

    }
    else if (amount_of_participants === 32 && final_stage == 'False' ){
        const group = parseInt(document.getElementById('group').value);
        let slot_row_semi = 0
        let is_left_side = 0
        if (group === 1){
             slot_row_semi = 26.4;
             is_left_side = false;

        }
        else if(group === 2){
             slot_row_semi = 26.4;
             is_left_side = true;

        }

        else if (group ===3){
             slot_row_semi = 54.0
             is_left_side = false

        }
        else if (group === 4 ){
             slot_row_semi = 54.0
             is_left_side = true

        }
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner', slot_row_semi: slot_row_semi, is_left_side: is_left_side })
    })
    .then(response => {
            if (response.ok) {
                // Show reload window after successful save
                showReloadWindow();
            } else {
                console.error('Failed to save winner');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    }
    else if(amount_of_participants === 128 && final_stage == 'True'){
        
            fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner_winner' })
    })
    }
     else if (amount_of_participants === 128 && final_stage == 'False'){
          const group = parseInt(document.getElementById('group').value);
        is_left_side = 0;
        slot_row_semi = 0;
        if (group === 1){
             slot_row_semi = 32.5;
             is_left_side = true;

        }
        else if(group === 2){
             slot_row_semi = 18;
             is_left_side = true;

        }

        else if (group ===3){
             slot_row_semi = 32.5;
             is_left_side = false;

        }
        else if (group === 4 ){
             slot_row_semi = 18;
             is_left_side = false;

        }
        else if (group === 5){
             slot_row_semi = 47.2;
             is_left_side = false;

        }
        else if(group === 6){
             slot_row_semi = 61.8;
             is_left_side = false;

        }

        else if (group ===7){
             slot_row_semi = 47.2;
             is_left_side = true;

        }
        else if (group === 8){
             slot_row_semi = 61.8;
             is_left_side = true;

        }
       fetch(`/object/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ current_stage: 'winner', slot_row_semi: slot_row_semi, is_left_side: is_left_side })
        })
        .then(response => {
            if (response.ok) {
                // Show reload window after successful save
                showReloadWindow();
            } else {
                console.error('Failed to save winner');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            });}

    else{

    
    fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner' })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save winner');
        console.log('Winner saved successfully');
    })
    .catch(error => console.error('Error saving winner:', error));
}
}

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}


function showReloadWindow() {
    // Create overlay
    const group = parseInt(document.getElementById('group').value);
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // Create modal window
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 80%;
    `;
    if (group == 4){
         modal.innerHTML = `
        <h2 style="color: #2c3e50; margin-bottom: 20px;">🎉 Winner Saved Successfully!</h2>
        <p style="margin-bottom: 25px; color: #555;">This stage is complete. Ready to continue to the final stage?</p>
        <button id="reload-page-btn" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        ">Continue to Final Stage</button>
    `;

    }
    else{
         modal.innerHTML = `
        <h2 style="color: #2c3e50; margin-bottom: 20px;">🎉 Winner Saved Successfully!</h2>
        <p style="margin-bottom: 25px; color: #555;">This stage is complete. Ready to continue to the next stage?</p>
        <button id="reload-page-btn" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        ">Continue to Next Stage</button>
    `;

    }
   
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add click handler for reload button
    document.getElementById('reload-page-btn').addEventListener('click', function() {
        window.location.reload();
    });
    
    // Optional: Close modal when clicking outside
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}