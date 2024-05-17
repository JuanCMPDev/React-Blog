import {db} from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {

    //check existing user
    const q = "SELECT * FROM blog.users WHERE email = ? OR username = ?;";
    
    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err)
        if(data.length) return res.status(409).json('user already exists!')

        // hash the password and create a user
        bcrypt.genSalt(10, (err, salt)=>{
            if(err){
                console.log(err)
                return res.status(500).json('error saving data');
            } 
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if(err){
                    console.log(err)
                    return res.status(500).json('error saving data');
                } 
                const password = hash;
                const q = "INSERT INTO blog.users(`username`, `email`, `password`, `role`) VALUES (?, ?, ?, 'reader')";
                const values = [req.body.username, req.body.email, password]

                db.query(q, [values], (err, data) => {
                    if(err){
                    console.log(err)
                    return res.status(500).json('error saving data');
                } 
                    return res.status(200).json('User has been created');
                })
            })
        })


    })

}

export const login = (req, res) => {
    //Check if the user exists
    const q = "SELECT username, password, id, role FROM blog.users WHERE username = ?;"
    db.query(q, [req.body.username], (err, [data])=>{
        if(err) return res.json(err);
        if(data === undefined) return res.status(404).json('User not found!');

        //Check password and generate jwt

        bcrypt.compare(req.body.password ,data.password)
            .then((passwordCheck)=>{
                if(!passwordCheck) return res.status(400).json('Wrong password');
                const {password, id, ...other} = data;
                jwt.sign({id: data.id, role: data.role}, 'chop_suey', (err, token)=>{
                    if(err){
                        console.log(err)
                        res.status(500).json('')
                    }
                    res.cookie('access_token', token, {
                        httpOnly: true,
                    }).status(200).json(other)
                });   
            })
            .catch((err)=>{
                console.log(err)
                return res.status(500).json('Server error: password check failed')
            })

        


    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true
    }).status(200).json("User has logged out")
}