import React from 'react'
import { useContext} from 'react'
import NoteContext from '../context/notes/noteContext'

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
        <div>
            <section className="row justify-content-center mb-4">
                <form className="col-md-8 col-lg-6 card shadow-sm" onSubmit={handleSubmit}>
                    <header className="card-header bg-dark text-white">
                        <h5 className="card-title mb-0">Add a New Note</h5>
                    </header>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label" >Title</label>
                            <input type="text" className="form-control" id="title" value={note.title} placeholder="Enter note title" required onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" value={note.description} rows="4" placeholder="Enter note description" required onChange={onChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tag" className="form-label">Tag</label>
                            <input type="text" className="form-control" id="tag" value={note.tag} placeholder="Enter note tag" onChange={onChange} />
                        </div>
                        <button type="submit" className="btn btn-dark d-block w-100">Add Note</button>
                    </div>
                </form>
            </section>
        </div>
    )
}
