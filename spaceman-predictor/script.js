document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const predictBtn = document.getElementById('predictBtn');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const historyContainer = document.querySelector('.history-container');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const lastInput = document.getElementById('lastInput');

    let history = [];

    predictBtn.addEventListener('click', () => {
        const mode = modeSelect.value;
        const lastVal = parseFloat(lastInput.value);

        if (isNaN(lastVal) || lastVal < 1) {
            alert('Masukkan prediksi sebelumnya yang valid (>= 1)');
            return;
        }

        fetchPrediction(mode, lastVal);
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        updateHistoryUI();
    });

    function fetchPrediction(mode, lastVal) {
        loadingDiv.style.display = 'block';
        resultDiv.innerHTML = '';
        fetch(`/predict/${mode}?last=${lastVal}`)
            .then((response) => response.json())
            .then((data) => {
                loadingDiv.style.display = 'none';
                const prediction = data.prediction;
                resultDiv.innerHTML = `Predicted Multiplier: <strong>${prediction}x</strong>`;
                addToHistory(prediction);
            })
            .catch((err) => {
                loadingDiv.style.display = 'none';
                resultDiv.innerHTML = `<span style="color:#ff6b6b;">Error: Unable to get prediction from server.</span>`;
                console.error(err);
            });
    }

    function addToHistory(prediction) {
        history.push(prediction);
        updateHistoryUI();
    }

    function updateHistoryUI() {
        if (history.length > 0) {
            historyContainer.style.display = 'block';
            historyList.innerHTML = '';
            history
                .slice()
                .reverse()
                .forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = `Predicted: ${item}x`;
                    historyList.appendChild(li);
                });
        } else {
            historyContainer.style.display = 'none';
        }
    }
});