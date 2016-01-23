var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
function day_to_num(day) {
	return days.indexOf(day);
}

/* Main function.
 *
 */

function produce_timetable(array_of_array_of_mod_objs, constraints_object) {

	var perms_threshold = 1000000; 

	// This timetable_array is a 2d array. The array itself consists of 5 elements which consist of the days of the week. Each day consists of an array, which is filled with true if the timeslot is filled.
	// For example, if Monday 8am and 10am is filled it will be [[true, undefined, true, ...], ...]
	var timetable_array = new Array([]);
	
	function remove_clashes(the_array) {
		var num_of_mods = the_array.length;
		for (var i = 0; i < num_of_mods; i++) {
			var times = the_array[i].Timetable;
			for (var j = 0; j < times.length; j++) {
				var day = j.DayText;
				var day_index = day_to_num(day);
				var start = j.StartTime;
				var end = j.EndTime;
				for (var k = start; k < end; k += 100) {
					var time_to_index = k / 100 - 8;
					if (typeof timetable_array[day_index][time_to_index] !== undefined) {
						times.splice(j, 1);
					}
				}
			}
		}
		return the_array;
	}

	var exam_dates = array_of_array_of_mod_objs.map(function(array_of_mods) {
		return array_of_mods.ExamDate;
	});
	var exam_date_without_dups = exam_dates.reduce(function(prev, cur, index, arr) {
		if (prev.indexOf(cur) === -1) {
			prev.push(cur);
		}
	}, []);
	if (exam_dates.length !== exam_date_without_dups.length) {
		console.log("Exam clash!");
		return false;
	} else {
		if (calculate_possibilities(array_of_array_of_mod_objs) <= perms_threshold) {
			console.log("BRUTEFORCE");	
		} else {
			array_of_array_of_mod_objs = remove_clashes(array_of_array_of_mod_objs);
			array_of_array_of_mod_objs.sort(function(mod1, mod2) {
				return mod1.Timetable.length - mod2.Timetable.length;
			});
		}
	}
	return array_of_array_of_mod_objs;
}

/* calculate_possibilities
 * Checks the number of possibilities (permutations) in the array of array of mod objs.
 */
function calculate_possibilities(array_of_array_of_mod_objs) {
	var each_perms = array_of_array_of_mod_objs.map(function(array_of_mods) {
		return array_of_mods.Timetable.length();
	});
	var product_of_lengths = each_perms.reduce(function(prev, cur, index, arr) {
		return prev * cur;
	});
	return product_of_lengths;
}

/* has_no_clashes 
 * Checks if the array of module objects (array_of_mod_objs) has timetable clashes.
 * Returns: true, if there are no clashes. Else, false.
 * Method: for each module in the array, add it to the timetable_array. The timetable_array is a 2D array; it is an array of days, and each day contains an array of times.
 * If the slot is filled (type is not undefined), it will return false. If all mods pass, return true.
 */
function has_no_clashes(array_of_mod_objs) {
	var timetable_array = new Array([]);
	var len = array_of_mod_objs.length;

	for (var i = 0; i <= len; i++) {
		var module = array_of_mod_objs[i];
		var times = module.Timings;
		var times_length = times.length;
		for (var i = 0; i < times_length; i++) {
			var timing = times[i];
			var day = timing.DayText;
			var day_index = day_to_num(day);
			var start = timing.StartTime;
			var end = timing.EndTime;
			for (var time = start; time < end; time += 100) {
				var short_time = time / 100 - 8;
				var slot = timetable_array[day_index][short_time];
				if (typeof slot === "undefined") {
					slot = true;
				} else {
					return false;
				}
			}
		}
		return true;
	}
}
