/**
 * Created by Jorge Sarmiento on 4/7/2016.
 */

/**
 * Returns an element by its id. It's just to shorten code.
 *
 * @param id Id of the element to be returned.
 * @returns {Element} The element.
 */
function getElement(id){
    return document.getElementById(id);
}

/**
 * Checks:
 * 1. If the elements in the parameters are valid HTML Input Elements
 * AND if their type is "number"
 * 2. If the input elements' content are valid numbers.
 * @returns {boolean} TRUE If EVERY Input element has a valid number. FALSE Otherwise.
 */
function validInteger(){
    for(var i = 0; i < arguments.length; i++){
        var txt = getElement(arguments[i]);
        //If txt is not an HTML Input element, of Type number,
        // and it's value is not a number, return false.
        if(!(txt instanceof HTMLInputElement)
            || txt.type != 'number' && isNaN(parseInt(txt.value))){
            alert(txt + MESSAGES.NOT_NUMBER_INPUT);
            return false;
        }
    }
    return true;
}

/**
 * Returns an integer from a text field.
 * @param txtfield Text field where number is.
 * @returns {Number} as Integer.
 */
function getNumber(txtfield){
    return parseInt(getElement(txtfield).value);
}

/**
 * Clears N Text fields.
 * //TODO Validate if elements are text fields.
 */
function clearText(){
    for (var i = 0; i < arguments.length; i++) {
        getElement(arguments[i]).value = '';
    }
}

/**
 * Gets the program's name from it's respective Text field
 * @returns {string|string|Number} Whatever's inside Text field 'tx1'
 */
function getProgramName(){
    return getElement("tx1").value;
}

/**
 * Gets the new Program's Initial time from it's respective Text field as Integer.
 * @returns {Number} Whatever Integer number's inside Text Field tx2 as Integer.
 */
function getProgramTI(){
    return parseInt(getElement("tx2").value);
}

/**
 * Gets the new Program's Execution time from it's respective Text field as Integer.
 * @returns {Number} Whatever Integer number's inside Text Field tx2 as Integer.
 */
function getProgramT(){
    return parseInt(getElement("tx3").value);
}

//function insertValues(table, i){
//    table.rows[i].cells[3].innerHTML = programs[i-1].tf;
//    table.rows[i].cells[4].innerHTML = programs[i-1].T;
//    table.rows[i].cells[5].innerHTML = programs[i-1].E;
//    table.rows[i].cells[6].innerHTML = programs[i-1].I;
//}

Array.min = function(arr){
    return Math.min.apply(Math, arr);
};

function showResults(progArray, table){
    for(var i = 0; i < progArray.length; i++){
        table.rows[i+1].cells[3].innerHTML = progArray[i].tf;
        table.rows[i+1].cells[4].innerHTML = progArray[i].T;
        table.rows[i+1].cells[5].innerHTML = progArray[i].E;
        table.rows[i+1].cells[6].innerHTML = progArray[i].I;
    }
}