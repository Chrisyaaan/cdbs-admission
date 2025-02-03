import React from 'react'
import cn from "classnames"

const InputSelect = ({ label, name, value, onChange, options, required = false, defaultText= "Select...", isAddress=false, isSlotCheck= false, className="", ...rest }) => (
  <div className={cn("mb-4 flex-grow flex flex-col w-full", className)}>
    <label htmlFor={name} className="block text-[0.8rem] font-medium lg:text-[1.75rem] lg:font-bold text-gray">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
      // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      className='w-full py-[1rem] px-[2rem] rounded-[10px] border block text-[1rem] lg:text-[1.75rem]'
    >
      <option value="">{defaultText}</option>
      {options.map((option, idx) => (
        <option key={idx} value={isAddress ? option.value : option}>
          { isAddress ? option.label : option}
        </option>
      ))}
    </select>
  </div>
);

export default InputSelect