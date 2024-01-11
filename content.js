// This function will be injected and executed in the context of the current page
function findContext(selectedText) {
    // Escape special characters in the selected text for use in a regular expression
    const escapedText = selectedText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const searchRegex = new RegExp('\\b' + escapedText + '\\b', 'i');  // 'i' for case-insensitive
  
    // Get all paragraph elements
    const paragraphs = document.querySelectorAll('p');
    
    for (const paragraph of paragraphs) {
      const paragraphText = paragraph.innerText;
      
      // Check if the paragraph contains the selected text
      if (searchRegex.test(paragraphText)) {
        // Find the first occurrence of the text in the paragraph
        const matchPosition = paragraphText.search(searchRegex);
        
        // Extract and display the sentence
        const sentence = extractSentence(paragraphText, matchPosition);
        if (sentence) {
          displayTooltip(sentence);
          return;
        }
      }
    }
  
    // If no sentence is found, display a default message
    displayTooltip("Context not found.");
  }
  
  // Extract a complete sentence that includes the matched text
  function extractSentence(text, position) {
    // Find the start of the sentence
    let start = position;
    while (start > 0 && text[start] !== '.' && text[start] !== '?' && text[start] !== '!') {
      start--;
    }
    start = start > 0 ? start + 1 : start; // Skip the punctuation mark
  
    // Find the end of the sentence
    let end = position;
    while (end < text.length && text[end] !== '.' && text[end] !== '?' && text[end] !== '!') {
      end++;
    }
  
    // Return the sentence
    return text.substring(start, end + 1).trim();
  }
  
  // Function to display the tooltip
  function displayTooltip(text) {
    const tooltip = document.createElement('div');
    const label = document.createElement('span');
    label.textContent = 'Detected Context: ';
    label.style.fontWeight = 'bold';

    // Create a span for the actual text
    const contextText = document.createElement('span');
    contextText.textContent = text;

    // Append the label and the context text to the tooltip
    tooltip.appendChild(label);
    tooltip.appendChild(contextText);    
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#ececec'; // Light grey background
    tooltip.style.border = '1px solid #ddd'; // Light grey border
    tooltip.style.borderRadius = '4px'; // Rounded corners
    tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'; // Subtle shadow
    tooltip.style.padding = '8px 12px'; // More padding
    tooltip.style.color = '#333'; // Darker text for better readability
    tooltip.style.fontFamily = 'Arial, sans-serif'; // Font styling
    tooltip.style.fontSize = '14px'; // Adjust font size
    tooltip.style.zIndex = '1000';
    tooltip.style.top = (window.scrollY + 10) + 'px'; // Adjust as needed
    tooltip.style.left = '10px'; // Adjust as needed
  
    document.body.appendChild(tooltip);
  
    // Automatically remove the tooltip after a few seconds or on click
    setTimeout(() => {
      if (document.body.contains(tooltip)) {
        document.body.removeChild(tooltip);
      }
    }, 30000);
    tooltip.addEventListener('click', () => {
      if (document.body.contains(tooltip)) {
        document.body.removeChild(tooltip);
      }
    });
  }
  
  // Listener to inject the findContext function when the context menu item is clicked
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "findContext") {
        findContext(request.selectedText);
      }
    }
  );
  