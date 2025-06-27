import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
 },
  title: {
    type: String,
    required: true,   
  },
  description: {
    type: String,
    required: true    
  },
  tag: {
    type: String,
    default: "General"   
  }
},
{
    timestamps: true,    
}

);

const Notes = mongoose.model('Notes', notesSchema);

export default Notes;