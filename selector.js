/*
	selector.js
	Codeliter

	Author: @octopi
*/

// generate (universally) unique class name for each script load
var CLASS_NAME = 'me-davidhu-codeliter'+(Math.floor(Math.random()*1000));

// for bracket matching, keep track of one stack per code block on page
var bracketStack = [];
// but have a globally unique bracket pair counter
var bid = 0; 

// get all blocks of code on the page
var codeBlocks;
if(window.location.hostname.indexOf('github.com') > -1) {
	codeBlocks = document.getElementsByClassName('highlight');	
	init();
} else if(window.location.hostname.indexOf('stackoverflow.com') > -1) {
	codeBlocks = document.getElementsByClassName('prettyprint');	
	window.setTimeout(init, 1000); // SO has a delay in setting up their code
}

function init() {
	// initialize all code blocks independently
	for(var i = 0; i < codeBlocks.length; i++) {
		var block = codeBlocks[i];

		// begin set up brackets
		bracketStack[i] = []; 
		bracketInit(i, block);

		block.onclick = function(theBlock) {
			return function() {
				clearHighlights();

				// get the selection and highlight
				var selection = window.getSelection().toString();
				if(selection.length > 0 && selection.search(/^\s+$/) === -1 && selection.search(/^\;$/) === -1) {
					if(!(selection.search(/^\{$/) >= 0 || selection.search(/^\}$/) >= 0)) {
						highlight(selection, theBlock);	
					}
				}
			};
		}(block);
	}

	// finish setting up brackets: bind all pairs together
	for(var k = 0; k < bid; k++) {
		var brackets = document.getElementsByClassName(CLASS_NAME+'-bracket-'+k);

		brackets[0].onclick = bracketClick(brackets[0], brackets[1]);
		brackets[1].onclick = bracketClick(brackets[0], brackets[1]);
	}
}

// clear any previous selections
function clearHighlights() {
	var oldSelections = document.getElementsByClassName(CLASS_NAME);
	while(oldSelections.length > 0) {
		var currSelection = oldSelections[0];
		currSelection.style.border = null;
		currSelection.className = currSelection.className.replace(CLASS_NAME, '');
	}
}

// finds all instances of selection in element and highlights them
function highlight(selection, element) {
	var text = element.nodeValue; // the actual text, not innerHTML
	if(text !== null && typeof text === 'string' && text.indexOf(selection) >= 0) {
		var parent = element.parentNode; // since element is just the textNode

		// so we avoid duplication during tree traversal
		if(parent.className.indexOf(CLASS_NAME) >= 0 || parent.innerHTML.indexOf(CLASS_NAME) >= 0 )
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

// sets up brackets
function bracketInit(blockIndex, element) {
	var text = element.nodeValue; // the actual text, not innerHTML
	
	if(text !== null && typeof text === 'string' 
		&& (text.indexOf('}') >= 0 || text.indexOf('{') >= 0)) {
		var parent = element.parentNode; // since element is just the textNode

		// so we avoid duplication during tree traversal
		if(parent.className.indexOf(CLASS_NAME) >= 0 || parent.innerHTML.indexOf(CLASS_NAME) >= 0 )
			return;

		parent.innerHTML = parent.innerHTML.replace('{', '<span class="'+CLASS_NAME+'-bracket">{</span>');
		parent.innerHTML = parent.innerHTML.replace('}', '<span class="'+CLASS_NAME+'-bracket">}</span>');

		var brackets = document.getElementsByClassName(CLASS_NAME+'-bracket');
		for(var i = 0; i < brackets.length; i++) {
			var currBracket = brackets[i];
			if(currBracket.textContent.indexOf('{') >= 0) {
				bracketStack[blockIndex].push(currBracket);
			} else if(currBracket.textContent.indexOf('}') >= 0) {
				var matchedBracket = bracketStack[blockIndex].pop();

				matchedBracket.className = CLASS_NAME+'-bracket-'+bid;
				currBracket.className = CLASS_NAME+'-bracket-'+bid;

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

// highlight open & close bracket pair 
function bracketClick(openBracket, closeBracket) {
	return function(event) {
		clearHighlights();

		openBracket.setAttribute('style', 'border:1px solid #999; border-radius:3px;');
		openBracket.className += (' '+CLASS_NAME);
		closeBracket.setAttribute('style', 'border:1px solid #999; border-radius:3px;');
		closeBracket.className += ' '+CLASS_NAME;
		event.stopPropagation();
	};
}
