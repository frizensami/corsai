

// Function to check if a string is found within an array
// Returns True if needle is found within the haystack and False if it is not found
function WithinArray(needle, arrhaystack) {
	return (arrhaystack.indexOf(needle) > -1);
}


function CheckTimetableClash(TimeSlots) {
	// This timetable will take in integers that show times in which there are lessons. If a lesson is from 0800-1000, it will be displayed as
	// [0800, 0900]. 1000 is not included in the timetable because 1000-1100 is free.
	var Timetable = {Monday: [],
					Tuesday: [],
					Wednesday: [],
					Thursday: [],
					Friday: []};
	for (var i = 0; i < TimeSlots.length; i++)
	{
		var TimeToPush = parseInt(TimeSlots[i]["StartTime"])
		// Check if the time to add into the timetable is already within the timetable
		if (WithinArray(TimeToPush, Timetable[TimeSlots[i]["DayText"]])) 
		{
// Remember to add in the code that allows you to check if the clashing courses are on Even and Odd weeks
// Note by Sriram: just remembered, this doesn't matter because if it clashes on one week, it's already not viable
			return true;
		}
		else 
		{
			while (TimeToPush < parseInt(TimeSlots[i]["EndTime"])) 
			{
				Timetable[TimeSlots[i]["DayText"]].push(TimeToPush);
				TimeToPush += 100;
			}
		}
	}
	return Timetable;
}


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
                        timetable[i]["ModuleCode"] = module["ModuleCode"];
                        timetable[i]["ExamDate"] = module["ExamDate"];

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

        //permutate all possible combinations within the module

        var allPermutations = cartesian.apply(this, overallLessonTypeModList);
        //console.log("All permutations: ");
        //console.log(allPermutations);



        return allPermutations;
}

