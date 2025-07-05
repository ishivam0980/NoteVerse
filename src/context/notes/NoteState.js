import React, { useState, useContext } from 'react';
import NoteContext from './noteContext';
import AuthContext from '../auth/authContext';
import axios from 'axios';

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);
  
  // Get token from AuthContext
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  // Get all notes
  const getNotes = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${host}/api/notes/fetchallnotes`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      const message = error.response?.data?.message || "Failed to fetch notes";
      props.showAlert(message, "danger");
    }
  };

  // Add note
  const addNote = async (title, description, tag) => {
    if (!token) return;

    try {
      const response = await axios.post(`${host}/api/notes/addnote`, {
        title,
        description,
        tag
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setNotes(notes.concat(response.data.note));
      props.showAlert("Note added successfully", "success");
    } catch (error) {
      console.error('Error adding note:', error);
      const message = error.response?.data?.message || "Failed to add note";
      props.showAlert(message, "danger");
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`${host}/api/notes/deletenote/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const newNotes = notes.filter(note => note._id !== id);
      setNotes(newNotes);
      props.showAlert("Note deleted successfully", "success");
    } catch (error) {
      console.error('Error deleting note:', error);
      const message = error.response?.data?.message || "Failed to delete note";
      props.showAlert(message, "danger");
    }
  };

  // Edit note
  const editNote = async (id, title, description, tag) => {
    if (!token) return;

    try {
      const response = await axios.put(`${host}/api/notes/updatenote/${id}`, {
        title,
        description,
        tag
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedNotes = notes.map(note => 
        note._id === id ? response.data.note : note
      );
      setNotes(updatedNotes);
      props.showAlert("Note updated successfully", "success");
    } catch (error) {
      console.error('Error updating note:', error);
      const message = error.response?.data?.message || "Failed to update note";
      props.showAlert(message, "danger");
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;