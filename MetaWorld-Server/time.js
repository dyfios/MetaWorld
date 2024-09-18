module.exports = function(context, secondsPerDay, updateFrequency) {
    setInterval(async function() {
        await context.db.GetAllRows("time", (rows) => {
            day = rows[0].day;
            seconds = rows[0].seconds;

            seconds += updateFrequency;
            if (seconds > secondsPerDay) {
                seconds -= secondsPerDay;
                day += 1;
            }
            
            context.db.UpdateInTable("time", { "day": day, "seconds": seconds });
        });
    }, updateFrequency * 1000);
}