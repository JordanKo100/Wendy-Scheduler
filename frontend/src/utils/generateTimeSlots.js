export default function generateTimeSlots() {
    const slots = [];
    
    // 11 to 17 (which represents the 5:00 PM to 6:00 PM slot)
    for (let hour = 11; hour < 18; hour++) {
        // We iterate twice per hour: once for 0 minutes, once for 30 minutes
        for (let minutes of [0, 30]) {
            
            // 1. Calculate Start Time
            const startHour = hour % 12 === 0 ? 12 : hour % 12;
            const startPeriod = hour < 12 ? "AM" : "PM";
            const startMin = minutes === 0 ? "00" : "30";

            // 2. Calculate End Time (30 minutes later)
            let endHourRaw = hour;
            let endMinRaw = minutes + 30;

            if (endMinRaw === 60) {
                endHourRaw++;
                endMinRaw = 0;
            }

            const endHour = endHourRaw % 12 === 0 ? 12 : endHourRaw % 12;
            const endPeriod = endHourRaw < 12 ? "AM" : "PM";
            const endMin = endMinRaw === 0 ? "00" : "30";

            slots.push(`${startHour}:${startMin} ${startPeriod} - ${endHour}:${endMin} ${endPeriod}`);
        }
    }

    return slots;
}