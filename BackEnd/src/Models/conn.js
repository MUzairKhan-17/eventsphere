import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/eproject', {
})
  .then(() => console.log('✅ Database Connected!'))
  .catch((err) => console.error('❌ DB connection error:', err));

export { mongoose };