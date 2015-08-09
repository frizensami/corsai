

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

//ugh, globals
var numCasesPerWorker = 500;

//calculate the required number of workers with ref to incoming working copy length
function calculateNumWorkers(wcLength)
{
        if (wcLength < numCasesPerWorker)
        {
                return 1;
        }
        else
        {
                
                return wcLength / numCasesPerWorker;
        }
}

//ugh more globals
var numReturnedWorkers = 0;
var numWorkers = 0;
var returnWorkingCopy = [];
self.addEventListener('message', function(e){
    console.log("Worker Started!");    
  
    //copy the working copy from the message args
    var workingCopy = e.data;
    
    //var numClashes = 0;
    numWorkers = calculateNumWorkers(workingCopy.length);

    console.log("Working copy length - " + workingCopy.length);
    for (var i = 0; i < numWorkers; i++)
    {
            //start a new worker for each worker required, set their even listener
            var bobTheBuilder = new Worker('/checktimetable-slave');
            bobTheBuilder.addEventListener('message', function(e){

                    console.log("Worker said: " + e.data);
                    returnWorkingCopy.concat(e.data); //concatenate the arrays together
                    numReturnedWorkers++;
                    //the last worker has to be the one to end this function
                    if (numReturnedWorkers == numWorkers)
                    {
                            //end the function - return
                            self.postMessage(returnWorkingCopy);
                    }
            
            }. false);

            //TODO check for doublecounting/overlap
            if (i < workingCopy.length - 1)
                worker.postMessage(workingCopy.slice(i*numCasesPerWorker, numCasesPerWorker); //give selected cases to workers
            else
                worker.postMessage(workingCopy.slice(i*numCasesPerWorker)); //give all the rest of the cases to last worker
            
    }
    /*

    //work on the copy
    for (var i = 0; i < workingCopy.length; i++)
    {
        var isClash = CheckTimetableClash(workingCopy[i]);
        if (isClash === true)
        {
            workingCopy.splice(i, 1);
            i--;
            numClashes++;
        }     
    }
    */
    /*
    console.log("Number of Clashes: " + numClashes);
    console.log("Worker Ended!");
    //message the copy back
    self.postMessage(workingCopy);
*/








});
