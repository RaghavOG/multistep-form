import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    user_id: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    team_id: { 
        type: String, 
        ref: 'Team',
        required: function() {
            return this.role === 'participant'; 
        }
    },
    name: { 
        type: String, 
        required: true,
        trim: true // Remove whitespace
    },
    gender: { 
        type: String, 
        required: true, 
        enum: ["male", "female", "other"], 
        lowercase: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, 
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] 
    },
    contact: { 
        type: String, 
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number'] 
    },
    college: { 
        type: String, 
        required: true,
        trim: true
    },
    stream: { 
        type: String, 
        required: true,
        trim: true
    },
    year: { 
        type: Number, 
        required: true,
        
    },
    role: { 
        type: String, 
        required: true, 
        enum: ["participant", "admin"],
        default: "participant",
        lowercase: true
    },
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true 
});


userSchema.index({ email: 1, team_id: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;