import React from 'react'
import { useContext, useEffect } from 'react'
import NoteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem'
import '../styles/Notes.css'
import AddNote from './AddNote'

export default function Notes() {
  const context = useContext(NoteContext);
  const { notes, getNotes} = context;

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <AddNote />
      <div className="container-fluid notes-container py-4">
        <div className="row mb-4">
          <div className="col">
            <h2 className="text-center mb-4 notes-title">Your Notes</h2>
            {notes.length === 0 && (
              <div className="text-center mt-5">
                <div className="alert alert-info" role="alert">
                  <h4 className="alert-heading">No notes yet!</h4>
                  <p>Start creating your first note to see it here.</p>
                </div>
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
