// This userscript is designed to be *manually* prepared and injected via console when using 'view all' before printing many chart activities at once
// This userscript should NOT be a last line of defense when redacting personal information. It does not support approximate matching.
// Protected information encompasses many different types of information that are not supported by this script's limited capabilities. 


// clientNames should be filled with a list of nested arrays containing first and last names to be redacted, i.e. [['Dosey', 'Doe'], ['Elmer','Fudd']]
const clientNames = [
  ['','']
]

const redactAll = () => {
  clientNames.forEach((client)=>{
    redact(client[0],client[1]);
  })
}

const redact = (firstName,lastName) => {
  const list = document.querySelectorAll('a, td, .Answer');
  const regex = new RegExp(`(?<![A-Za-z])${firstName}(?![A-Za-z])|(?<![A-Za-z])${lastName}(?![A-Za-z])`);
  const insuranceRegex = new RegExp("UCARE|MHCP|UBH|HP\s[0-9]|HP :");
  list.forEach((el)=>{
    el.childNodes.forEach((node)=>{    
      if (node.nodeType === 3 && node.data.includes(firstName || lastName)) {
        node.data = node.data.replaceAll(regex,'[redacted]');
      } else if (node.nodeType === 3 && insuranceRegex.test(node.data)) {        
        node.data = "[redacted]";
      }
    })
  })
}

redactAll()
