import mongoose from 'mongoose'

const CounterSchema = mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
})

const Counter = mongoose.model('Counter', CounterSchema)

const menuSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  cal: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  ref: {
    type: Number
  }
});

menuSchema.pre('save', async function(next) {
  const doc = this;

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'menu' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, useFindAndModify: false }
    );
    doc.ref = counter.seq;
    next();
  } catch (error) {
    return next(error)
  }
});

const Menu = mongoose.model('Menu', menuSchema)

export default Menu