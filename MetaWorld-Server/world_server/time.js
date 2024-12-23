module.exports = function(context, timeGetFunction, timeSetFunction, secondsPerDay, updateFrequency) {
    setInterval(async function() {
        timeGetFunction(context, (row) => {
            if (row == null) {
                day = 0;
                seconds = 0;
            }
            else {
                day = row.day;
                seconds = row.seconds;

                seconds += updateFrequency;
                if (seconds > secondsPerDay) {
                    seconds -= secondsPerDay;
                    day += 1;
                }
            }
            timeSetFunction(context, day, seconds);
        })
    }, updateFrequency * 1000);
}