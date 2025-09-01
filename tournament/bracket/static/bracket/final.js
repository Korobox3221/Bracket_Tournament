let currentSelectionMode = null;
let selectedParticipant = null;
const selectedFinalists = [];
let selectedChampion = null;

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
    if (amount_of_participants === 4) {
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
    } else if (amount_of_participants === 8) {
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
    }else if (amount_of_participants === 16) {
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

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}