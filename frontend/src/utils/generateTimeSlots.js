export default function generateTimeSlots(){
    const slots = [];
    for (let hour = 9; hour < 21; hour++){
        const startHour = hour % 12 === 0 ? 12 : hour % 12;
        const startPeriod = hour < 12 ? "AM" : "PM";

        const endHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
        const endPeriod = (hour + 1) < 12 ? "AM" : "PM";

        slots.push(`${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`);
    }
    
    return slots;
}