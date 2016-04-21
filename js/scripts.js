/**
 * Created by Jorge Sarmiento on 4/7/2016.
 */

var clock2 = 0, temp = 0, t1 = 0, e1 = 0, i1 = 0, t2 = 0, e2 = 0, i2 = 0;
var ta = [];

var programs = [];

/**
 * A program.
 * @param name Name of the Program.
 * @param ti Program's Initial Time of Execution. Our timer has to be equal
 *              to the program's ti to be able to execute it.
 * @param t Program's Time of execution. How long the program takes to execute.
 * @constructor In order to insert a program we need it's name, initial time and execution time.
 */
function Program(name,ti,t){
    this.name = name;
    this.ti = ti;
    this.t = t;
    this.tf = 0;
    this.E = 0;
    this.I = 0;
}

/**
 * Validates if whatever program you're going to introduce
 *  is fine and then inserts it to the tables.
 */
function addPrograms() {
    //If tx2 and tx3 have valid numbers...
    if(validInteger("tx2","tx3")){
        //Good, now let me know if the current Proogram's
        // Initial Time is greater or equal than the last one.
        if(getNumber("tx2") >= temp){
            //Fill those tables
            fillTables("fifo","rr","srt");
            temp = getNumber("tx2");
            getElement("tx1").focus();
        } else{
            alert(MESSAGES.IT_GREATER_THAN_LAST);
        }
    } else{
        alert(MESSAGES.INTEGERS_ONLY);
    }
    clearText("tx1","tx2","tx3");
}

/**
 * Fills N tables with the Program's Name, Initial Time, and Time it takes to complete.
 */
function fillTables(){
    var prog = new Program( //Declare a new Program with
        getProgramName(),   //Name from text field
        getProgramTI(),     //Program's Initial Time.
        getProgramT()       //Program's Execution Time.
    );

    //Add said program to the variable Programs.
    programs.push(prog);

    //Do x action for every argument. In this case this means add the program
    //  declared above to every table in the method's parameters.
    for (var i = 0; i < arguments.length; i++) {
        var row = getElement(arguments[i]).insertRow();
        for(var a = 0; a < 7; a++){ row.insertCell(a); }

        //TODO This properly maybe?
        row.cells[0].innerHTML = prog.name;
        row.cells[1].innerHTML = prog.ti;
        row.cells[2].innerHTML = prog.t;
    }
}

/**
 * For now it just resets the clocks, and deciides if the round
 *  robin's table quantum is valid and then calls the magicians.
 */
function compute(){
    //TODO Change these for whenever user wants to exclude operations.
    if(validInteger("qc")){
        var q = getNumber("qc");
        FIFO("fifo");
        RR("rr", q);
        SRTF("srt");
        getElement("b3").disabled = false;
    } else{
        alert(MESSAGES.VALID_QUANTUM);
        clearText("qc");
    }
}

/**
 * Shortest Remaining Time First.
 *  This algorithm checks which programs can be executed,
 *  and which of those programs has the SRT.
 *
 * @param tableid HTML Table where every program info is shown
 * @constructor
 */
function SRTF(tableid){
    var t = getElement(tableid);
    var timer = 0, sum = 0;
    var srtProgs = JSON.parse(JSON.stringify(programs));

    //The sum of all Programs' Execution Time.
    for(var i = 0; i < srtProgs.length; i++){
        sum+= srtProgs[i].t;
    }

    while(sum > 0){
        var aux = [];
        //Auxiliary array where we'll insert
        // any programs to be executed.

        for(var j = 0; j < srtProgs.length; j++){
            //If the execution time is greater than zero
            // (Program is not finished) and it's Initial
            // Time of Execution is less than our current
            // timer's, it means it can be executed. Therefore,
            // insert the program into our auxiliary array.
            if(srtProgs[j].t > 0 && srtProgs[j].ti <= timer){
                aux.push(srtProgs[j]);
            }
        }

        //Return an array with every Program's t in aux.
        var times = aux.map( function(arr){ return arr.t} );
        //Lowest value of times array
        var lowest = Array.min(times);

        timer++; sum--;

        for(var k = 0; k < aux.length; k++){
            //If one of the programs has the lowest Execution Time,
            // do the following...
            if(aux[k].t == lowest){
                aux[k].tf = timer;
                aux[k].t--;
                break;
            }
        }
    }

    for(var h = 0; h < programs.length; h++){
        //Set every program's t to its initial value
        // and since we're done calculate the rest of their fields
        srtProgs[h].t = programs[h].t;
        srtProgs[h].T = srtProgs[h].tf - srtProgs[h].ti;
        srtProgs[h].E = srtProgs[h].T - srtProgs[h].t;
        srtProgs[h].I = (srtProgs[h].t / srtProgs[h].T).toFixed(2);
    }

    showResults(srtProgs,t);
}

