
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
    
    const clone = selectedParticipant.cloneNode(true);
    clone.classList.add('finalist-clone');
    
    // Position clone near the pick button
    const rect = finalPosition.getBoundingClientRect();
    clone.style.position = 'absolute';
    clone.style.top = `${rect.top + window.scrollY}px`;
    clone.style.left = `${rect.left + window.scrollX}px`;
    clone.style.zIndex = '20';
    
    document.body.appendChild(clone);
    
    // Mark as selected
    selectedFinalists.push(selectedParticipant.dataset.id);
    selectedParticipant.classList.add('finalist-original');
    
    // Hide the pick button if both are done
    finalPosition.style.display = 'none';
    const obj_id = selectedParticipant.dataset.id
    console.log(obj_id)
    save_finalists(obj_id)
    // Show final pick button if two finalists selected
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
    const champion = document.createElement('div');
    champion.classList.add('champion');
    
    // Create simple structure for name and image
    const content = document.createElement('div');
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.alignItems = 'center';
    content.style.gap = '8px'; // Space between name and image
    
    // Style the name element
    name.style.margin = '0';
    name.style.fontSize = '18px';
    name.style.fontWeight = 'bold';
    name.style.color = '#333'; // Default dark color
    
    // Style the image
    img.style.width = '180px';
    img.style.height = '180px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px'; // Optional slight rounding
    
    // Build the structure
    content.appendChild(name);
    content.appendChild(img);
    champion.appendChild(content);
    
    // Position the champion
    champion.style.position = 'absolute';
    champion.style.top = '50%';
    champion.style.left = '50%';
    champion.style.transform = 'translate(-50%, -50%)';
    champion.style.zIndex = '100';
    champion.style.width = "300px";
    
    document.body.appendChild(champion);
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
