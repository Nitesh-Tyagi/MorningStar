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
                console.log('Found leaf element:', el);
                return el;
            }
        }
    }
    console.log('Leaf element with specified text not found.');
    return null;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performActionBasedOnProperty(action, property, value, newValue, delayMs) {
    await delay(delayMs); // Wait for the specified delay
    var timestamp = new Date(); // Current time
    console.log("TIME : ", timestamp.toISOString());

    var elements, lastElement=null;
    // Define the logic for finding and acting on elements as before
    if (property === 'innerText') {
        var elements = document.querySelectorAll('*');
        lastElement=null;
        for (var element of elements) {
            // console.log("SPAN ::: ",(element.innerText || "").trim());
            if ((element.innerText || "").trim() === value) {
                lastElement = element; // Found the last matching element
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
            console.log('CLASS : ',elements);
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

    

    // Perform the action
    if (action === 'click') {
        lastElement.click();
        console.log(`Clicked on element with ${property}="${value}".`);
    } else if (action === 'focus') {
        lastElement.focus();
        console.log(`Focused on element with ${property}="${value}".`);
    } else if (action === 'input' && (lastElement.tagName === 'INPUT' || lastElement.tagName === 'TEXTAREA')) {
        lastElement.value = newValue; // Set the new value for input or textarea
        // Trigger the 'input' event to mimic user typing
        var event = new Event('input', { bubbles: true });
        lastElement.dispatchEvent(event);
        console.log(`Changed value of element with ${property}="${value}" to "${newValue}".`);
    } else {
        console.log(`Action '${action}' is not supported or element is not an input or textarea.`);
    }
}


// async function performActionBasedOnProperty(action, property, value, inputValue, delayMs) {
//     await delay(delayMs); // Wait for the specified delay
//     var timestamp = new Date(); // Current time
//     console.log("TIME : ", timestamp.toISOString());

//     var selector = `[${property}="${value}"]`; // Construct the CSS selector based on property and value
//     var elements = property === 'innerText' ? [...document.querySelectorAll('*')].filter(e => e.innerText.trim() === value) : document.querySelectorAll(selector);
//     var targetElement = elements[elements.length - 1]; // Get the last element that matches the selector

//     if (!targetElement) {
//         console.log(`Element with ${property}="${value}" not found.`);
//         return;
//     }

//     // Perform the action
//     if (action === 'click') {
//         targetElement.click();
//     } else if (action === 'focus') {
//         targetElement.focus();
//     } else if (action === 'input') {
//         if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
//             targetElement.value = inputValue; // Set the new value for input or textarea
//             // Trigger the 'input' event to mimic user typing
//             var event = new Event('input', { bubbles: true });
//             targetElement.dispatchEvent(event);
//         } else {
//             console.log(`Element with ${property}="${value}" is not an input or textarea.`);
//         }
//     }

//     console.log(`Action '${action}' performed on element with ${property}="${value}".`);
// }