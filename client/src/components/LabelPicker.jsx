import "./LabelPicker.css";

// Static label picker — just displays label buttons for now.
// No click logic yet; that gets wired up next sprint.
function LabelPicker() {
  const labels = ["Positive", "Negative", "Cat", "Dog"];

  return (
    <div className="label-picker">
      {labels.map((label) => (
        <button key={label} className="label-picker__button" type="button">
          {label}
        </button>
      ))}
    </div>
  );
}

export default LabelPicker;