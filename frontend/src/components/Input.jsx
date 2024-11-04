import React from 'react'

const Input = ({type, value, onChange, placeholder}) => {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className='border-b bg-lightBorderColor  border-gray-400 focus:outline-none focus:border-blue-500
        h-10 pl-8 text-lg sm:text-lg md:text-xl m-2  w-full md:pl-[4rem] md:w-[25rem] '
    />
    </div>
  )
}

export default Input
