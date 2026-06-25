const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const uploadContent = document.querySelector('.upload-content');
const analyzeBtn = document.getElementById('analyzeBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultsPanel = document.getElementById('results');
const errorBox = document.getElementById('errorBox');
const errorMsg = document.getElementById('errorMsg');
const elFoodName = document.getElementById('foodName');
const elCal = document.getElementById('calValue');
const elPro = document.getElementById('proValue');
const elCarb = document.getElementById('carbValue');
const elFat = document.getElementById('fatValue');
const elMicro = document.getElementById('microValue');

let currentFile = null;
uploadArea.addEventListener('click', () => imageInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

imageInput.addEventListener('change', function() {
    if (this.files.length) {
        handleFile(this.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showError('Por favor selecciona un archivo de imagen válido.');
        return;
    }

    currentFile = file;
    hideError();
    resultsPanel.classList.add('hidden');
    analyzeBtn.disabled = false;

    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
        uploadContent.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}
analyzeBtn.addEventListener('click', async () => {
    if (!currentFile) return;
    analyzeBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    resultsPanel.classList.add('hidden');
    hideError();

    const formData = new FormData();
    formData.append('image', currentFile);

    try {
        const response = await fetch('/analyze-food', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || 'Error en el servidor');
        }

        const data = await response.json();
        renderResults(data);

    } catch (error) {
        showError(error.message);
    } finally {
        analyzeBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
});

function renderResults(data) {
    elFoodName.textContent = data.food_identified || 'Plato Analizado';
    elMicro.textContent = data.micronutrients || 'Información de micronutrientes no disponible.';
    animateValue(elCal, 0, data.calories || 0, 1000);
    animateValue(elPro, 0, data.protein_g || 0, 1000);
    animateValue(elCarb, 0, data.carbs_g || 0, 1000);
    animateValue(elFat, 0, data.fats_g || 0, 1000);

    resultsPanel.classList.remove('hidden');
}
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = (progress === 1) ? end : Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.classList.remove('hidden');
}

function hideError() {
    errorBox.classList.add('hidden');
}
