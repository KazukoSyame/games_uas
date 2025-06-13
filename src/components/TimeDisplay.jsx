const TimeDisplay = ({ day, dayCount, time }) => {
  return (
    <div className="time-display">
      {day} | Day {dayCount} | {time}
    </div>
  );
};

export default TimeDisplay;