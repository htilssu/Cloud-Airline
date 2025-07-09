import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../pages/HomePage.datepicker.css';

export interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const UIDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholder,
  disabled,
  className = '',
}) => {
  return (
    <div className={`custom-datepicker ${className}`}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-base"
        popperPlacement="bottom"
      />
    </div>
  );
};

export default UIDatePicker;
