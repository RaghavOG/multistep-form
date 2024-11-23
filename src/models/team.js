import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    team_id: { 
        type: String, 
        required: true, 
        unique: true,
        index: true // Add index for better query performance
    },
    team_name: { 
        type: String, 
        required: true,
        trim: true // Remove whitespace
    },
    num_teammates: { 
        type: Number, 
        required: true,
        min: 2, // Minimum team size
        max: 4  // Maximum team size
    },
    num_males: { 
        type: Number, 
        required: true,
        min: 0
    },
    num_females: { 
        type: Number, 
        required: true,
        min: 0
    },
    theme: { 
        type: String, 
        required: true, 
        enum: ["Theme 1", "Theme 2", "Theme 3", "Theme 4", "Theme 5", "Theme 6"],
        trim: true
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId instead of String
        ref: 'User',
        required: true
    }],
    project_submission: {
        type: String, // URL/link to the project zip file
        
    },
    abstract_submission: {
        type: String, // URL/link to the abstract PDF
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

teamSchema.index({ team_id: 1, theme: 1 });


teamSchema.pre('save', function(next) {
    if (this.members.length !== this.num_teammates) {
        next(new Error('Number of team members must match num_teammates'));
    }
    next();
});

teamSchema.pre('save', async function(next) {
    const memberIds = this.members;
    
    try {
        const existingTeams = await mongoose.models.Team.find({
            members: { $in: memberIds },
            _id: { $ne: this._id } // Exclude current team
        });

        if (existingTeams.length > 0) {
            next(new Error('One or more team members are already registered with another team'));
        }
        
        next();
    } catch (error) {
        next(error);
    }
});


const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;
