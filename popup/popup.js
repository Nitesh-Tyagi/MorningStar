document.getElementById('Load').addEventListener('click', function() {
    var fileInput = document.getElementById('csvFileInput');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var text = e.target.result;
            processCSV(text);
        };

        reader.readAsText(file);
    } else {
        alert("Please select a CSV file.");
    }
});

document.getElementById('Unload').addEventListener('click', function() {
    chrome.runtime.sendMessage({stage: '1-0'});
    getCurrentStage();   
});

function processCSV(csvText) {
    var rows = csvText.trim().split("\n");
    var headers = rows.shift().split(",");
    if(headers[0]) headers[headers.length - 1] = headers[headers.length - 1].slice(0, -1);
    for(var i=0;i<rows.length-1;i++) rows[i] = rows[i].slice(0, -1);
    // Check if headers match the required format
    var requiredHeaders = ["Symbol", "Name", "Date", "Shares", "Share_Price"];
    if (!arraysEqual(headers, requiredHeaders)) {
        alert("Please make sure to upload a CSV file with these Column names: " + requiredHeaders.join(", "));
        return;
    }

    // Process CSV rows into objects
    var data = rows.map(function(row) {
        var values = row.split(",");
        var obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });

    console.log(data);
    // Here you would send the message to the runtime with the csvData
    // This is a placeholder for your actual runtime message sending code.
    // For example:
    chrome.runtime.sendMessage({stage: '0-1', csvData: data});
    getCurrentStage();
}

// Utility function to compare two arrays
function arraysEqual(a, b) {
    console.log(a," ::: ",b);
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    console.log(a.length," : ",b.lenght);
    for (var i = 0; i < a.length; ++i) {
        console.log(a[i]," : ",b[i]);
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function getCurrentStage() {
    chrome.runtime.sendMessage({action: 'getStage'}, (response) => {
        var innerContainer = document.querySelector('.innerContainer');

        // 2. Iterate through all children of 'innerContainer'
        if (innerContainer) {
            innerContainer.childNodes.forEach(child => {
                if (child.classList && child.classList.contains('displayBlock')) {
                    child.classList.remove('displayBlock');
                }
                if(child.classList) child.classList.add('displayNone');
            });
        }

        // 3.
        var query = '.stage-0';
        if(response.stage==1) query = '.stage-1';
        else if(response.stage==2) query = '.stage-2';  

        console.log('GETSTAGE : ',response.stage," :: ",query);
        document.querySelectorAll(query).forEach(element => {
            if(element.classList.contains('displayNone')) element.classList.remove('displayNone');
            element.classList.add('displayBlock');
            console.log(element);
        });
    });
}

document.getElementById('Start').addEventListener('click', function() {
    chrome.runtime.sendMessage({stage: '1-2'});
    getCurrentStage();   
});


getCurrentStage();