const { db } = require('../db.js');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export const register = async (req, res) => {

    const { username, email, password, recaptchaToken } = req.body;

    if (!username || !email || !password || !recaptchaToken) {
        return res.status(400).json('All fields are required.');
    }

    if (!validateEmail(email)) {
        return res.status(400).json('Invalid email format.');
    }

    if (password.length < 6) {
        return res.status(400).json('Password must be at least 6 characters long.');
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: '6Lf6WeUpAAAAAOaNHyLy0w04oq3Rr4PBZPhiwxeY',
                response: recaptchaToken
            }
        });

        if (!response.data.success) {
            return res.status(400).json('Captcha verification failed.');
        }

        const q = "SELECT * FROM juanklzm_blog.users WHERE email = ? OR username = ?;";
        db.query(q, [email, username], (err, data) => {
            if (err) return res.status(500).json('Database error.');
            if (data.length) return res.status(409).json('User already exists!');

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json('Error generating salt.');
                }
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json('Error hashing password.');
                    }
                    const hashedPassword = hash;
                    const q = "INSERT INTO juanklzm_blog.users(`username`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)";
                    const values = [username, email, hashedPassword, 'reader'];

                    db.query(q, values, (err, data) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json('Error saving user to database.');
                        }
                        return res.status(200).json('User has been created.');
                    });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal server error.');
    }
}

export const login = (req, res) => {
    
    const q = "SELECT username, password, id, role FROM juanklzm_blog.users WHERE username = ?;"
    db.query(q, [req.body.username], (err, [data])=>{
        if(err) return res.json(err);
        if(data === undefined) return res.status(404).json('User not found!');


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