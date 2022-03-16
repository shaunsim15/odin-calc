// Define buttons
const display = document.querySelector('.display');
const backspace = document.querySelector('.backspace');
const AC = document.querySelector('.AC');
const numNodeList = document.querySelectorAll('.num');
const opNodeList = document.querySelectorAll('.op');
const decimal = document.querySelector('.decimal');
const equals = document.querySelector('.equals');

// Define values
let displayVar = "0";
const numberArray = ["0","1","2","3","4","5","6","7","8","9"];
const operatorArray = ["+","-","×","÷"];
const decPlaces = 8;
const maxChars = 17;

// Add event listeners
const numArray = Array.from(numNodeList);
numArray.forEach( element => element.addEventListener('click',addNumToDisplay));
const opArray = Array.from(opNodeList);
opArray.forEach( element => element.addEventListener('click',addOpToDisplay));

equals.addEventListener('click', equalFunc);
AC.addEventListener('click',reset);
decimal.addEventListener('click',addDecToDisplay);
backspace.addEventListener('click',deleteChar);
window.addEventListener('keydown',pressButton)

// Add numbers 0 - 9 to display when correct buttons are pressed
function addNumToDisplay(e){
    // If you're starting calculator up and zero appears on screen, let the newly typed number replace it
    if (display.textContent === '0'){
        display.textContent = this.textContent;
        displayVar = display.textContent;
        return;
    }

    // If you add too many characters to the display, exit function w/o adding to display
    if (displayVar.length > maxChars){
        return;
    }

    // Add numbers to display
    display.textContent = display.textContent + this.textContent;
    displayVar = display.textContent;
}

// Add operators +, -, × and ÷ to display when correct buttons are pressed
function addOpToDisplay(e){
    // If the previous button pressed was also an operator, exit function without adding to display
    if (operatorArray.includes(display.textContent.charAt(display.textContent.length - 1))) return;

    // If you add too many characters to the display, exit function w/o adding to display
    if (displayVar.length > maxChars){
        return;
    }

    // If the display already has an operator (that is not due to a negative first number), then compute that result first, 
    // then add on the operator just pressed, and then display both
    if (displayVar.slice(1).includes('+') || displayVar.slice(1).includes('-') || displayVar.slice(1).includes('×') || displayVar.slice(1).includes('÷')){
        let answer = compute(displayVar);
        if (answer === 'error'){
            return;
        }
        answer = +answer.toFixed(decPlaces);
        // If you add too many characters to the display, exit function w/o adding to display
        if (answer.toString().length > maxChars){
            alert("Too many characters!");
            return;
        }

        display.textContent = answer + this.textContent;
        displayVar = display.textContent;
        return;
    }
    // Otherwise, add the operator to the display
    display.textContent= display.textContent + this.textContent;
    displayVar = display.textContent;
}

// Add decimal to display when correct button is pressed
function addDecToDisplay(e){
    // If you add too many characters to the display, exit function w/o adding to display
    if (displayVar.length > maxChars){
        return;
    }

    let operandArray = [displayVar];
    // We want the previously inputted character to be a number (not an operator or empty)
    let prevChar = displayVar.charAt(displayVar.length - 1);
    if (!numberArray.includes(prevChar)){
        return;
    }
    // If there's an operator in the display already, split the string at the operator
    if (displayVar.includes('+')){
        operandArray = displayVar.split("+");
    }
    else if (displayVar.includes('-')){
        operandArray = displayVar.split("-");
    }
    else if (displayVar.includes('×')){
        operandArray = displayVar.split("×");
    }
    else if (displayVar.includes('÷')){
        operandArray = displayVar.split("÷");
    }

    // Ensure the latest element in the operand array has no '.'
    if (operandArray[operandArray.length - 1].includes('.')) {
        return;
    }
    // If all above checks are passed, only then you can add '.' to the display
    display.textContent= display.textContent + this.textContent;
    displayVar = display.textContent;
}

// Compute the expression when '=' button is pressed
function equalFunc (e){
    let answer = compute(displayVar);
    if (answer === 'error'){
        return;
    }
    answer = +answer.toFixed(decPlaces);
    // If you add too many characters to the display, exit function w/o adding to display
    if (answer.toString().length > maxChars){
        alert("Too many characters!");
        return;
    }
    display.textContent = answer;
    displayVar = display.textContent;
}

// Reset the display if the 'AC' button (or 'r' on keyboard) is pressed
function reset (e){
    displayVar = "0";
    display.textContent = "0";
}

// Remove last character from display when 'DEL' button (or 'Backspace' on keyboard) is pressed
function deleteChar(e){

    // Check that the display is not empty before backspacing
    if (displayVar === ""){
        return;
    }
    // If only one character left, change display to zero instead of backspacing
    else if (displayVar.length === 1){
        displayVar = "0";
        display.textContent = "0";
    }
    // Remove last character from display
    else{
        display.textContent = display.textContent.slice(0,-1);
        displayVar = display.textContent;
    }
}

// If the right key on the keyboard is pressed, cause the relevant HTML button to be clicked
function pressButton(e){
    const key = document.querySelector(`button[data-key = "${e.key}"]`)
    if (!key){
        return;
    }
    key.click();
}

// Add a and b
function add (a, b){
    return a + b;
}
// Subtract b from a
function subtract (a, b){
    return a - b;
}
// Multiply a and b
function multiply (a, b){
    return a * b;
}
// Divide a by b
function divide (a, b){
    return a / b;
}

// Call one of the operator functions (either add, subtract, multiply or divide) on a and b.
function operate (a, b, operator){
    return operator(a, b);
}

// Returns the answer of the computed String, or an error message if the string is non-computable
function compute (expressionString){
    let stringOperator;
    let operandArray;
    let isFirstNumberNegative = false;

    // If the first number is negative, take out the minus sign before splitting
    if (expressionString.charAt(0) === '-'){
        expressionString = expressionString.slice(1);
        isFirstNumberNegative = true;
    }

    // Check that the string has an operator, and split the string at the operator
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
        if(+(operandArray[1]) === 0){
            alert("You can't divide by zero!");
            return 'error';
        }
    }
    // Return an error if there is no operator
    else {return 'error';}

    // Return an error if there is no second operand (i.e. there's only one operand & one operator.)
    if (operandArray[1] === ''){
        return 'error';
    }

    // If the first number was negative, add back the minus sign
    if (isFirstNumberNegative === true){
        operandArray[0] = '-' + operandArray[0]
    }

    // Compute the string and return the answer
    return operate(Number(operandArray[0]), Number(operandArray[1]), stringOperator);
}
