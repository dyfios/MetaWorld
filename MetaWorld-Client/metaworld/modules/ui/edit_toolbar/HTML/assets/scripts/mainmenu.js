const initialMainButtonData = [
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' },
    { icon: 'assets/images/blank-icon.png', tooltip: 'Empty', onclick: '' }
];

const buttonContainer = document.getElementById('buttonContainer');
const buttonLabel = document.getElementById('buttonLabel');
const menu = document.getElementById('menu');
const menuGridContainer = document.getElementById('menuGridContainer');
const searchBar = document.getElementById('searchBar');
const consoleMenu = document.getElementById('console');
const consoleHistory = document.getElementById('consoleHistory');
const consoleInput = document.getElementById('consoleInput');
const consoleSubmit = document.getElementById('consoleSubmit');

let mainMenuButtonCount = 0;

let lowerToolbarFirstButton = null;

let selectedIndex = 0;

function AddButtonToMainMenu(data, index, onClick) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'round-button-wrapper';

    const button = document.createElement('button');
    button.className = 'round-button';
    button.dataset.index = index;
    button.innerHTML = `<img src="${data.icon}" alt="Icon">`;
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', data.tooltip);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = data.tooltip;

    buttonWrapper.appendChild(button);
    buttonWrapper.appendChild(label);
    menuGridContainer.appendChild(buttonWrapper);

    button.addEventListener('click', () => {
        InsertButtonIntoLowerToolbar(data, index, onClick);
    });
}

function InsertButtonIntoLowerToolbar(data, index, onClick) {
    AddButtonToLowerToolbarAtFront(data, index, onClick);
    RemoveLastButtonFromLowerToolbar();
}

function AddButtonToLowerToolbarAtFront(data, index, onClick) {
    const button = document.createElement('button');
    button.className = 'round-button';
    button.dataset.index = index;
    button.innerHTML = `<img src="${data.icon}" alt="Icon" width="25">`;
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', data.tooltip);

    if (lowerToolbarFirstButton == null) {
        buttonContainer.appendChild(button);
    }
    else {
        buttonContainer.insertBefore(button, buttonContainer.firstChild)
    }
    lowerToolbarFirstButton = button;

    button.addEventListener('click', () => {
        document.querySelectorAll('.round-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        buttonLabel.innerHTML = data.tooltip;
        postWorldMessage(onClick);
    });
}

function RemoveLastButtonFromLowerToolbar() {
    buttonContainer.removeChild(buttonContainer.lastChild);
}

function SelectLowerToolbarButton(index) {
    buttonContainer.childNodes[index].click();
    selectedIndex = index;
}

function SelectLowerToolbarButtonAtLeft() {
    if (selectedIndex > 0) {
        selectedIndex--;
        buttonContainer.childNodes[selectedIndex].click();
    }
}

function SelectLowerToolbarButtonAtRight() {
    if (selectedIndex < buttonContainer.childNodes.length - 1 && selectedIndex >= 0) {
        selectedIndex++;
        buttonContainer.childNodes[selectedIndex].click();
    }
}

// Create round buttons for the main UI dynamically
initialMainButtonData.forEach((data, index, onClick) => {
    AddButtonToLowerToolbarAtFront(data, index, onClick);
});

// Filter buttons based on search input
if (searchBar != null) {
    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const buttons = menuGridContainer.querySelectorAll('.round-button-wrapper');

        buttons.forEach(wrapper => {
            const tooltip = wrapper.querySelector('.round-button').getAttribute('title').toLowerCase();
            wrapper.style.display = tooltip.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

document.addEventListener('keydown', (event) => {
    // Listen for the "\" keypress to toggle the menu
    if (event.key.toLowerCase() === '\\') {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        if (menu.style.display === 'block') {
            postWorldMessage("TOOLBAR.DISPLAY.ENABLED");
        }
        else {
            postWorldMessage("TOOLBAR.DISPLAY.DISABLED");
        }
    }
    // Listen for the "right Shift" keypress to toggle the console
    else if (event.key === '|') {
        if (consoleMenu != null) {
            consoleMenu.style.display = consoleMenu.style.display === 'block' ? 'none' : 'block';
        }
    }
    // Listen for the "Enter" keypress to submit console command
    else if (event.key === 'Enter' && document.activeElement === consoleInput) {
        submitCommand();
    }
});

// Listen for button click to submit command
if (consoleSubmit != null) {
    consoleSubmit.addEventListener('click', submitCommand);
}

// Detect when input becomes active (focused)
if (consoleInput != null) {
    consoleInput.addEventListener('focus', () => {
        consoleInput.style.backgroundColor = "#222"; // Example: darken background on focus
        consoleInput.style.color = "#fff"; // Change text color for readability
        postWorldMessage("TOOLBAR.CONSOLE.INPUT-ACTIVE");
    });
}

// Detect when input becomes inactive (blurred)
if (consoleInput != null) {
    consoleInput.addEventListener('blur', () => {
        consoleInput.style.backgroundColor = ""; // Reset background color
        consoleInput.style.color = ""; // Reset text color
        postWorldMessage("TOOLBAR.CONSOLE.INPUT-INACTIVE");
    });
}

// Function to submit console command
if (consoleInput != null) {
    function submitCommand() {
        const userInput = consoleInput.value.trim();
        if (userInput) {
            postWorldMessage("TOOLBAR.CONSOLE.SEND-MESSAGE(" + userInput + ")");
        }
    }

    function AddMessageToConsole(timestamp, user, message) {
        const entry = document.createElement('div');
        entry.textContent = `${timestamp} [${user}] ${message}`;
        consoleHistory.appendChild(entry);
        consoleInput.value = '';
        consoleHistory.scrollTop = consoleHistory.scrollHeight;
    }
}

function AddToolButton(toolName, imgPath, onClickMsg) {
    data = {
        icon: imgPath,
        tooltip: toolName
    };
    AddButtonToMainMenu(data, mainMenuButtonCount++, onClickMsg);
}

function AddMaterialButton(matName, imgPath, onClickMsg) {
    data = {
        icon: imgPath,
        tooltip: matName
    };
    AddButtonToMainMenu(data, mainMenuButtonCount++, onClickMsg);
}

function AddEntityButton(entityName, imgPath, onClickMsg) {
    data = {
        icon: imgPath,
        tooltip: entityName
    };
    AddButtonToMainMenu(data, mainMenuButtonCount++, onClickMsg);
}

function ToggleEntitiesMenu() {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        if (menu.style.display === 'block') {
            postWorldMessage("TOOLBAR.DISPLAY.ENABLED");
        }
        else {
            postWorldMessage("TOOLBAR.DISPLAY.DISABLED");
        }
}

function ToggleGrid() {
    console.log("ToggleGrid");
    const grid = document.getElementById('gridCheckbox');
    grid.checked = !grid.checked;
    if (grid) {
        grid.checked = !grid.checked;
        postWorldMessage("TOOLBAR.GRID.TOGGLE(" + grid.checked + ")");
    }
}

const grid = document.getElementById('gridCheckbox');
if (grid) {
    grid.checked = true;
}