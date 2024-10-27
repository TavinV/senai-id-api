import jwt from "jsonwebtoken"

const auth_jwt = (req, res, next) => {
    console.log('oi do middleware')
    const token = req.cookies.token
    try {
        const user = jwt.verify(token, process.env.SECRET)
        req.user = user
        next()
    } catch (error) {
        res.clearCookie("token")
        return res.redirect('/')
    }
}

export default auth_jwt