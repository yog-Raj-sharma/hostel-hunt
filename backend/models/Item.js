const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }, 
    price: { type: Number, required: true, min: 0 },
    contact: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v) || /^.+@.+\..+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number or email!`
        }
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

itemSchema.index({ userId: 1 });

module.exports = mongoose.model('Item', itemSchema);
