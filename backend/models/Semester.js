const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Semester", semesterSchema);