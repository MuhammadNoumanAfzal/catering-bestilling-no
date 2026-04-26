import TimePicker from "react-time-picker";
import { FiClock } from "react-icons/fi";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function PreferredTimePicker({
  value,
  onChange,
}) {
  return (
    <div className="preferred-time-picker">
      <TimePicker
        amPm
        clearIcon={null}
        clockIcon={<FiClock className="text-[16px]" />}
        disableClock
        format="h:mm a"
        hourPlaceholder="--"
        minutePlaceholder="--"
        onChange={(nextValue) => onChange(nextValue ?? "")}
        value={value || null}
      />
    </div>
  );
}
