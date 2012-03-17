// uniquely generate class name for each JS injection
var CLASS_NAME = 'me-davidhu-selection'+(Math.floor(Math.random()*1000));

// GitHub code is surrounded by <div class="highlight"></div>
var codeBlocks = document.getElementsByClassName('highlight');

for(var i = 0; i < codeBlocks.length; i++) {
	var block = codeBlocks[i];

	block.onclick = function(theBlock) {
		return function() {
			// clear any previous selections
			var oldSelections = document.getElementsByClassName(CLASS_NAME);
			while(oldSelections.length > 0) {
				var currSelection = oldSelections[0];
				currSelection.style.border = null;
				currSelection.className = currSelection.className.replace(CLASS_NAME, '');
			}

			// get the selection and highlight
			var selection = window.getSelection().toString();
			if(selection.length > 0 && selection.search(/^\s+$/) === -1) {
				highlight(selection, theBlock);
			}
		}
	}(block);
}

// finds all instances of selection in element and highlights them
function highlight(selection, element) {
	var text = element.nodeValue; // the actual text, not innerHTML
	if(text !== null && typeof text === 'string' && text.indexOf(selection) >= 0) {
		var parent = element.parentNode; // since element is just the textNode

		// so we avoid duplication during tree traversal
		if(parent.className.indexOf(CLASS_NAME) >= 0 
			|| parent.innerHTML.indexOf(CLASS_NAME) >= 0 )
			return;

		console.log("replacing: "+parent.innerHTML);
		parent.innerHTML = parent.innerHTML.replace(selection, 
			'<span style="border:1px solid #999; border-radius:3px;" class="'+CLASS_NAME+'">'+selection+'</span>');
	}

	// recurse through DOM children
	var children = element.childNodes;
	for(var i = 0; i < children.length; i++) {
		highlight(selection, children[i]);
	}
}