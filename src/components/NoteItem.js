import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import NoteContext from '../context/notes/noteContext'

export default function NoteItem(props) {
  const { note } = props;
  const context = useContext(NoteContext);
  const { deleteNote, editNote } = context;

  // State for different modes
  const [isEditing, setIsEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    description: note.description,
    tag: note.tag || ''
  });

  // Truncate description for preview
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleViewClick = () => {
    if (isEditing) return; // Prevent opening modal when in edit mode
    setShowViewModal(true);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); // Prevent card click event
    action();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFullEditClick = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    deleteNote(note._id);
  };

  const handleSave = () => {
    editNote(note._id, editedNote.title, editedNote.description, editedNote.tag);
    setIsEditing(false);
  };

  const handleModalSave = () => {
    editNote(note._id, editedNote.title, editedNote.description, editedNote.tag);
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setEditedNote({
      title: note.title,
      description: note.description,
      tag: note.tag || ''
    });
    setIsEditing(false);
  };

  const handleModalCancel = () => {
    setEditedNote({
      title: note.title,
      description: note.description,
      tag: note.tag || ''
    });
    setShowEditModal(false);
  };

  const handleChange = (e) => {
    setEditedNote({
      ...editedNote,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div 
          className="card h-100" 
          style={{ minHeight: '280px', cursor: isEditing ? 'default' : 'pointer' }} 
          onClick={handleViewClick}
        >
          <div className="card-body d-flex flex-column">
            {!isEditing ? (
              // View Mode
              <>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title mb-0 fw-bold" style={{ fontSize: '1.1rem' }}>
                    {note.title}
                  </h6>
                  {note.tag && (
                    <span className="badge bg-secondary ms-2" style={{ fontSize: '0.75rem' }}>
                      {note.tag}
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Recently'}
                  </small>
                </div>

                <p className="card-text flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  {truncateText(note.description, 120)}
                </p>

                <div className="mt-auto">
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={(e) => handleButtonClick(e, handleEditClick)}
                      title="Quick edit"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={(e) => handleButtonClick(e, handleFullEditClick)}
                      title="Full edit"
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={(e) => handleButtonClick(e, handleDelete)}
                      title="Delete note"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Quick Edit Mode
              <>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    name="title"
                    value={editedNote.title}
                    onChange={handleChange}
                    placeholder="Note title"
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control form-control-sm mb-2"
                    name="description"
                    value={editedNote.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Note description"
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    name="tag"
                    value={editedNote.tag}
                    onChange={handleChange}
                    placeholder="Tag (optional)"
                  />
                </div>
                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn btn-success btn-sm flex-fill"
                    onClick={handleSave}
                  >
                    <i className="fa-solid fa-check"></i> Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm flex-fill"
                    onClick={handleCancel}
                  >
                    <i className="fa-solid fa-times"></i> Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && createPortal(
        <div className="modal fade show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-lg" style={{ margin: '2rem auto', zIndex: 1061 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{note.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {note.tag && (
                  <div className="mb-3">
                    <span className="badge bg-secondary">{note.tag}</span>
                  </div>
                )}
                <div className="mb-3">
                  <small className="text-muted">
                    Created: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Recently'}
                  </small>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {note.description}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Full Edit Modal */}
      {showEditModal && createPortal(
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-lg" style={{ zIndex: 1061 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Note</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalCancel}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={editedNote.title}
                    onChange={handleChange}
                    placeholder="Enter note title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={editedNote.description}
                    onChange={handleChange}
                    rows="8"
                    placeholder="Enter note description"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tag"
                    value={editedNote.tag}
                    onChange={handleChange}
                    placeholder="Enter tag (optional)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
