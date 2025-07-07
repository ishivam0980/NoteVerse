import React from 'react'
import { useContext} from 'react'
import NoteContext from '../context/notes/noteContext'
import '../styles/AddNote.css'

export default function AddNote() {
    const context = useContext(NoteContext);
    const { addNote } = context;

    const [note, setNote] = React.useState({
        title: '',
        description: '',
        tag: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ title: '', description: '', tag: '' }); // Reset the form after submission
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.id]: e.target.value });
    }


    return (
        <div className="add-note-section">
            <div className="row justify-content-center">
                <div className="col-12">
                    <form className="add-note-card" onSubmit={handleSubmit}>
                        <header className="add-note-header">
                            <h5 className="add-note-title">Add a New Note</h5>
                        </header>
                        <div className="add-note-body">
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="title" 
                                    value={note.title} 
                                    placeholder="Enter note title" 
                                    required 
                                    onChange={onChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea 
                                    className="form-control" 
                                    id="description" 
                                    value={note.description} 
                                    rows="4" 
                                    placeholder="Enter note description" 
                                    required 
                                    onChange={onChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="tag" className="form-label">Tag</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="tag" 
                                    value={note.tag} 
                                    placeholder="Enter note tag" 
                                    onChange={onChange} 
                                />
                            </div>
                            <button type="submit" className="add-note-btn">Add Note</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
