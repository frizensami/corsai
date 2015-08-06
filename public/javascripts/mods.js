// Variables
var reject = false

var TimeSlots = [{name: "Timeslot1", DayText: "Wednesday", StartTime: "0000", EndTime: "0200"},
				{name: "Timeslot2", DayText: "Wednesday", StartTime: "0400", EndTime: "0600"},
				{name: "Timeslot3", DayText: "Wednesday", StartTime: "0600", EndTime: "0800"},
				{name: "Timeslot4", DayText: "Wednesday", StartTime: "0800", EndTime: "0900"},
				{name: "Timeslot5", DayText: "Wednesday", StartTime: "2200", EndTime: "2400"},
				{name: "Timeslot6", DayText: "Tuesday", StartTime: "1100", EndTime: "1900"}
				]
// Take note of the function checkExamDate which requires the dictionary within examDates to be "examDate"
var ExamDates = [{module: "CS1101S", ExamDate: "2015-11-26T17:00+0800"},
				{module: "CS1231", ExamDate: "2015-11-25T17:00+0800"},
				{module: "MA1521", ExamDate: "2015-12-01T09:00+0800"},
				{module: "MA1521", ExamDate: "2015-12-01T11:00+0800"}]
				
// Function to check if a string is found within an array
// Returns True if needle is found within the haystack and False if it is not found
function WithinArray(needle, arrhaystack) {
	return (arrhaystack.indexOf(needle) > -1);
}

// Function to check the list "ExamDates" and make sure the exam dates do not clash
// Looping through each date within ExamDates to make sure the Dates don't clash and if the dates do clash, make sure the timings are at least 3h apart.
// Return False if there are no clashes, and True if there are clashes
function CheckExamDates(ExamDates) {
	for (var i = 0; i < ExamDates.length; i++)
	{
// CHECK FOR UNDEFINED CASE
		for (var j = 0; j < ExamDates.length; j++)
		{
			if (j == i)
			{
				continue;
			}
			// Check if the dates clash, just continue if they don't
			// Slice is hard-coded based on the assumption that ExamDates will remain in ISO8601 format
			else if (ExamDates[i]["ExamDate"].slice(0,10) == ExamDates[j]["ExamDate"].slice(0,10))
			{
				// If the dates are the same and if the timings are too close to one another (3 hours)
				if (Math.abs(ExamDates[i]["ExamDate"].slice(11,13) - ExamDates[j]["ExamDate"].slice(11,13)) < 3)
				{
					return true
				}
			}				
		}
	}
	return false
}

// Function to check the list "Timeslots" and make sure the time slots do not clash
// Looping through each TimeSlot and adding to the Timetable dictionary, making sure there are no clashes
// Return False if there are no clashes, and True if there are clashes
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
			//console.log(Timetable)
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
	return Timetable
}

var Timetable = CheckTimetableClash(TimeSlots);

console.log(Timetable["Monday"])
console.log(Timetable["Tuesday"])
console.log(Timetable["Wednesday"])
console.log(Timetable["Thursday"])
console.log(Timetable["Friday"])

var Weight = 40;
var score;	

function CheckLunchSlot (Timetable3, weight) {
	
	var count = 0;
	// scoreModifier modifies the weightage of the score in proportion to the number of days that have lessons. e.g. 20, 25, 33, 50
	var scoreModifier = 0;
	var scoreMultiplier = 0;
	var lunchSlots = [1100, 1200, 1300];
	
	for (var day in Timetable3) {
		if (Timetable3[day].length == 0)
			scoreModifier += 1;
	}

	for (var day in Timetable3) {
		if (Timetable3[day].length != 0) {
			for (var a = 0; a < Timetable3[day].length; a++){
				//if all 3 timeslots are filled 
				for (var b = 0; b < lunchSlots.length; b++) {
					if (Timetable3[day][a] == lunchSlots[b])
						count += 1;
				}
			}
			if (count != 3)
				scoreMultiplier += (100/(5 - scoreModifier));
			count = 0;
		}
	}

	score = scoreMultiplier * (weight / 100);
	return console.log(score);
	
}
CheckLunchSlot (Timetable, Weight);
