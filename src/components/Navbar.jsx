import React from 'react'

export default function Navbar() {
  return (
    <nav className="flex justify-between w-full p-4 h-4 bg-black text-white">
  <h1 className=" text-4xl font-medium underline underline-offset-[10px]"style={{ color: 'rgb(206 255 252)' }}>Pomodoro </h1>
  <div className="flex justify-center pr-11 pb-11 mt-8" style={{ color: 'rgb(255 173 212)' }}>
      <a className="mr-4" href="https://github.com/piyushbaibhav" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <a className="mr-4" href="https://www.linkedin.com/in/piyushbaibhav/" target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a href="https://github.com/piyushbaibhav/Pomodoro" target="_blank" rel="noopener noreferrer">
        Fork
      </a>
    </div>
</nav>
  )
}
