document.addEventListener('DOMContentLoaded', () => {
    const zipFileInput = document.getElementById('zipFileInput');
    const convertButton = document.getElementById('convertButton');
    const base64Result = document.getElementById('base64Result');
    const copyButton = document.getElementById('copyButton');
    const copyMessage = document.getElementById('copyMessage');
    const base64ToDecode = document.getElementById('base64ToDecode');
    const decodeButton = document.getElementById('decodeButton');
    const downloadLink = document.getElementById('downloadLink');
    const decodeMessage = document.getElementById('decodeMessage');

    convertButton.addEventListener('click', () => {
        const file = zipFileInput.files[0];

        if (!file) {
            showAlert("warning", "Please select a ZIP file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = btoa(reader.result);

            base64Result.value = base64Data;
            copyButton.disabled = false;
        };

        reader.readAsBinaryString(file);
    });

    copyButton.addEventListener('click', () => {
        base64Result.select();
        document.execCommand('copy');

        showAlert("success", "Base64 content copied to clipboard.");

        // Remove the alert message after a short delay (e.g., 3 seconds)
        setTimeout(() => {
            clearAlert();
        }, 3000);
    });

    decodeButton.addEventListener('click', () => {
        const base64Data = base64ToDecode.value.trim();

        if (!base64Data) {
            // Display the message in the decodeMessage div
            displayDecodeMessage("Please enter Base64 data.");
            return;
        }

        // Clear any previous decode messages
        clearDecodeMessage();

        try {
            const binaryData = atob(base64Data);
            const byteArray = new Uint8Array(binaryData.length);
    
            for (let i = 0; i < binaryData.length; i++) {
                byteArray[i] = binaryData.charCodeAt(i);
            }
    
            const blob = new Blob([byteArray], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);
    
            downloadLink.href = url;
            downloadLink.download = 'decoded.zip';
            downloadLink.style.display = 'block';
        } catch (error) {
            // Handle invalid Base64 input
            displayDecodeMessage("Invalid Base64 data. Please check your input.");
        }
    });

    // Function to display an alert message
    function showAlert(type, message) {
        clearAlert();
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mt-2`;
        alertDiv.textContent = message;
        copyMessage.appendChild(alertDiv);
    }

    // Function to clear the alert message
    function clearAlert() {
        while (copyMessage.firstChild) {
            copyMessage.removeChild(copyMessage.firstChild);
        }
    }

    // Function to display a decode message
    function displayDecodeMessage(message) {
        decodeMessage.innerHTML = `<div class="alert alert-warning">${message}</div>`;
    }

    // Function to clear the decode message
    function clearDecodeMessage() {
        decodeMessage.innerHTML = '';
    }
});
