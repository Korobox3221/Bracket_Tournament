
let currentSelectionMode = null; // 'semi-left', 'semi-right', or 'final'
let selectedParticipant = null;
const selectedFinalists = [];
const final_stage = document.getElementById('final_stage').value
const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value);
// Initialize all event listeners once
function initializeEventListeners() {
    document.getElementById('left-pick').addEventListener('click', () => {
        currentSelectionMode = 'semi-left';
        showSelectionModal(true);
    });
    
    document.getElementById('right-pick').addEventListener('click', () => {
        currentSelectionMode = 'semi-right';
        showSelectionModal(false);
    });
    
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

function showSelectionModal(isLeftSide) {
    const modal = document.getElementById('selection-modal');
    const optionsContainer = document.getElementById('participant-options');
    const confirmBtn = document.getElementById('confirm-selection');
    optionsContainer.innerHTML = '';
    
    // Reset confirmation button
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Select a participant first';
    
    // Get eligible participants
    const participants = Array.from(document.querySelectorAll('.participant-slot'))
        .filter(slot => {
            const leftPos = parseInt(slot.style.left);
            const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
            return isCorrectSide && !selectedFinalists.includes(slot.dataset.id);
        });
    
    participants.forEach(participant => {
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
                <h4>${participant.querySelector('.obj_name').textContent}</h4>
                <button class="select-participant">Select This Participant</button>
            </div>
        </div>
        `;
        
        // Select button handler
        const selectBtn = option.querySelector('.select-participant');
        selectBtn.addEventListener('click', () => {
            // Clear previous selections
            document.querySelectorAll('.participant-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.select-participant').textContent = 'Select This Participant';
            });
            
            // Mark this selection
            option.classList.add('selected');
            selectBtn.textContent = '✓ Selected';
            selectedParticipant = participant;
            
            // Enable confirmation
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm Selection';
        });
        
        optionsContainer.appendChild(option);
    });
    
    modal.style.display = 'flex';
}

function showFinalSelectionModal() {
    const modal = document.getElementById('selection-modal');
    const optionsContainer = document.getElementById('participant-options');
    optionsContainer.innerHTML = '';
    
    const finalists = Array.from(document.querySelectorAll('.finalist-clone'));
    
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
                <h4>${participant.querySelector('.obj_name').textContent}</h4>
                <button class="select-participant">Select This Participant</button>
            </div>
        </div>
        `;
        
        // Select button handler
        const selectBtn = option.querySelector('.select-participant');
        selectBtn.addEventListener('click', () => {
            // Clear previous selections
            document.querySelectorAll('.participant-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.select-participant').textContent = 'Select This Participant';
            });
            
            // Mark this selection
            option.classList.add('selected');
            selectBtn.textContent = '✓ Selected';
            selectedParticipant = participant;
            
            // Enable confirmation
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
    } else {
        placeFinalist();
    }
    closeModal();
}

function placeFinalist() {
    const finalPosition = currentSelectionMode === 'semi-left' 
        ? document.getElementById('left-pick') 
        : document.getElementById('right-pick');
    const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value)
    console.log(amount_of_participants)   
    // Clone and modify the structure

    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('finalist-clone');
    
    // Remove any conflicting inline styles from the clone
    if (amount_of_participants === 4 || amount_of_participants === 32 && final_stage == 'True' ){
        clone.style.cssText = `
        position: absolute;
        top: 35.5%;
        left: ${currentSelectionMode === 'semi-left' ? '32.4%' : '61.7%'};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 200px;  /* Set your desired width */
        height: 210px;  /* Maintain aspect ratio */
    `;
    
    // Modify the inner image dimensions
    const img = clone.querySelector('img');
    if (img) {
        img.style.width = '155px';
        img.style.height = '155px';
     
    }
    
    // Modify the participant box if it exists
    const participantBox = clone.querySelector('.participant-box');
    if (participantBox) {
        participantBox.style.width = '210px';
        participantBox.style.height = '200px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    // Rest of your existing code...
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_finalists(obj_id);
    
    if (selectedFinalists.length === 2) {
        document.getElementById('final-pick').hidden = false;
    }

    }
    else if (amount_of_participants === 8 || amount_of_participants === 32 && final_stage == 'False' || amount_of_participants === 128 && final_stage == 'True'){
        clone.style.cssText = `
        position: absolute;
        top: 36.2%;
        left: ${currentSelectionMode === 'semi-left' ? '39.2%' : '60.0%'};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 140px;
        height: 140px;
    `;
    
    // Modify the inner image dimensions
    const img = clone.querySelector('img');
    if (img) {
        img.style.width = '110px';
        img.style.height = '110px';
    }
    
    // Modify the participant box if it exists
    const participantBox = clone.querySelector('.participant-box');
    if (participantBox) {
        participantBox.style.width = '145px';
        participantBox.style.height = '140px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    // Rest of your existing code...
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_finalists(obj_id);
    
    if (selectedFinalists.length === 2) {
        document.getElementById('final-pick').hidden = false;
    }
    }
    else if (amount_of_participants === 16 || amount_of_participants === 128 && final_stage == 'False'){
    clone.style.cssText = `
        position: absolute;
        top: 40%;
        left: ${currentSelectionMode === 'semi-left' ? '37.5%' : '62.2%'};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 115px;
        height: 115px;
    `;
    
    // Modify the inner image dimensions
    const img = clone.querySelector('img');
    if (img) {
        img.style.width = '95px';
        img.style.height = '95px';
    }
    
    const obj_name = clone.querySelector('obj_name');

    if (obj_name){
        obj_name.style.fontSize = '15px';
    }
    
    // Modify the participant box if it exists
    const participantBox = clone.querySelector('.participant-box');
    if (participantBox) {
        participantBox.style.width = '112px';
        participantBox.style.height = '115px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    // Rest of your existing code...
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_finalists(obj_id);
    
    if (selectedFinalists.length === 2) {
        document.getElementById('final-pick').hidden = false;
    }
    
    }
}

function placeChampion() {
    // Remove existing champion if any
    const existingChamp = document.querySelector('.champion');
    if (existingChamp) existingChamp.remove();

    // Get participant count and elements
    const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value);
    const originalBox = selectedParticipant.querySelector('.participant-box, .finalist-box');
    const img = originalBox ? originalBox.querySelector('img').cloneNode(true) : 
    selectedParticipant.querySelector('img').cloneNode(true);
    const name = selectedParticipant.querySelector('.obj_name').cloneNode(true);

    // Create champion container
    const champion = document.createElement('div');
    champion.classList.add('champion');

    // Style based on participant count
    if (amount_of_participants === 4 || amount_of_participants == 32 && final_stage == 'True') {
        // Styles for 4-participant bracket
        img.style.cssText = 'width: 150px; height: 150px;';
        name.style.cssText = 'font-size: 17px; margin: 10px 0;';
        
        champion.style.cssText = `
            position: absolute;
            top: 69.5%;
            left: 47.7%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        `;
    } 
    else if (amount_of_participants === 8 || amount_of_participants === 32 && final_stage == 'False' || amount_of_participants === 128 && final_stage == 'True') {
        // Styles for 8-participant bracket
        img.style.cssText = 'width: 120px; height: 120px;';
        name.style.cssText = 'font-size: 15px; margin: 8px 0;';
        
        champion.style.cssText = `
            position: absolute;
            top: 65%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        `;
    }

        else if (amount_of_participants === 16 || amount_of_participants === 128 && final_stage == 'False') {
        // Styles for 8-participant bracket
        img.style.cssText = 'width: 135px; height: 135px;';
        name.style.cssText = 'font-size: 17px;';
        champion.style.cssText = `
            position: absolute;
            top: 67.6%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px`;
 
    }

    // Build champion structure
    champion.appendChild(name);
    champion.appendChild(img);
    document.querySelector('.bracket-wrapper').appendChild(champion);

    // Hide final pick button and save winner
    document.getElementById('final-pick').hidden = true;
    save_winner(selectedParticipant.dataset.id);

    console.log('Champion selected:', name.textContent);
}

function closeModal() {
    document.getElementById('selection-modal').style.display = 'none';
    selectedParticipant = null;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializeEventListeners);


        
        
function save_finalists(id){
    if (amount_of_participants === 32 && final_stage == 'True' || amount_of_participants === 128 && final_stage == 'True'){
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner_final' })
    })
    }

    else{

    
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'final' })
    })
}
}

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

function save_winner(id){
        if (amount_of_participants === 32 && final_stage == 'True' || amount_of_participants === 128 && final_stage == 'True'){
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner_winner' })
    })
    }
    else if (amount_of_participants === 32 && final_stage == 'False'){
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
    })}
    
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