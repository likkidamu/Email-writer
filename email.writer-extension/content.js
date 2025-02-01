console.log("Hello from content.js");
function findToolBar() {
    const Selectors=[ '.btC', '.aDh', '[role="dialog"]' ];
    for (const selector of Selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
       
    }
    return null;
}
function getEmailContent() {
    const Selectors=[ '.a3s.aiL', '.h7',".gmail_quote", '[role="presentation"]' ];
    for (const selector of Selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
        
    }
    return null;
    
}
function createButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO T-I-atl L3';
    button.style.marginRight = '10px';
    button.innerHTML = `AI Reply`;
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','AI Reply');
    return button;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();
    }
    const toolbar= findToolBar();
    if (!toolbar) {
        return;
    }
    const button = createButton();
    button.classList.add('ai-reply-button');
    toolbar.insertBefore(button, toolbar.firstChild);
    button.addEventListener('click', async () => {
       try{
        button.innerHTML = 'Generating...';
        button.disabled=true;
        const emailContent= getEmailContent();
        const response = await fetch('http://localhost:8080/api/email/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "emailContent": emailContent,
                "tone": "Professional"
            }),
           
        })
        if(!response.ok){
            throw new Error('Error in response');
        }
        const data = await response.text();
        const emailBody = document.querySelector('[role="textbox"],[g_editable="true"]');
        if(emailBody){
            emailBody.focus();
            document.execCommand('insertText', false, data);

        }
        else{
            console.log("Email body not found");
            alert("Email body not found"); 
        }

       }
         catch(Error){
              console.error(Error);
                alert("Error in generating email");
         }
         finally{
            button.innerHTML = 'AI Reply';
            button.disabled=false;
         }
    });
    

}
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeNode = addedNodes.some((node) => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.btC, .aDh, [role=dialog]')|| node.querySelector('.btC, .aDh, [role=dialog]'))
        );
        if (hasComposeNode) {
            console.log('New node added');
            setTimeout(injectButton, 500);
        }
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
}); 