import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";

const PriceRangeFilter = ({ min, max, onAfterChange }) => {
  const [values, setValues] = useState([min, max]);

  const handleSliderChange = (newValues) => {
    setValues(newValues);
  };

  return (
    <div className="price-range-filter">
      <div className="price-inputs">
        <span>${values[0]}</span>
        <span>${values[1]}</span>
      </div>
      <Slider
        range
        min={min}
        max={max}
        defaultValue={[min, max]}
        onChange={handleSliderChange}
        onAfterChange={onAfterChange}
        allowCross={false}
        trackStyle={{ backgroundColor: "var(--plum-accent)", height: 4 }}
        handleStyle={[
          {
            borderColor: "var(--plum-accent)",
            backgroundColor: "var(--plum-accent)",
            height: 14,
            width: 14,
          },
          {
            borderColor: "var(--plum-accent)",
            backgroundColor: "var(--plum-accent)",
            height: 14,
            width: 14,
          },
        ]}
        railStyle={{ backgroundColor: "var(--border-color)", height: 4 }}
      />
    </div>
  );
};

export default PriceRangeFilter;
