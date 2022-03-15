const display = document.querySelector('.display');
const AC = document.querySelector('.AC');
const numNodeList = document.querySelectorAll('.num');
const opNodeList = document.querySelectorAll('.op');
const equals = document.querySelector('.equals');
const decPlaces = 8;
/*
const one = document.querySelector('.one');
const two = document.querySelector('.two');
const three = document.querySelector('.three');
const four = document.querySelector('.four');
const five = document.querySelector('.five');
const six = document.querySelector('.six');
const seven = document.querySelector('.seven');
const eight = document.querySelector('.eight');
const nine = document.querySelector('.nine');
const zero = document.querySelector('.zero');
*/
let displayVar = "";
const operatorArray = ["+","-","×","÷"];
let operatorCount = 0;

const numArray = Array.from(numNodeList);
numArray.forEach( element => element.addEventListener('click',addNumToDisplay));

const opArray = Array.from(opNodeList);
opArray.forEach( element => element.addEventListener('click',addOpToDisplay));

equals.addEventListener('click', equalFunc);

function addNumToDisplay(e){
    display.textContent= display.textContent + this.textContent;
    displayVar = display.textContent;
}

function addOpToDisplay(e){
    // If the previous button pressed was also an operator, return without adding to display
    if (operatorArray.includes(display.textContent.charAt(display.textContent.length - 1))) return;

    // If the display already has an operator, then compute
    if (displayVar.includes('+') || displayVar.includes('-') || displayVar.includes('×') || displayVar.includes('÷')){
        let answer = compute(displayVar);
        answer = answer.toFixed(decPlaces);
        display.textContent = answer + this.textContent;
        displayVar = display.textContent;
        return;
    }
    // Otherwise, add the operator to the display
    display.textContent= display.textContent + this.textContent;
    displayVar = display.textContent;
}

function equalFunc (e){
    let answer = compute(displayVar);
    if (answer === 'error'){
        return;
    }
    answer = answer.toFixed(decPlaces);
    display.textContent = answer;
    displayVar = display.textContent;
}


function add (a, b){
    return a + b;
}

function subtract (a, b){
    return a - b;
}

function multiply (a, b){
    return a * b;
}

function divide (a, b){
    return a / b;
}

function operate (a, b, operator){
    return operator(a, b);
}

// Returns the answer of the computed String
function compute (expressionString){
    let stringOperator;
    let operandArray;
    if (expressionString.includes('+')){
        stringOperator = add;
        operandArray = expressionString.split("+");
    }
    else if (expressionString.includes('-')){
        stringOperator = subtract;
        operandArray = expressionString.split("-");
    }
    else if (expressionString.includes('×')){
        stringOperator = multiply;
        operandArray = expressionString.split("×");
    }
    else if (expressionString.includes('÷')){
        stringOperator = divide;
        operandArray = expressionString.split("÷");
    }
    else {return 'error';} // there is only one operand, and no operator

    if (operandArray[1] === ''){
        return 'error'; // there is only one operand & one operator. no second operand.
    }

    return operate(Number(operandArray[0]), Number(operandArray[1]), stringOperator);
}