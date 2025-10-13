let currentSelectionMode = null; // 'left-top', 'left-bot', 'right-top', 'right-bot', 'semi-left', 'semi-right', or 'final'
let selectedParticipant = null;
const selectedSemiFinalists = [];
const selectedFinalists = [];
const quater_vars = ["left-top", "left-bot", "right-top", "right-bot"]
const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value);
const final_stage = document.getElementById('final_stage').value

// Initialize all event listeners once
function initializeEventListeners() {
    // Quarter-final buttons
    document.getElementById('left-pick-top').addEventListener('click', () => {
        currentSelectionMode = 'left-top';
        showSelectionModal(true, 'top');
    });
    
    document.getElementById('left-pick-bot').addEventListener('click', () => {
        currentSelectionMode = 'left-bot';
        showSelectionModal(true, 'bot');
    });
    
    document.getElementById('right-pick-top').addEventListener('click', () => {
        currentSelectionMode = 'right-top';
        showSelectionModal(false, 'top');
    });
    
    document.getElementById('right-pick-bot').addEventListener('click', () => {
        currentSelectionMode = 'right-bot';
        showSelectionModal(false, 'bot');
    });
    
    // Semi-final buttons (hidden initially)
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

function showSelectionModal(isLeftSide, verticalPosition = null) {
    const modal = document.getElementById('selection-modal');
    const optionsContainer = document.getElementById('participant-options');
    const confirmBtn = document.getElementById('confirm-selection');
    optionsContainer.innerHTML = '';
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Select a participant first';

    let participants = [];
    const bracketRect = document.querySelector('.bracket-wrapper').getBoundingClientRect();

        for (let i = 0; i < quater_vars.length; i++) {
        if (quater_vars[i]  == currentSelectionMode) { // Check if the number is even
         // Add even numbers to a new array


        // Quarter-final logic
        participants = Array.from(document.querySelectorAll('.quater_final_slot_8')).filter(slot => {
            const rect = slot.getBoundingClientRect();
            const leftPos = ((rect.left + rect.width/2 - bracketRect.left) / bracketRect.width) * 100;
            const topPos = ((rect.top + rect.height/2 - bracketRect.top) / bracketRect.height) * 100;
            
            const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
            const isCorrectVertical = verticalPosition === 'top' ? topPos < 47 : topPos >= 47;
            
            return isCorrectSide && isCorrectVertical && !selectedSemiFinalists.includes(slot.dataset.id);
        });
    };
    };
    if (currentSelectionMode == 'semi-left' || currentSelectionMode == 'semi-right') {
        // Semi-final logic
        participants = Array.from(document.querySelectorAll('.semi-finalist-clone')).filter(slot => {
      
            const leftPos = parseInt(slot.style.left);
            const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
            return isCorrectSide && !selectedFinalists.includes(slot.dataset.id);

        });
    }

    // Debug logging
    console.log(`Participants for ${currentSelectionMode}:`, participants);
    
    if (participants.length !== 2) {
        console.error(`Expected 2 participants for ${currentSelectionMode}, found ${participants.length}`);
        optionsContainer.innerHTML = `
            <div class="error-message">
                <p>Match setup error. Expected 2 participants but found ${participants.length}.</p>
                <p>Please check the bracket configuration.</p>
            </div>
        `;
        return;
    }

    // Display participants
    participants.forEach(participant => {
        const option = document.createElement('div');
        option.className = 'participant-option';
        const youtubeId = participant.dataset.youtubeId || '1T22wNvoNiU';
        
        option.innerHTML = `
        <div class="video-option">
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${youtubeId}?enablejsapi=1" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="participant-info">
                <img src="${participant.querySelector('img').src}" alt="${participant.querySelector('.obj_name').textContent}">
                <h4>${participant.querySelector('.obj_name').textContent}</h4>
                <button class="select-participant">Select This Participant</button>
            </div>
        </div>`;
        
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
    } else if (['semi-left', 'semi-right'].includes(currentSelectionMode)) {
        placeFinalist();
    } else {
        placeSemiFinalist();
    }
    closeModal();
}

function placeSemiFinalist() {
    const buttonId = `${currentSelectionMode.split('-')[0]}-pick-${currentSelectionMode.split('-')[1]}`;
    const pickButton = document.getElementById(buttonId);
    const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value)
    
    // Calculate position based on which quarter-final we're processing
    if (amount_of_participants === 8 || amount_of_participants === 32|| amount_of_participants === 128 && final_stage == 'True'){
    const topPosition_top = '29%';
    const topPosition_bot = '48.8%';
    const leftPosition_right = '77.2%';
    const leftPosition_left = '22.9%';
    switch(currentSelectionMode) {
        case 'left-top':
            topPosition = topPosition_top;
            leftPosition = leftPosition_left;
            break;
        case 'left-bot':
            topPosition = topPosition_bot;
            leftPosition = leftPosition_left;
            break;
        case 'right-top':
            topPosition = topPosition_top;
            leftPosition = leftPosition_right;
            break;
        case 'right-bot':
            topPosition = topPosition_bot;
            leftPosition = leftPosition_right;
            break;
    }
    let slotRowSemi = 0;
    let isLeftSide = false;
    if (currentSelectionMode == 'left-top'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 29;
    }
    else  if (currentSelectionMode == 'left-bot'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 48.8;
    }
    else  if (currentSelectionMode == 'right-top'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 29;
    }
    else  if (currentSelectionMode == 'right-bot'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 48.8;
    }
    
    // Clone and modify the structure
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('semi-finalist-clone');
    clone.style.cssText = `
        position: absolute;
        top: ${topPosition};
        left: ${leftPosition};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 112px;
        height: 115px;
    `;
    
    // Modify the inner image dimensions
    const img = clone.querySelector('img');
    if (img) {
        img.style.width = '85px';
        img.style.height = '85px';
    }
    
    // Modify the participant box if it exists
    const participantBox = clone.querySelector('.quater_final_box_8');
    if (participantBox) {
        participantBox.style.width = '112px';
        participantBox.style.height = '115px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedSemiFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('semi-finalist-original');
    pickButton.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_semi_finalists(obj_id, slotRowSemi);}


    else if(amount_of_participants === 16 || amount_of_participants === 128 && final_stage == 'False'){
    const topPosition_top = '21%';
    const topPosition_bot = '68%';
    const leftPosition_right = '74%';
    const leftPosition_left = '25.7%';
    switch(currentSelectionMode) {
        case 'left-top':
            topPosition = topPosition_top;
            leftPosition = leftPosition_left;
            break;
        case 'left-bot':
            topPosition = topPosition_bot;
            leftPosition = leftPosition_left;
            break;
        case 'right-top':
            topPosition = topPosition_top;
            leftPosition = leftPosition_right;
            break;
        case 'right-bot':
            topPosition = topPosition_bot;
            leftPosition = leftPosition_right;
            break;
    }
    let slotRowSemi = 0;
    let isLeftSide = false;
    if (currentSelectionMode == 'left-top'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 21;
    }
    else  if (currentSelectionMode == 'left-bot'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 68;
    }
    else  if (currentSelectionMode == 'right-top'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 21;
    }
    else  if (currentSelectionMode == 'right-bot'){
        //top_left_semi = (26.4, True)
        //top_right_semi = (26.4,  False)
       //bot_right_semi = (54.0, False)
        //bot_left_semi= (54.0, True)
        slotRowSemi = 68;
    }
    
    // Clone and modify the structure
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('semi-finalist-clone');
    clone.style.cssText = `
        position: absolute;
        top: ${topPosition};
        left: ${leftPosition};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 95px;
        height: 95px;
    `;
    
    // Modify the inner image dimensions
    const img = clone.querySelector('img');
    if (img) {
        img.style.width = '78px';
        img.style.height = '78px';
    }
    
    // Modify the participant box if it exists
    const participantBox = clone.querySelector('.quater_final_box_8');
    if (participantBox) {
        participantBox.style.width = '92px';
        participantBox.style.height = '92px';
    }
    const obj_name = clone.querySelector('.obj_name')

    if (obj_name){
        obj_name.style.fontSize = '13px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedSemiFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('semi-finalist-original');
    pickButton.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_semi_finalists(obj_id, slotRowSemi);        



    }
    // Check if all quarter-finals are done to show semi-final buttons
    if (selectedSemiFinalists.length === 4) {
        document.getElementById('left-pick').hidden = false;
        document.getElementById('right-pick').hidden = false;
    }
}

function placeFinalist() {
    const finalPosition = currentSelectionMode === 'semi-left' 
        ? document.getElementById('left-pick') 
        : document.getElementById('right-pick');
    const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value)
    // Clone and modify the structure
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('finalist-clone');
    
    // Remove any conflicting inline styles from the clone
    if (amount_of_participants === 8 || amount_of_participants === 32 || amount_of_participants === 128 && final_stage == 'True'){
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
    const participantBox = clone.querySelector('.quater_final_box_8');
    if (participantBox) {
        participantBox.style.width = '145px';
        participantBox.style.height = '140px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_finalists(obj_id);}

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
    const participantBox = clone.querySelector('.quater_final_box_8');
    if (participantBox) {
        participantBox.style.width = '112px';
        participantBox.style.height = '115px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_finalists(obj_id);}

    if (selectedFinalists.length === 2) {
        document.getElementById('final-pick').hidden = false;
    }
}

function placeChampion() {
    // Remove existing champion if any
    const existingChamp = document.querySelector('.champion');
    if (existingChamp) existingChamp.remove();

    const originalBox = selectedParticipant.querySelector('.quater_final_box_8-box');
    const img = selectedParticipant.querySelector('img').cloneNode(true);
    const name = selectedParticipant.querySelector('.obj_name').cloneNode(true);
    const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value)
    if (amount_of_participants === 8 || amount_of_participants === 32 || amount_of_participants === 128 && final_stage == 'True'){
    img.style.width = '150px';
    img.style.height = '150px';
    name.style.fontSize = '17px';
    
    const champion = document.createElement('div');
    champion.classList.add('champion');
    champion.appendChild(name);
    champion.appendChild(img);
    champion.style.cssText = `
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);`;

    document.querySelector('.bracket-wrapper').appendChild(champion);
    document.getElementById('final-pick').hidden = true;
    const obj_id = selectedParticipant.dataset.id;
    save_winner(obj_id);}
    else if (amount_of_participants === 16 || amount_of_participants === 128 && final_stage == 'False'){

    img.style.width = '135px';
    img.style.height = '135px';
    name.style.fontSize = '17px';
    
    const champion = document.createElement('div');
    champion.classList.add('champion');
    champion.appendChild(name);
    champion.appendChild(img);
    champion.style.cssText = `
        position: absolute;
        top: 67.6%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px`;

    document.querySelector('.bracket-wrapper').appendChild(champion);
    document.getElementById('final-pick').hidden = true;
    const obj_id = selectedParticipant.dataset.id;
    save_winner(obj_id);
    }
}

function closeModal() {
    document.getElementById('selection-modal').style.display = 'none';
    selectedParticipant = null;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializeEventListeners);

function save_semi_finalists(id, slotRowSemi) {
    if (amount_of_participants === 128 && final_stage == 'True'){
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'semi_winner', semi_coords: slotRowSemi
         })
    });


    }
    else{

        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'semi_final',
            semi_coords: slotRowSemi,
         })
    });
    }

}

function save_finalists(id) {
    if (amount_of_participants === 128 && final_stage == 'True'){
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner_final' })
    });
    }
    else{

        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'final' })
    });
        
    }

}

function save_winner(id){  
    if (amount_of_participants === 32 && final_stage == 'False'){
        
        const group = parseInt(document.getElementById('group').value);
        let slot_row_semi = 0
        let is_left_side = 0
        console.log(group)
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
    else if (amount_of_participants === 128 && final_stage == 'True'){
        fetch(`/object/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ current_stage: 'winner_winner'})
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
            body: JSON.stringify({ current_stage: 'winner'})
               });
    }
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


function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
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