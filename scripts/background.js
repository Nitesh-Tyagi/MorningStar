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

function stage20 () {
    chrome.storage.local.set({csvData: [], stage: 0}, () => {
        console.log("Default values set.");
        
        chrome.tabs.query({url: "*://investor.morningstar.com/portfolios/*"}, function(tabs) {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {action: 'stop'}, function(response) {
                    console.log("Message sent to tab: " + tab.id);
                    if (response) {
                        console.log("Response from tab:", response);
                    }
                });
            }
        });
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stage12 () {
    var startTime = new Date(); // Current time
    console.log("START TIME : ", startTime.toISOString());

    chrome.storage.local.set({stage: 2}, () => {
        chrome.storage.local.get('csvData', (result) => {
            if (result.csvData) {
                chrome.tabs.query({url: "*://investor.morningstar.com/portfolios/*"}, function(tabs) {
                    for (let tab of tabs) {
                        chrome.tabs.sendMessage(tab.id, {action: 'automate', csvData: result.csvData, stage: 2}, function(response) {
                            console.log("Message sent to tab: " + tab.id);
                            if (response) {
                                console.log("Response from tab:", response);
                                var endTime = new Date(); // Current time
                                console.log("FINISH TIME : ", endTime.toISOString());  
                                console.log("DURATION : ", new Date(endTime - startTime).toISOString().substr(11, 8));
                            }
                        });
                    }
                });
            } else {
                console.error('No CSV data found');
            }
        });
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
    else if (message.stage=='2-0') {
        stage20();
    } 
});

