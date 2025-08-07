let currentSelectionMode = null; // 'left-top', 'left-bot', 'right-top', 'right-bot', 'semi-left', 'semi-right', or 'final'
let selectedParticipant = null;
const selectedSemiFinalists = [];

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

function showSelectionModal(isLeftSide, verticalPosition) {
    const modal = document.getElementById('selection-modal');
    const optionsContainer = document.getElementById('participant-options');
    const confirmBtn = document.getElementById('confirm-selection');
    optionsContainer.innerHTML = '';
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Select a participant first';
    
    // Get all quarter-final participants
    const allParticipants = Array.from(document.querySelectorAll('.quater_final_slot_8'));
    
    // Filter to only show the two participants that should compete in this match
    const participants = allParticipants.filter(slot => {
        const leftPos = parseInt(slot.style.left);
        const topPos = parseInt(slot.style.top);
        
        // Determine if this is the correct side (left/right)
        const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
        
        // Determine if this is the correct vertical position (top/bottom)
        const isCorrectVertical = verticalPosition === 'top' ? topPos < 47 : topPos >= 47;
        
        return isCorrectSide && isCorrectVertical && !selectedSemiFinalists.includes(slot.dataset.id);
    });
    
    // Should only show 2 participants (one match)
    if (participants.length !== 2) {
        console.error(`Expected 2 participants for ${currentSelectionMode}, found ${participants.length}`);
    }
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
    
    // Calculate position based on which quarter-final we're processing
    const topPosition_top = '12.2%';
    const topPosition_bot = '85.6%';
    const leftPosition_right = '85.6%';
    const leftPosition_left = '12.2%';
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
    
    // Clone and modify the structure
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('semi-finalist-clone');
    clone.style.cssText = `
        position: absolute;
        top: ${topPosition};
        left: ${leftPosition};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 200px;
        height: 210px;
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
        participantBox.style.width = '110px';
        participantBox.style.height = '110px';
    }
    
    document.querySelector('.bracket-wrapper').appendChild(clone);
    
    selectedSemiFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('semi-finalist-original');
    pickButton.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id;
    save_semi_finalists(obj_id);
    
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
        top: 35.5%;
        left: ${currentSelectionMode === 'semi-left' ? '32.4%' : '61.7%'};
        transform: translate(-50%, -50%);
        z-index: 20;
        width: 200px;
        height: 210px;
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

    const originalBox = selectedParticipant.querySelector('.participant-box');
    const img = originalBox.querySelector('img').cloneNode(true);
    const name = selectedParticipant.querySelector('.obj_name').cloneNode(true);
    
    img.style.width = '150px';
    img.style.height = '150px';
    name.style.fontSize = '17px';
    
    const champion = document.createElement('div');
    champion.classList.add('champion');
    champion.appendChild(name);
    champion.appendChild(img);
    champion.style.cssText = `
        position: absolute;
        top: 69.5%;
        left: 47.7%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    `;

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

function save_semi_finalists(id) {
    fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'semi_final' })
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
    fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner' })
    });
}

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}