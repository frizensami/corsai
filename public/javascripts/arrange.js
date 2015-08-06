var currentYear = "2015-2016";


//util function to access get elements
function get(name)
{
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
                return decodeURIComponent(name[1]);
}

//creates the api link to get the required module
function buildModuleRequest(year, semester, moduleCode)
{
        return "http://api.nusmods.com/" + year + "/" + semester + "/modules/" + moduleCode + ".json";
}

//util function to remove whitespace
function removeWhitespace(value)
{
        return value.replace(/ /g,'');
}

//builds the required output list of module info to use for computation
function buildComputationList(moduleJsonList)
{
        var computationList = [];

        for (var i = 0; i < moduleJsonList.length; i++)
        {
                var computationListModule = {};

                computationListModule["ModuleCode"] = moduleJsonList[i]["ModuleCode"];

                computationListModule["Timetable"] = moduleJsonList[i]["Timetable"];            

                computationListModule["ExamDate"] =  moduleJsonList[i]["ExamDate"];


                computationList.push(computationListModule);
                //console.log(moduleJsonList[i]["Timetable"]);
        }


        return computationList;
}

//get all timetable permutations for a single module (w timetable, modulecode & examdate)
//assumption --> no multiple timetable so no need to permutate that
function buildTimetablePermutationsForModule(module)
{
        //first step: split module timetable dictionary into a list of lists of dicts
        //have a internal list of all lesson types in the current module
        // List 1 - first lesson type: [ 
        var timetable = module["Timetable"]; 
        var currentLessonType = timetable[0]["LessonType"]; //We assume that the timetable lesson types are in order, all of X type first, then Y type next, no mixing. Put the current lesson type as the first one to stop edge cases
        var overallLessonTypeModList = [];
        var currentLessonTypeModList = [];
        var currentClassNumber = "" //group class number timeslots w same timetable lessontype together
        for (var i = 0; i < timetable.length; i++)
        {
                if (timetable[i]["LessonType"] != currentLessonType)
                {
                        //reset the current lesson type and push the timetable list to the overall list
                        currentLessonType = timetable[i]["LessonType"];
                        overallLessonTypeModList.push(currentLessonTypeModList);

                        //clear and push first mod of new type
                        currentLessonTypeModList = [];
                        currentLessonTypeModList.push(timetable[i]);

                        //clear the class number as we have gone over to a new lesson type
                        currentClassNumber = "";
                }
                else
                {
                        //if the objects are of the same lesson type, and their class numbers are the same, they have to be taken tgt.
                        //Therefore check if the current and prev class nums are the same, if so, take the last element, make it an array if necessary
                        //and append the current timetable slot thing to that element
                        var thisClassNumber = timetable[i]["ClassNo"];
                        if (currentClassNumber != thisClassNumber)
                        {    
                            currentLessonTypeModList.push(timetable[i]);
                            currentClassNumber = thisClassNumber;
                        }
                        else
                        {
                            var lastElement = currentLessonTypeModList[currentLessonTypeModList.length - 1];
                            
                            //check if it already was an array - basically if we have added stuff to it before
                            if (Object.prototype.toString.call(lastElement) === '[object Array]')
                            {
                                    //ok object is an array, we can just append
                                    currentLessonTypeModList[currentLessonTypeModList.length - 1].push(timetable[i]);

                            }
                            else //not already an array, we have to make an array in the last element and add
                            {
                                    var newArray = [];
                                    newArray.push(currentLessonTypeModList[currentLessonTypeModList.length - 1]); //push last element
                                    newArray.push(timetable[i]); //push newest timetable slot

                                    currentLessonTypeModList[currentLessonTypeModList.length - 1] = newArray; //replace last element w array

                            }
                        }
                }
        }
        //last push for modules that haven't been added
        overallLessonTypeModList.push(currentLessonTypeModList);


        //logging
        console.log("Overall LessonType Mod List for Module " + module["ModuleCode"] + ": ");
        console.log(overallLessonTypeModList);

        //permutate
        //var allPermutations = allPossibleCases(overallLessonTypeModList);
        var allPermutations = cartesian.apply(this, overallLessonTypeModList);
        // allPermutations = Combinatorics.cartesianProduct(overallLessonTypeModList[0]);
        console.log("All permutations: ");
        console.log(allPermutations);

}

//helper function from stackOf to permutate an array of arrays
function cartesian() {
        var r = [], arg = arguments, max = arg.length-1;
        function helper(arr, i) {
                for (var j=0, l=arg[i].length; j<l; j++) {
                        var a = arr.slice(0); // clone arr
                        a.push(arg[i][j]);
                        if (i==max)
                                r.push(a);
                        else
                                helper(a, i+1);
                }
        }
        helper([], 0);
        return r;
}

function allPossibleCases(arr) {
        if (arr.length === 0) {
                return [];
        } 
        else if (arr.length ===1){
                return arr[0];
        }
        else {
                var result = [];
                var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
                for (var c in allCasesOfRest) {
                        for (var i = 0; i < arr[0].length; i++) {
                                result.push(arr[0][i] + "," +  allCasesOfRest[c]);
                        }
                }
                return result;
        }

}



//generate a list of all possible timetable configurations given the input list to be used for computation
function buildTimetablePermutationList(computationList)
{
        var timetablePermutationList = [];

        for (var i = 0; i < computationList.length; i++)
        {
                var permutationList = buildTimetablePermutationsForModule(computationList[i]);
        }


}


//---------------------------MAIN START-----------------------//

//use get request function from above to access get request header
var year = get ('year');
var semester = get('semester');
var modules = get('modules');


//check for missing get info
if (semester == null || modules == null)
{
        throw new Error("Either semester info or module info is missing!");
}

//set year to current if no year present in get
if (year == null)
{
        year = currentYear;
        console.log("Year corrected");
}

console.log("Year: " + year + " Sem: " + semester + " Mods: " + modules);

//split modules by comma delim and convert to uppercase as required
var moduleList = removeWhitespace(modules).toUpperCase().split(",");
console.log("Module List: " + moduleList);

var moduleJsonList = [];

//build the list containing json info for all modules selected
//using jquery
$.each(moduleList, function(i, item){

        var moduleRequest = buildModuleRequest(year, semester, moduleList[i]);
        console.log("Module Request: " + moduleRequest);
        $.getJSON(moduleRequest, function(data){
                moduleJsonList.push(data);    
                //console.log(moduleJsonList);

        });
        //console.log(buildModuleRequest(year, semester, moduleList[i]));

});


//run a function often to check for completion of json retrieval. Deregister it if done.
completionChecker = setInterval(function()
                {
                        //check if all modules are loaded

                        if (moduleJsonList.length == moduleList.length)
{
        window.clearInterval(completionChecker);
        var computationList = buildComputationList(moduleJsonList);
        console.log("Computation List: ");
        console.log(computationList);
        //carry on with rest of program
        //this is the new main executing point

        var timetablePermutationList = buildTimetablePermutationList(computationList);
}
},1);

//-------------------MAIN END-------------------------------//


/*
   var url = "http://api.nusmods.com/2014-2015/2/modules/FE5218.json";
   console.log("Attempting retrieval of module data");
   request({
   url: url,
   json: true
   }, function (error, response, body) {

   if (!error && response.statusCode === 200) {
   console.log(body) // Print the json response
   }
   });
   */


