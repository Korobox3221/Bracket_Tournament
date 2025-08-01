
let currentSelectionMode = null; // 'semi-left', 'semi-right', or 'final'
let selectedParticipant = null;
const selectedFinalists = [];

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
    optionsContainer.innerHTML = '';
    
    const participants = Array.from(document.querySelectorAll('.participant-slot'))
        .filter(slot => {
            const leftPos = parseInt(slot.style.left);
            const isCorrectSide = isLeftSide ? leftPos < 50 : leftPos >= 50;
            return isCorrectSide && !selectedFinalists.includes(slot.dataset.id);
        });
    
    participants.forEach(participant => {
        const option = document.createElement('div');
        option.className = 'participant-option';
        option.innerHTML = `
            <img src="${participant.querySelector('img').src}">
            <span>${participant.querySelector('.obj_name').textContent}</span>
        `;
        option.addEventListener('click', () => {
            document.querySelectorAll('.participant-option').forEach(opt => {
                opt.style.background = 'white';
            });
            option.style.background = '#e8f5e9';
            selectedParticipant = participant;
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
        option.innerHTML = `
            <img src="${participant.querySelector('img').src}">
            <span>${participant.querySelector('.obj_name').textContent}</span>
        `;
        option.addEventListener('click', () => {
            document.querySelectorAll('.participant-option').forEach(opt => {
                opt.style.background = 'white';
            });
            option.style.background = '#e8f5e9';
            selectedParticipant = participant;
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

function placeChampion() {
    // Remove existing champion if any
    const existingChamp = document.querySelector('.champion');
    if (existingChamp) existingChamp.remove();

    const originalBox = selectedParticipant.querySelector('.participant-box');
    const img = originalBox.querySelector('img').cloneNode(true);
    const name = selectedParticipant.querySelector('.obj_name').cloneNode(true);
    // Create new minimal champion container
    
    img.style.width = '150px';
    img.style.height = '150px';
    name.style.fontSize = '17px'
    const champion = document.createElement('div');
    champion.classList.add('champion');
    
    // Create simple structure for name and image
    const content = document.createElement('div');
    // Space between name and image

    
    // Build the structure
    champion.appendChild(name);
    champion.appendChild(img);
    champion.style.top = '69.5%';
    champion.style.left = '47.7%';
    champion.style.position = 'fixed';
    champion.style.position = 'absolute';
    champion.style.transform = 'translate(-50%, -50%)';
    champion.style.zIndex = '1000';


    document.querySelector('.bracket-wrapper').appendChild(champion);
    document.getElementById('final-pick').hidden = true;
    const obj_id = selectedParticipant.dataset.id
    save_winner(obj_id)
}

function closeModal() {
    document.getElementById('selection-modal').style.display = 'none';
    selectedParticipant = null;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializeEventListeners);


        
        
function save_finalists(id){
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'final' })
    })
}

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

function save_winner(id){
        fetch(`/object/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ current_stage: 'winner' })
    })
}

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
