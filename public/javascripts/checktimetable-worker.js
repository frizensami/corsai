
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

self.addEventListener('message', function(e){
    console.log("Worker Started!");    
    //copy the working copy from the message args
    var workingCopy = e.data;
    var numClashes = 0;
    
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
    console.log("Number of Clashes: " + numClashes);
    console.log("Worker Ended!");
    //message the copy back
    self.postMessage(workingCopy);









});
