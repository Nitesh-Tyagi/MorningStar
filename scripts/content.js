async function performActionsInSequence(obj) {
    // Adjust the delay between actions as needed
    const delayMs = 1000;

    // 1-7: Initial set of actions
    await performActionBasedOnProperty('focus', 'aria-label', 'Add Holdings', '', 10*delayMs);
    await performActionBasedOnProperty('click', 'innerText', 'Add Holdings', '', delayMs);
    await performActionBasedOnProperty('focus', 'role', 'tooltip', '', delayMs);
    await performActionBasedOnProperty('focus', 'role', 'option', '', delayMs);
    // Note: Action 5 is a repeat of Action 1
    await performActionBasedOnProperty('click', 'innerText', 'Add Stocks & Funds', '', delayMs);
    await performActionBasedOnProperty('focus', 'aria-label', 'Search', '', delayMs);

    // 8-15: Actions involving input changes
    await performActionBasedOnProperty('focus', 'aria-label', 'Search', '', delayMs);
    await performActionBasedOnProperty('input', 'aria-label', 'Search', obj.Symbol, delayMs);
    await performActionBasedOnProperty('click', 'class', 'mdc-stack-item__line__indv', '', delayMs);
    await performActionBasedOnProperty('focus', 'aria-label', 'Add Holdings to Demo Portfolio', '', delayMs);
    await performActionBasedOnProperty('focus', 'placeholder', 'Add date', '', delayMs);
    await performActionBasedOnProperty('click', 'placeholder', 'Add date', '', delayMs);
    await performActionBasedOnProperty('input', 'placeholder', 'Add date', obj.Date, delayMs);
    await performActionBasedOnProperty('focus', 'placeholder', 'Enter shares', '', delayMs);
    await performActionBasedOnProperty('click', 'placeholder', 'Enter shares', '', delayMs);
    await performActionBasedOnProperty('input', 'placeholder', 'Enter shares', obj.Shares, delayMs);
    await performActionBasedOnProperty('focus', 'placeholder', 'Add price', '', delayMs);
    await performActionBasedOnProperty('click', 'placeholder', 'Add price', '', delayMs);
    await performActionBasedOnProperty('input', 'placeholder', 'Add price', obj.Share_Price, delayMs);
    await performActionBasedOnProperty('focus', 'aria-label', 'Save', '', delayMs);
    await performActionBasedOnProperty('click', 'innerText', 'Save', '', delayMs);
    // Assuming the second "Save" click is intentional and needs differentiation
    await performActionBasedOnProperty('focus', 'aria-label', 'Add Holdings to Demo Portfolio', '', delayMs);
    await performActionBasedOnProperty('click', 'innerText', 'Save', '', delayMs + 500); // Slightly increased delay to ensure differentiation
}

var csvData = [];
var stage = 0;

// window.onload = function() {
    
// };

async function performActionsOnCsvDataSequentially(csvData) {
    for (const obj of csvData) {
        await performActionsInSequence(obj);
        console.log("Actions performed for current obj.");
    }
    await chrome.runtime.sendMessage({stage: '1-0'});
}

async function automate() {
    return new Promise((resolve, reject) => {
        var checkInterval = setInterval(function() {
            console.log("Finding");
            var AddHoldings = findbyInnerText('Add Holdings');

            if (AddHoldings) {
                clearInterval(checkInterval);
                detection();
                
                performActionsOnCsvDataSequentially(csvData).then(() => {
                    console.log("Completed all CSV data processing.");
                    resolve();
                }).catch(reject); // Handle errors from performActionsOnCsvDataSequentially
            }
        }, 1000);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'automate') {
        console.log("OBJECT : ", message.csvData);
        // Assuming csvData is declared at a higher scope
        csvData = message.csvData;

        // Call your automate function and wait for it to complete
        automate().then(() => {
            console.log("Automation completed.");
            // Send a response back to the sender
            sendResponse({ status: 'completed' });
        }).catch(error => {
            console.error("Automation failed:", error);
            // Send an error response back
            sendResponse({ status: 'error', message: error.toString() });
        });

        // Return true to indicate you will respond asynchronously
        return true;
    }
});
console.log('ADDED LISTENER!');