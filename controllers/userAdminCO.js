import AdminUser from "../MongoDB/models/AdminUser.js"
import generateJWT from "../helpers/index.js"

const login = async (req, res) => {
    // try {
    //     const user = new AdminUser(req.body)
    //     const saveUser = await user.save();
    // } catch (error) {
    //     console.log(error)
    // }
    // return

    const {user, password} = req.body

    const checkUser = await AdminUser.findOne({user})

    if(!checkUser){
        const error = new Error(`User not found`)
        return res.status(403).json({msg: error.message})
    }

    if(!checkUser.superAdmin) return res.status(403).json({msg: 'User not allow'})

    try {
        // Auth the user
        if(await checkUser.checkPass(password)){

            res.json({
                token: generateJWT(checkUser),
                msg: 'Correct'
            })
        } else{
            return res.status(401).json({msg: 'Incorrect password'})
        }
    } catch (error) {
        console.log(error)
        res.json({msg: 'No funciono'})
    }
}

const loginStore = async (req, res) => {
    const {user, password} = req.body

    const checkUser = await AdminUser.findOne({user})

    try {
        if(!checkUser){
            const error = new Error(`User not found`)
            return res.status(403).json({msg: error.message})
        }

        // Auth the user
        if(await checkUser.checkPass(password)){

            res.json({
                token: generateJWT(checkUser),
                msg: 'Correct'
            })
        } else{
            return res.status(401).json({msg: 'Incorrect password'})
        }
    } catch (error) {
        console.log(error)
        res.json({msg: 'No funciono'})
    }
}

export{
    login,
    loginStore
}