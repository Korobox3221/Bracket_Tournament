let currentSelectionMode = null; // 'left-top', 'left-bot', 'right-top', 'right-bot', 'semi-left', 'semi-right', or 'final'
let selectedParticipant = null;
const selectedSemiFinalists = [];
const selectedQuaterFinalists = [];
const selectedFinalists = [];
const amount_of_participants = parseInt(document.getElementById('amount_of_participants').value);
const final_stage = document.getElementById('final_stage').value
const quater_vars = ["left-top", "left-bot", "right-top", "right-bot"]
const one_eight_vars = ["first","second", 'third', 'fourth']
// Initialize all event listeners once
function initializeEventListeners() {
    // Quarter-final buttons
    document.getElementById('first-left').addEventListener('click', () =>{
        currentSelectionMode = 'first-left'
        showSelectionModal(true, 'first')

    } )
        document.getElementById('second-left').addEventListener('click', () =>{
        currentSelectionMode = 'second-left'
        showSelectionModal(true, 'second')

    } )
        document.getElementById('third-left').addEventListener('click', () =>{
        currentSelectionMode = 'third-left'
        showSelectionModal(true, 'third')

    } )
        document.getElementById('fourth-left').addEventListener('click', () =>{
        currentSelectionMode = 'fourth-left'
        showSelectionModal(true, 'fourth')

    } )
        document.getElementById('first-right').addEventListener('click', () =>{
        currentSelectionMode = 'first-right'
        showSelectionModal(false, 'first')

    } )
        document.getElementById('second-right').addEventListener('click', () =>{
        currentSelectionMode = 'second-right'
        showSelectionModal(false, 'second')

    } )
            document.getElementById('third-right').addEventListener('click', () =>{
        currentSelectionMode = 'third-right'
        showSelectionModal(false, 'third')

    } )
            document.getElementById('fourth-right').addEventListener('click', () =>{
        currentSelectionMode = 'fourth-right'
        showSelectionModal(false, 'fourth')

    } )



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
    console.log(verticalPosition)
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Select a participant first';

    let participants = [];
    const bracketRect = document.querySelector('.bracket-wrapper').getBoundingClientRect();

        for (let i = 0; i < one_eight_vars.length; i++) {
        if (one_eight_vars[i]  == verticalPosition) { // Check if the number is even
         // Add even numbers to a new array
        // Quarter-final logic
        participants = Array.from(document.querySelectorAll('.one_eight_slot')).filter(slot => {
            const rect = slot.getBoundingClientRect();
            const leftPos = ((rect.left + rect.width/2 - bracketRect.left) / bracketRect.width) * 100;
            const topPos = ((rect.top + rect.height/2 - bracketRect.top) / bracketRect.height) * 100;
            
            
            const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
            if (verticalPosition === 'first'){
                const isCorrectVertical = verticalPosition === 'first' ? topPos < 18 : topPos >= 18;
                console.log(isCorrectVertical)
                return isCorrectSide && isCorrectVertical && !selectedQuaterFinalists.includes(slot.dataset.id);
                
            }
            else if (verticalPosition === 'second'){
                const isCorrectVertical = verticalPosition === 'second' ? 18 < topPos && topPos < 42 : 40 < topPos && topPos> 18;
                return isCorrectSide && isCorrectVertical && !selectedQuaterFinalists.includes(slot.dataset.id);
                
            }
            else if (verticalPosition === 'third'){
                const isCorrectVertical = verticalPosition === 'third' ? 42 < topPos && topPos < 66 : 64 < topPos && topPos> 42;
                return isCorrectSide && isCorrectVertical && !selectedQuaterFinalists.includes(slot.dataset.id);
                
            }
            else if (verticalPosition === 'fourth'){
                const isCorrectVertical = verticalPosition === 'fourth' ? 66 < topPos && topPos < 90 : 88 < topPos && topPos> 66;
                return isCorrectSide && isCorrectVertical && !selectedQuaterFinalists.includes(slot.dataset.id);
                
            }
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
    else{
        
        for (let i = 0; i < quater_vars.length; i++) {
        if (quater_vars[i]  == currentSelectionMode) { // Check if the number is even
         // Add even numbers to a new array


        // Quarter-final logic
        participants = Array.from(document.querySelectorAll('.quater-finalist-clone')).filter(slot => {
            const rect = slot.getBoundingClientRect();
            const leftPos = ((rect.left + rect.width/2 - bracketRect.left) / bracketRect.width) * 100;
            const topPos = ((rect.top + rect.height/2 - bracketRect.top) / bracketRect.height) * 100;
            
            const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
            const isCorrectVertical = verticalPosition === 'top' ? topPos < 47 : topPos >= 47;
            
            return isCorrectSide && isCorrectVertical && !selectedSemiFinalists.includes(slot.dataset.id);
        });
    };
    };

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
    }  
    else if (quater_vars.includes(currentSelectionMode)){
        placeSemiFinalist();
    }
    else {
        placeOneEight()
    }
    closeModal();
}

function placeOneEight(){
    const buttonId = `${currentSelectionMode.split('-')[0]}-${currentSelectionMode.split('-')[1]}`;
    const pickButton = document.getElementById(buttonId);
    console.log(pickButton)
    const first = '10.4%'
    const second = '34.4%'
    const third = '58.4%'
    const fourth = '82.4%'
    const left = '10.6%'
    const right = '89.4%'
    
    const coordinates = [10.4, 34.4, 58.4, 82.4]

    switch(currentSelectionMode) {
        case 'first-left':
            coords = coordinates[0];
            topPosition = first;
            leftPosition = left;
            break;
        case 'second-left':
            coords = coordinates[1]
            topPosition = second;
            leftPosition = left;
            break;
        case 'third-left':
            coords = coordinates[2];
            topPosition = third;
            leftPosition = left;
            break;
        case 'fourth-left':
            coords = coordinates[3];
            topPosition = fourth;
            leftPosition = left;
            break;

        case 'first-right':
            coords = coordinates[0];
            topPosition = first;
            leftPosition = right;
            break;
        case 'second-right':
            coords = coordinates[1];
            topPosition = second;
            leftPosition = right;
            break;
        case 'third-right':
            coords = coordinates[2];
            topPosition = third;
            leftPosition = right;
            break;
        case 'fourth-right':
            coords = coordinates[3];
            topPosition = fourth;
            leftPosition = right;
            break;
    }
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('quater-finalist-clone');
    clone.style.cssText = `
        position: absolute;
        top: ${topPosition};
        left: ${leftPosition};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 80px;
        height: 80px;
    `;
    
    // Modify the inner image dimensions
    const img = clone.querySelector('img');
    if (img) {
        img.style.width = '65px';
        img.style.height = '65px';
    }
    
    // Modify the participant box if it exists
    const participantBox = clone.querySelector('.one_eight_box');
    if (participantBox) {
        participantBox.style.width = '75px';
        participantBox.style.height = '75px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedQuaterFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('quater-finalist-original');
    pickButton.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    slotRowSemi = coords
    save_quater_finalists(obj_id, slotRowSemi);
        if (selectedQuaterFinalists.length === 8) {
        document.getElementById('left-pick-top').hidden = false;
        document.getElementById('right-pick-top').hidden = false;
        document.getElementById('left-pick-bot').hidden = false;
        document.getElementById('right-pick-bot').hidden = false;
    }

}

function placeSemiFinalist() {
    const buttonId = `${currentSelectionMode.split('-')[0]}-pick-${currentSelectionMode.split('-')[1]}`;
    const pickButton = document.getElementById(buttonId);
    
    // Calculate position based on which quarter-final we're processing
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
    const participantBox = clone.querySelector('.one_eight_box');
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
    
    // Clone and modify the structure
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('finalist-clone');
    
    // Remove any conflicting inline styles from the clone
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
    const participantBox = clone.querySelector('.one_eight_box');
    if (participantBox) {
        participantBox.style.width = '112px';
        participantBox.style.height = '115px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_finalists(obj_id);
    
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

function closeModal() {
    document.getElementById('selection-modal').style.display = 'none';
    selectedParticipant = null;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializeEventListeners);

function save_semi_finalists(id, slotRowSemi) {
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

function save_finalists(id) {
    fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'final' })
    });
}

function save_winner(id) {
    if (amount_of_participants == 128){
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
        })

        }
    }




function save_quater_finalists(id, slotRowSemi) {
    fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'quater_final',
            quater_coords: slotRowSemi,
         })
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