/**
 * First In, First Out. Execute program, and then increase the clock
 * until it starts to create the next program. Simple as that.
 *
 * @param tableid Table to apply FIFO to.
 * @constructor
 */
function FIFO(tableid){
    var timer = 0;
    var fifoProgs = JSON.parse(JSON.stringify(programs));
    var t = getElement(tableid);
    //TODO Maybe make this even better
    for(var i = 0; i < fifoProgs.length; i++){
        while(timer < fifoProgs[i].ti){
            //Increase Timer until it is
            timer++; // the same as the current program.
        }
        fifoProgs[i].tf = timer + fifoProgs[i].t;
        fifoProgs[i].T = fifoProgs[i].tf - fifoProgs[i].ti;
        fifoProgs[i].E = fifoProgs[i].T - fifoProgs[i].t;
        fifoProgs[i].I = (fifoProgs[i].t / fifoProgs[i].T).toFixed(2);
        timer+= fifoProgs[i].t;
    }
    showResults(fifoProgs, t);
}

//TODO Check this
function RR(tableid, q){
    var timer = 0, sum = 0;
    var t = document.getElementById(tableid);
    var rrProgs = JSON.parse(JSON.stringify(programs));

    //Sum of every Program's t.
    for(var i = 0; i < rrProgs.length; i++){ sum+= rrProgs[i].t; }

    while(sum > 0){
        for(var j = 0; j < rrProgs.length; j++){
            //Increase timer until its time is the same as the next program.
            while(timer < rrProgs[j].ti){ timer++; }

            //If program's time is greater than zero and less
            // or equal to quantum...
            if(0 < rrProgs[j].t && rrProgs[j].t <= q){
                rrProgs[j].tf = timer + rrProgs[j].t;
                rrProgs[j].T = rrProgs[j].tf - rrProgs[j].ti;
                rrProgs[j].E = rrProgs[j].T - rrProgs[j].t;
                rrProgs[j].I = (rrProgs[j].t / rrProgs[j].T).toFixed(2);

                timer+= rrProgs[j].t;
                sum-= rrProgs[j].t;
                rrProgs[j].t = 0;
            }
            else if(rrProgs[j].t > 0){
                rrProgs[j].t-= q;
                timer+= q; sum-= q;
            }
        }
    }

    for(var p = 0; p < rrProgs.length; p++){
        rrProgs[p].t = programs[p].t;
    }
    showResults(rrProgs, t);
}

//TODO This entirely omg lol
function getRes(){
    var prom = 0;
    var table = document.getElementById("tabla");
    for (var j = 1, row; row = table.rows[j]; j++) {
        t1+=  parseInt(table.rows[j].cells[4].innerHTML);
        e1+=  parseInt(table.rows[j].cells[5].innerHTML);
        i1+=  parseFloat(table.rows[j].cells[6].innerHTML);
        prom++;
    }
    t1 =  parseFloat(t1) / parseFloat(prom);
    e1 =  parseFloat(e1) / parseFloat(prom);
    i1 =  parseFloat(i1) / parseFloat(prom);
    document.getElementById("results").innerHTML += '<br>Para FIFO: ' + '<br>T total: ' + t1.toFixed(2) + "<br>E Total:" + e1.toFixed(2) + "<br>I Total: "+ i1.toFixed(2) ;

    var table = document.getElementById("tabla2");
    for (var k = 1, r; r = table.rows[k]; k++) {
        t2+=  parseInt(table.rows[k].cells[4].innerHTML);
        e2+=  parseInt(table.rows[k].cells[5].innerHTML);
        i2+=  parseFloat(table.rows[k].cells[6].innerHTML);
    }
    t2 =  parseFloat(t2) / parseFloat(prom);
    e2 =  parseFloat(e2) / parseFloat(prom);
    i2 =  parseFloat(i2) / parseFloat(prom);
    document.getElementById("results").innerHTML += '<br>Para RR' + '<br>T total: ' + t2.toFixed(2) + "<br>E Total:" + e2.toFixed(2) + "<br>I Total: "+ i2.toFixed(2) ;
    document.getElementById("b3").disabled = true;

    if(i1 > i2){
        document.getElementById("results").innerHTML += '<br>FIFO es Mejor.';
    }
    else if(i1 == i2){
        if(e1 < e2){
            document.getElementById("results").innerHTML += '<br>FIFO es Mejor.';
        }
        else if(e1 == e2){
            if(t1 > t2){
                document.getElementById("results").innerHTML += '<br>FIFO es Mejor.';
            }
            else{
                document.getElementById("results").innerHTML += '<br>RR es Mejor.';
            }
        }
        else{
            document.getElementById("results").innerHTML += '<br>RR es Mejor.';
        }
    }
    else{
        document.getElementById("results").innerHTML += '<br>RR es Mejor.';
    }
}