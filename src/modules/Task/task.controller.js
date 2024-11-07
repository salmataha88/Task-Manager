import Task from '../../../DB/models/task.js';

export const createTask = async (req, res) => {
    const { title, description } = req.body;
    const {authUser} = req;

    if(!title){
        return res.status(400).json({
            message: 'Title is required',
        });
    }

    const task = new Task({
        title,
        description,
        user: authUser._id,
    });

    await task.save();
    return res.status(201).json({
        message: 'Task created',
        task,
    });
}

export const updateTask = async (req, res) => {
    const {_id} = req.params;
    const updates = req.body;
    const {authUser} = req;
    console.log(_id)
    const task = await Task.findById(_id);
    if(!task){
        return res.status(404).json({
            message: 'Task not found',
        });
    }
    if(task.user.toString() !== authUser._id.toString()){
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    const newTask = await Task.findByIdAndUpdate(_id, updates, {new: true});
    newTask.updatedAt = Date.now();

    await newTask.save();

    return res.status(200).json({
        message: 'Task updated',
        newTask,
    })
}

export const markTask = async (req, res) => {
    const {_id} = req.params;
    const {authUser} = req;
    const task = await Task.findById(_id);
    if(!task){
        return res.status(404).json({
            message: 'Task not found',
        });
    }
    if(task.user.toString() !== authUser._id.toString()){
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    task.status === 'completed' ? task.status = 'incomplete' : task.status = 'completed';
    task.updatedAt = Date.now();
    await task.save();

    return res.status(200).json({
        message: 'Task updated',
        task,
    })
}

export const getTasks = async (req, res) => {
    const {authUser} = req;
    
    const tasks = await Task.find({user: authUser._id}).select('-user');
    if(!tasks){
        return res.status(404).json({
            message: 'Tasks not found',
        });
    }
    return res.status(200).json({
        message: 'Tasks',
        tasks,
    });
}

export const getTaskById = async (req, res) => {
    const {_id} = req.params;
    const {authUser} = req;
    const task = await Task.findById(_id);
    if(!task){
        return res.status(404).json({
            message: 'Task not found',
        });
    }
    if(task.user.toString() !== authUser._id.toString()){
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    return res.status(200).json({
        message: 'Task',
        task,
    });
}

export const getTasksByStatus = async (req, res) => {
    const {status} = req.params;
    const {authUser} = req;
    const tasks = await Task.find({user: authUser._id, status});
    if(!tasks){
        return res.status(404).json({
            message: 'Tasks not found',
        });
    }
    return res.status(200).json({
        message: 'Tasks',
        tasks,
    });
}

export const deleteTask = async (req, res) => {
    const {_id} = req.params;
    const {authUser} = req;
    const task = await Task.findById(_id);
    if(!task){
        return res.status(404).json({
            message: 'Task not found',
        });
    }
    if(task.user.toString() !== authUser._id.toString()){
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    await task.deleteOne();
    return res.status(200).json({
        message: 'Task deleted',
    });
}
