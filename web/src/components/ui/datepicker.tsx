import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../pages/HomePage.datepicker.css';


import { DatePickerProps as ReactDatePickerProps } from 'react-datepicker';

export interface DatePickerProps extends Omit<ReactDatePickerProps, 'selected' | 'onChange' | 'minDate' | 'maxDate' | 'placeholderText' | 'disabled' | 'className'> {
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
  ...rest
}) => {
  return (
    <div className={`custom-datepicker ${className}`}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        disabled={disabled}
        className={`w-full h-12 pr-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-base ${rest.showTimeSelect ? '' : 'pl-10'}`}
        popperPlacement="bottom"
        dateFormat={rest.dateFormat || "dd/MM/yyyy"}
        {...rest}
      />
    </div>
  );
};

export default UIDatePicker;
