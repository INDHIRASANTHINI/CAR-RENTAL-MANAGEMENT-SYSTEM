const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  type: {
    type: String,
    enum: ['oil_change', 'inspection', 'repair', 'cleaning', 'tire_rotation'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  scheduledDate: Date,
  completedDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed'],
    default: 'scheduled'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
maintenanceSchema.index({ carId: 1 });
maintenanceSchema.index({ status: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
