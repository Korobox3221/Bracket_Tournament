let currentSelectionMode = null;
let selectedParticipant = null;
const selectedFinalists = [];

function initializeEventListeners() {
    const finalPickButton = document.getElementById('final-pick');
    if (finalPickButton) {
        finalPickButton.addEventListener('click', () => {
            currentSelectionMode = 'final';
            showFinalSelectionModal();
        });
    }
    
    const confirmButton = document.getElementById('confirm-selection');
    if (confirmButton) {
        confirmButton.addEventListener('click', handleSelectionConfirmation);
    }
    
    const modal = document.getElementById('selection-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeModal();
            }
        });
    }
}

function showFinalSelectionModal() {
    const modal = document.getElementById('selection-modal');
    const optionsContainer = document.getElementById('participant-options');
    
    if (!modal || !optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    // Select both original finalists and any cloned ones
    const finalists = Array.from(document.querySelectorAll('.finalist-slot, .finalist-clone'));
    
    if (finalists.length === 0) {
        console.warn('No finalists found for selection');
        return;
    }
    
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
                <h4>${participant.querySelector('.finalist-name').textContent}</h4>
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
    if (!selectedParticipant) {
        console.warn('No participant selected');
        return;
    }

    if (currentSelectionMode === 'final') {
        placeChampion();
    }
    closeModal();
}

function placeChampion() {
    // Clean up any existing champion
    const existingChampion = document.querySelector('.champion');
    if (existingChampion) {
        existingChampion.remove();
    }

    // Get the finalist's data
    const img = selectedParticipant.querySelector('img');
    const name = selectedParticipant.querySelector('.obj_name, .finalist-name');
    name.style.fontSize = '15px'
    
    if (!img || !name) {
        console.error('Selected finalist is missing required elements');
        return;
    }

    // Create champion container
    const champion = document.createElement('div');
    champion.className = 'champion';
    
    // Create content structure

    // Clone and style the name
    const nameClone = name.cloneNode(true);
    nameClone.className = 'champion-name';
    
    // Clone and style the image
    const imgClone = img.cloneNode(true);
    imgClone.className = 'champion-image';
    
    // Build the structure
    champion.appendChild(nameClone);
    champion.appendChild(imgClone);
    
    // Position the champion
    champion.style.top = '69.5%';
    champion.style.left = '47.7%';
    champion.style.position = 'fixed';
    champion.style.position = 'absolute';
    champion.style.transform = 'translate(-50%, -50%)';
    champion.style.zIndex = '1000';
 // Higher than everything else
    
    document.querySelector('.bracket-wrapper').appendChild(champion);


    
    // Hide the final pick button
    const finalPickButton = document.getElementById('final-pick');
    if (finalPickButton) {
        finalPickButton.hidden = true;
    }
    
    console.log('Champion selected:', name.textContent);
    const obj_id = selectedParticipant.dataset.id
    console.log(obj_id)
    save_winner(obj_id)
}

function closeModal() {
    const modal = document.getElementById('selection-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    selectedParticipant = null;
}

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    initializeEventListeners();
} else {
    document.addEventListener('DOMContentLoaded', initializeEventListeners);
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
