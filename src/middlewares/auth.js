import jwt from 'jsonwebtoken'
import User from '../../DB/models/user.js'

export const isAuth = () => {
    return async (req, res, next) => {

        const { authorization } = req.headers

        if (!authorization) {
            return res.status(400).json({ message: 'Please login first' })
        }

        if (!authorization.startsWith('Task')) {
            return res.status(400).json({ message: 'invalid token prefix' })
        }

        const splitedToken = authorization.split(' ')[1]

        const decodedData = jwt.verify(
            splitedToken,
            process.env.SIGN_IN_TOKEN_SECRET,
        )

        if (!decodedData || !decodedData.id) {
        return res.status(400).json({ message: 'invalid token' })
        }

        const findUser = await User.findById(decodedData.id, 'email')

        if (!findUser) {
        return res.status(400).json({ message: 'Please SignUp' })
        }

        if(findUser){
            req.authUser = findUser
        }
        console.log(req.authUser)
        
        next();
    }
}