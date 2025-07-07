
import React from 'react'
import AddNote from './AddNote'
import Notes from '../components/Notes'
import '../styles/Home.css'

export default function Home() {
  return (
    <div className="main-container">
      <div className="page-wrapper">
        <AddNote />
        <Notes />
      </div>
    </div>
  )
}
