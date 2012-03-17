// generate (universally) unique class name for each script load
var CLASS_NAME = 'me-davidhu-selection'+(Math.floor(Math.random()*1000));
var bracketStack = [];
var numBStack = []; 
var bid = 0;

// GitHub code is surrounded by <div class="highlight"></div>
var codeBlocks = document.getElementsByClassName('highlight');

for(var i = 0; i < codeBlocks.length; i++) {
	var block = codeBlocks[i];

	// begin set up brackets
	bracketStack[i] = []; 
	bracketInit(i, block);

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
				if(selection.search(/^\{$/) >= 0 || selection.search(/^\}$/) >= 0) {
					//bracketStack = 0;
					//bracketMatch(selection.anchorNode, selection, theBlock);
				} else {
					highlight(selection, theBlock);	
				}
			}
		}
	}(block);
}

// finish setting up brackets

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

function bracketInit(blockIndex, element) {
	var text = element.nodeValue; // the actual text, not innerHTML
	// if there's no bracket, who cares
	console.log("examining element: ");
	console.log(element);
	if(text !== null && typeof text === 'string' 
		&& (text.indexOf('}') >= 0 || text.indexOf('{') >= 0)) {
		var parent = element.parentNode; // since element is just the textNode
		parent.innerHTML = parent.innerHTML.replace('{', '<span class="'+CLASS_NAME+'-bracket" style="color:#f00;">{</span>');
		parent.innerHTML = parent.innerHTML.replace('}', '<span class="'+CLASS_NAME+'-bracket" style="color:#f00;">}</span>');

		var brackets = document.getElementsByClassName(CLASS_NAME+'-bracket');
		for(var i = 0; i < brackets.length; i++) {
			var currBracket = brackets[i];
			if(currBracket.textContent.indexOf('{') >= 0) {
				//currBracket.textContent = 'open';
				bracketStack[blockIndex].push(currBracket);
			} else if(currBracket.textContent.indexOf('}') >= 0) {
				var matchedBracket = bracketStack[blockIndex].pop();
				//matchedBracket.className = matchedBracket.className+' '+CLASS_NAME+'-bracket-';
				matchedBracket.textContent = bid;
				currBracket.textContent = bid;
				bid++;
			}
		}

	}

	// recurse through DOM children
	var children = element.childNodes;
	for(var i = 0; i < children.length; i++) {
		bracketInit(blockIndex, children[i]);
	}
}


function bracketMatch(bracketNode, bracket, element) {
	var text = element.nodeValue; // the actual text, not innerHTML
	// if there's no bracket, who cares
	if(text !== null && typeof text === 'string' && (text.indexOf('}') >= 0 || text.indexOf('{') >= 0)) {
		var parent = element.parentNode; // since element is just the textNode

		var content = parent.textContent;
		for(var i = 0; i < content.length; i++) {

		}
	}

	// recurse through DOM children
	var children = element.childNodes;
	for(var i = 0; i < children.length; i++) {
		bracketMatch(bracketNode, bracket, children[i]);
	}
}
