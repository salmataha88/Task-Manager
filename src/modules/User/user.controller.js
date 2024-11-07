import User from '../../../DB/models/user.js'
import Task from '../../../DB/models/task.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const SignUp = async (req, res, next) => {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password) {
        return res.status(400).json({ message: 'Please fill all fields' })
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' })
    }
    if (!/^\d{11}$/.test(mobile)) {
        return res.status(400).json({ message: 'Please enter a valid mobile number' })
    }

    var isUserExists = await User.findOne({ email })
    if (isUserExists) {
        return res.status(400).json({ message: 'Email is already exists' })
    }

    isUserExists = await User.findOne({ mobile })
    if (isUserExists) {
        return res.status(400).json({ message: 'Mobile is already exists' })
    }

    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    const user = new User({ 
        name,
        email, 
        mobile, 
        password: hashedPassword
    })
    await user.save()
    res.status(201).json({ message: 'User Registered Successfully', user })
}

export const SignIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!password || !email) {
        return res.status(400).json({ message: 'Please fill all fields' })
    }
    
    const isUserExists = await User.findOne({ email })

    if (!isUserExists){
        return res.status(400).json({ message: 'Please Register first' })
    }

    const isPasswordValid = bcrypt.compareSync(password, isUserExists.password)

    if (!isPasswordValid){
        return res.status(400).json({ message: 'Invalid Password' })
    }

    const userToken = jwt.sign(
        { 
          email: isUserExists.email,
          id: isUserExists._id,
        },
        process.env.SIGN_IN_TOKEN_SECRET,
        { expiresIn: '2h' },
    )
    
    return res.status(200).json({ message: 'LoggedIn success', userToken })
}

export const updateProfile = async (req, res, next) => { 
    const updates = req.body;
    const user = req.authUser;

    if(!updates || updates.length === 0) {
        return res.status(400).json({ message: 'Please fill all fields' })
    }

    if(updates.password) {
        if(updates.password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' })
        }
        const hashedPassword = bcrypt.hashSync(updates.password, +process.env.SALT_ROUNDS)
        updates.password = hashedPassword
    }

    if(updates.email) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(updates.email)) {
            return res.status(400).json({ message: 'Please enter a valid email' })
        }
        const isUserExists = await User.findOne({ email: updates.email })
        if (isUserExists) {
            return res.status(400).json({ message: 'Email is already exists' })
        }
    }

    if(updates.mobile) {
        if (!/^\d{11}$/.test(updates.mobile)) {
            return res.status(400).json({ message: 'Please enter a valid mobile number' })
        }
        const isUserExists = await User.findOne({ mobile: updates.mobile })
        if (isUserExists) {
            return res.status(400).json({ message: 'Mobile is already exists' })
        }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true })
    res.status(200).json({ message: 'Profile updated successfully', updatedUser })
}

export const deleteProfile = async (req, res, next) => {
    const user = req.authUser;
    const currentTasks = await Task.find({ user: user._id })
    if (currentTasks.length > 0) {
        currentTasks.forEach(async (task) => {
            await Task.findByIdAndDelete(task._id)
        })
    }
    await User.findByIdAndDelete(user._id)
    res.status(200).json({ message: 'Profile deleted successfully' })
}