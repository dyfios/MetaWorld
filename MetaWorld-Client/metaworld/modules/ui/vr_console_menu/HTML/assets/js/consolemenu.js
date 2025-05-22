document.addEventListener("DOMContentLoaded", () => {
    const modeButton = document.getElementById("modeButton");
    const speedLabel = document.getElementById("speedLabel");
    const speedDown = document.getElementById("speedDown");
    const speedUp = document.getElementById("speedUp");

    const consoleHistory = document.getElementById("consoleHistory");
    const consoleInput = document.getElementById("consoleInput");
    const consoleSubmit = document.getElementById("consoleSubmit");
    const keyboard = document.getElementById("keyboard");

    let speed = 1;
    let minSpeed = 0.125;
    let maxSpeed = 32;

    let isShiftActive = false;
    let isCapsActive = false;

    const keyboardLayout = [
        ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "<--"],
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
        ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
        ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
        ["Space"]
    ];    

    const shiftMap = {
        "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
        "6": "^", "7": "&", "8": "*", "9": "(", "0": ")",
        "-": "_", "=": "+", "[": "{", "]": "}", "\\": "|",
        ";": ":", "'": "\"", ",": "<", ".": ">", "/": "?"
    };

    // Toggle Mode Button
    modeButton.addEventListener("click", () => {
        modeButton.textContent = modeButton.textContent === "Free Fly" ? "Ground" : "Free Fly";
        postWorldMessage("CONSOLE.TOGGLE_MODE(" + modeButton.textContent + ");");
    });

    // Adjust Speed
    speedDown.addEventListener("click", () => {
        speed = Math.max(minSpeed, speed / 2);
        speedLabel.textContent = speed;
        postWorldMessage("CONSOLE.SET_SPEED(" + speed + ");");
    });

    speedUp.addEventListener("click", () => {
        speed = Math.min(maxSpeed, speed * 2);
        speedLabel.textContent = speed;
        postWorldMessage("CONSOLE.SET_SPEED(" + speed + ");");
    });

    // Submit Console Command
    consoleSubmit.addEventListener("click", submitCommand);

    consoleInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && document.activeElement === consoleInput) {
            submitCommand();
        }
    });

    function submitCommand() {
        const userInput = consoleInput.value.trim();
        if (userInput) {
            postWorldMessage("CONSOLE.SEND_MESSAGE(" + userInput + ")");
        }
    }

    function AddMessageToConsole(timestamp, user, message) {
        const entry = document.createElement('div');
        entry.textContent = `${timestamp} [${user}] ${message}`;
        consoleHistory.appendChild(entry);
        consoleInput.value = '';
        consoleHistory.scrollTop = consoleHistory.scrollHeight;
    }

    // Generate Keyboard Layout
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";

        row.forEach(key => {
            if (key === "") return; // Skip empty placeholders for spacing

            const keyButton = document.createElement("div");
            keyButton.className = "key";
            keyButton.dataset.default = key; // Store original key value
            keyButton.textContent = key === "Space" ? "" : key.toLowerCase(); // Blank space key

            keyButton.addEventListener("click", () => handleKeyPress(key));

            if (key === "Space") keyButton.classList.add("space-key"); // Special styling

            rowDiv.appendChild(keyButton);
        });

        keyboard.appendChild(rowDiv);
    });

    function handleKeyPress(key) {
        if (key === "Enter") {
            submitCommand();
        } else if (key === "Backspace") {
            consoleInput.value = consoleInput.value.slice(0, -1); // Remove last character
        } else if (key === "Space") {
            consoleInput.value += " ";
        } else if (key === "Shift") {
            isShiftActive = !isShiftActive;
            updateKeyboardCase();
        } else if (key === "Caps") {
            isCapsActive = !isCapsActive;
            updateKeyboardCase();
        } else {
            let finalKey = key;

            if (isShiftActive && shiftMap[key]) {
                finalKey = shiftMap[key]; // Use shifted symbol
            } else if ((isCapsActive || isShiftActive) && key.length === 1 && key.match(/[a-z]/i)) {
                finalKey = key.toUpperCase(); // Caps affects letters only
            } else {
                finalKey = key.toLowerCase();
            }

            consoleInput.value += finalKey;
            isShiftActive = false; // Turn off Shift after keypress
            updateKeyboardCase();
        }
    }

    function submitCommand() {
        const userInput = consoleInput.value.trim();
        if (userInput) {
            const entry = document.createElement("div");
            entry.textContent = `> ${userInput}`;
            consoleHistory.appendChild(entry);
            consoleInput.value = "";
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
        }
    }

    function updateKeyboardCase() {
        const keys = document.querySelectorAll(".key");
        keys.forEach(keyButton => {
            const key = keyButton.dataset.default;
            if (shiftMap[key]) {
                keyButton.textContent = isShiftActive ? shiftMap[key] : keyButton.dataset.default;
            } else if (key.length === 1 && key.match(/[a-z]/i)) {
                keyButton.textContent = isCapsActive || isShiftActive ? key.toUpperCase() : key.toLowerCase();
            } else {
                keyButton.textContent = keyButton.dataset.default === "Space" ? "" : keyButton.dataset.default.toLowerCase();
            }
        });
    }
});