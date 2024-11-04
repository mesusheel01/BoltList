import React from 'react'

const Button = ({
     navigate,routeTo
}) => {

  return (
    <div>
        <button onClick={()=> {
             navigate(routeTo)}}
             className=' border-2 border-transparent sm:p-2 sm:px-6 lg:p-2 lg:px-6 p-[.4rem] px-4
             bg-lightAccent dark:bg-darkAccent
             text-darkPrimary dark:text-lightPrimary
             hover:bg-lightPrimary hover:text-darkAccent

        rounded-full font-mono
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        transform hover:-translate-y-1 hover:scale-100'
        >
            {routeTo}
        </button>
    </div>
  )
}

export default Button
