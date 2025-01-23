import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    chatHistory: { type: String, required: true },
    summary: { type: String },
    mood: { type: String },
    score: { type: Number }
  });

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userInfo: {
    name: String,
    image: String
  },
  History: [chatHistorySchema]
});


export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);