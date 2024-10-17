module.exports = function(context, secondsPerDay, updateFrequency) {
    setInterval(async function() {
        await context.db.GetAllRows("time", (rows) => {
            if (rows == null) {
                day = 0;
                seconds = 0;
            }
            else {
                day = rows[0].day;
                seconds = rows[0].seconds;

                seconds += updateFrequency;
                if (seconds > secondsPerDay) {
                    seconds -= secondsPerDay;
                    day += 1;
                }
            }
            context.db.UpdateInTable("time", { "day": day, "seconds": seconds });
        });
    }, updateFrequency * 1000);
}