chrome.runtime.onInstalled.addListener(() => {
    stage10();
});

function stage01 (csvData) {
    chrome.storage.local.set({csvData: csvData, stage: 1}, () => {
        console.log("csvData and stage saved to local storage.");
    });
}

function stage10 () {
    chrome.storage.local.set({csvData: [], stage: 0}, () => {
        console.log("Default values set.");
    });
}

// Define a delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// async function sendMessagesSequentially() {
//     // Wrap the chrome.storage.local.get call in a promise to use await
//     const result = await new Promise((resolve, reject) => {
//         chrome.storage.local.get('csvData', (result) => {
//             if (chrome.runtime.lastError) {
//                 reject(new Error(chrome.runtime.lastError));
//             } else {
//                 resolve(result);
//             }
//         });
//     });

//     var csvData = result.csvData;
//     for (let obj of csvData) {
//         await chrome.runtime.sendMessage({action: 'automate', 'obj': obj});
//         await delay(1000); // Wait for 1 second before sending the next message
//     }
// }

function stage12 () {
    function sendMessageToMatchingTabs() {
        
    }
    
    chrome.storage.local.get('csvData', (result) => {
        if (result.csvData) {
            // const yourCsvDataVariable = result.csvData;
            chrome.tabs.query({url: "*://investor.morningstar.com/portfolios/*"}, function(tabs) {
                for (let tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, {action: 'automate', csvData: result.csvData}, function(response) {
                        console.log("Message sent to tab: " + tab.id);
                        if (response) {
                            console.log("Response from tab:", response);
                        }
                    });
                }
            });
        } else {
            console.error('No CSV data found');
        }
    });
    
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getStage') {
        chrome.storage.local.get('stage', (result) => {
            sendResponse({stage: result.stage !== undefined ? result.stage : '-1'});
        });
        return true;
    }
    else if (message.stage=='0-1' && message.csvData) {
        stage01(message.csvData);
    } 
    else if (message.stage=='1-0') {
        stage10();
    } 
    else if (message.stage=='1-2') {
        stage12();
    } 
});

