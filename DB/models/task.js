import { Schema, model } from 'mongoose'; 

var taskSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['incomplete', 'completed'],
        default: 'incomplete',
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true,
});

export default model('Task', taskSchema);