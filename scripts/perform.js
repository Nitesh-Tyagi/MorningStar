function detection () {
    document.addEventListener('focusin', function(event) {
        console.log("FOCUSED : ", event.target);
    });            
    document.addEventListener('click', function(event) {
        console.log("CLICKED : ", event.target);
    });
    document.addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            console.log("INPUT CHANGED: ", event.target, "New value: ", event.target.value);
        }
    });    
}

function findbyInnerText(text) {
    var allElements = document.querySelectorAll('*');
    
    for (var i = 0; i < allElements.length; i++) {
        var el = allElements[i];
        if (el.children.length === 0) {
            var elText = el.innerText || "";
            if (elText.trim() === text) {
                // console.log('Found leaf element:', el);
                return el;
            }
        }
    }
    // console.log('Leaf element with specified text not found.');
    return null;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performActionBasedOnProperty(action, property, value, newValue, delayMs) {
    await delay(delayMs); // Wait for the specified delay
    // var timestamp = new Date();
    // console.log("TIME : ", timestamp.toISOString());

    var elements, lastElement=null;
    if (property === 'innerText') {
        var elements = document.querySelectorAll('*');
        lastElement=null;
        for (var element of elements) {
            if ((element.innerText || "").trim() === value) {
                lastElement = element;
            }
        }
        if (lastElement === null) {
            console.log(`Element with ${property}="${value}" not found.`);
            return;
        }
    } else if (property == 'class') {
        var key = true;
        var count = 10;
        do {
            elements = document.querySelectorAll(`.${value}`);
            if (elements.length > 0) {
                lastElement = elements[0];
                key = false;
            }
            count--;
            await delay(delayMs);
        } while(key && count>0);
    }    
    else {
        elements = document.querySelectorAll(`[${property}="${value}"]`);
        if (elements.length > 0) {
            lastElement = elements[elements.length - 1];
        } else {
            console.log(`Element with ${property}="${value}" not found.`);
            return;
        }
    }

    if (action === 'click') {
        lastElement.click();
        // console.log(`Clicked on element with ${property}="${value}".`);
    } else if (action === 'focus') {
        lastElement.focus();
        // console.log(`Focused on element with ${property}="${value}".`);
    } else if (action === 'input' && (lastElement.tagName === 'INPUT' || lastElement.tagName === 'TEXTAREA')) {
        lastElement.value = newValue; // Set the new value for input or textarea
        // Trigger the 'input' event to mimic user typing
        var event = new Event('input', { bubbles: true });
        lastElement.dispatchEvent(event);
        // console.log(`Changed value of element with ${property}="${value}" to "${newValue}".`);
    } else {
        console.log(`Action '${action}' is not supported or element is not an input or textarea.`);
    }
}