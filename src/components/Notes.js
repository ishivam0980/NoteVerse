import React from 'react'
import { useContext, useEffect } from 'react'
import NoteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem'
import '../styles/Notes.css'

export default function Notes() {
  const context = useContext(NoteContext);
  const { notes, getNotes} = context;

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <div className="notes-container">
        <div className="row mb-4">
          <div className="col">
            <h2 className="notes-title text-center">Your Notes</h2>
            {notes.length === 0 && (
              <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">No notes yet!</h4>
                <p>Start creating your first note to see it here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="row g-4">
          {notes.map((note) => {
            return (
              <NoteItem key={note._id} note={note} />
            )
          })}
        </div>
      </div>
    </>
  )
}