//helper function from stackOf to permutate an array of arrays
function cartesian() {
        var r = [], arg = arguments, max = arg.length-1;

        ////console.log("Cartesian Arguments: ");
        ////console.log(arg);

        function helper(arr, i){ 
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

//non recursive array flattener
function flatten(array, mutable) {
        var toString = Object.prototype.toString;
        var arrayTypeStr = '[object Array]';

        var result = [];
        var nodes = (mutable && array) || array.slice();
        var node;

        if (!array.length) {
                return result;
        }

        node = nodes.pop();

        do {
                if (toString.call(node) === arrayTypeStr) {
                        nodes.push.apply(nodes, node);
                } else {
                        result.push(node);
                }
        } while (nodes.length && (node = nodes.pop()) !== undefined);

        result.reverse(); // we reverse result to restore the original order
        return result;
}

function eliminateIntermediates(intermediate)
{
        //TODO: add exam date clash

        var workingCopy = intermediate;
        var numClash = 0;
        console.log("Incoming Length: " + workingCopy.length);
        for (var i = 0; i < workingCopy.length; i++)
        {
                var tbClash = CheckTimetableClash(flatten(workingCopy[i]));
                // console.log("Flattened copy for analysis: ")
                // console.log(flatten(workingCopy[i]));
                if (tbClash == true)
                {
                        workingCopy.splice(i, 1);
                        i--;

                        numClash++;
                }
                else
                {
                        //TODO!
                        //       var examClash = CheckExamDates(flatten  
                }


        }
        console.log("Outgoing length: " + workingCopy.length);
        console.log("Number of clashes: ");
        console.log(numClash);
        return workingCopy;
}

//generate a list of all possible timetable configurations given the input list to be used for computation
function buildTimetablePermutationList(computationList)
{
        var timetablePermutationList = [];

        for (var i = 0; i < computationList.length; i++)
        {
                var permutationList = buildTimetablePermutationsForModule(computationList[i]);
                timetablePermutationList.push(permutationList);
        }
        //console.log("TIMETABLE PERMUTATIONS LIST: ");
        //console.log(timetablePermutationList);

        //permutate all
        var intermediate = [];

        for (var i = 0; i < timetablePermutationList.length - 1; i++)
        {
                if (i == 0)
                {
                        var intermediate  = cartesian.apply(this, timetablePermutationList.slice(0, 2));
                }
                else
                {
                        var intermediate = cartesian(intermediate, timetablePermutationList[i+1]);
                }


                //console.log("Flattened | Unflattened");


                //console.log(flatten(intermediate), intermediate);


                intermediate = eliminateIntermediates(intermediate);

                //console.log("Intermediate after flatten and removal: ");
                //console.log(intermediate);
        }     

        //intermediate = cartesian.apply(this, timetablePermutationList);
        var allModulesPermutations = intermediate;
        //console.log("All calculated permutations: ");
        //console.log(allModulesPermutations); 

        return allModulesPermutations;


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
                        timetable[i]["ModuleCode"] = module["ModuleCode"];
                        timetable[i]["ExamDate"] = module["ExamDate"];

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

        //permutate all possible combinations within the module

        var allPermutations = cartesian.apply(this, overallLessonTypeModList);
        //console.log("All permutations: ");
        //console.log(allPermutations);



        return allPermutations;
}

//helper function from stackOf to permutate an array of arrays
function cartesian() {
        var r = [], arg = arguments, max = arg.length-1;

        ////console.log("Cartesian Arguments: ");
        ////console.log(arg);

        function helper(arr, i){ 
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

//non recursive array flattener
function flatten(array, mutable) {
        var toString = Object.prototype.toString;
        var arrayTypeStr = '[object Array]';

        var result = [];
        var nodes = (mutable && array) || array.slice();
        var node;

        if (!array.length) {
                return result;
        }

        node = nodes.pop();

        do {
                if (toString.call(node) === arrayTypeStr) {
                        nodes.push.apply(nodes, node);
                } else {
                        result.push(node);
                }
        } while (nodes.length && (node = nodes.pop()) !== undefined);

        result.reverse(); // we reverse result to restore the original order
        return result;
}

function eliminateIntermediates(intermediate)
{
        //TODO: add exam date clash

        var workingCopy = intermediate;
        var numClash = 0;
        console.log("Incoming Length: " + workingCopy.length);
        for (var i = 0; i < workingCopy.length; i++)
        {
                var tbClash = CheckTimetableClash(flatten(workingCopy[i]));
                // console.log("Flattened copy for analysis: ")
                // console.log(flatten(workingCopy[i]));
                if (tbClash == true)
                {
                        workingCopy.splice(i, 1);
                        i--;

                        numClash++;
                }
                else
                {
                        //TODO!
                        //       var examClash = CheckExamDates(flatten  
                }
                
                //say something every once in a while, would ya?
                if (i % 1000 == 0)
                {
                    console.log("Processed " + i + " cases out of " + workingCopy.length);
                }


        }
        console.log("Outgoing length: " + workingCopy.length);
        console.log("Number of clashes: ");
        console.log(numClash);
        return workingCopy;
}

//generate a list of all possible timetable configurations given the input list to be used for computation
function buildTimetablePermutationList(computationList)
{
        var timetablePermutationList = [];

        for (var i = 0; i < computationList.length; i++)
        {
                var permutationList = buildTimetablePermutationsForModule(computationList[i]);
                timetablePermutationList.push(permutationList);
        }
        //console.log("TIMETABLE PERMUTATIONS LIST: ");
        //console.log(timetablePermutationList);

        //permutate all
        var intermediate = [];

        for (var i = 0; i < timetablePermutationList.length - 1; i++)
        {
                if (i == 0)
                {
                        var intermediate  = cartesian.apply(this, timetablePermutationList.slice(0, 2));
                }
                else
                {
                        var intermediate = cartesian(intermediate, timetablePermutationList[i+1]);
                }


                //console.log("Flattened | Unflattened");


                //console.log(flatten(intermediate), intermediate);


                intermediate = eliminateIntermediates(intermediate);

                //console.log("Intermediate after flatten and removal: ");
                //console.log(intermediate);
        }     

        //intermediate = cartesian.apply(this, timetablePermutationList);
        var allModulesPermutations = intermediate;
        //console.log("All calculated permutations: ");
        //console.log(allModulesPermutations); 

        return allModulesPermutations;


}

self.addEventListener('message', function(e){
    console.log("buildTTLP-worker started!");
    var computationList = e.data;

    var allPermutations = buildTimetablePermutationList(computationList);
    console.log("Worker Ended!");
    self.postMessage(allPermutations);

});
