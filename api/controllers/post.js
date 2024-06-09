import {db} from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {

    const category = req.query.category;
    const postId = req.query.postId || 0;
    const page = req.query.page !== undefined ? parseInt(req.query.page) : 1;
    const perPage = 4;

    const offset = (page - 1) * perPage;

    let q = "";
    let params = [];

    if(category){
        q = "SELECT * FROM juanklzm_blog.posts WHERE category=? AND id != ? ORDER BY date DESC LIMIT ? OFFSET ?";
        params = [category, postId, perPage, offset];
    } else {
        q = "SELECT * FROM juanklzm_blog.posts ORDER BY date DESC LIMIT ? OFFSET ?";
        params = [perPage, offset];
    }


    db.query(q, params, (err, data)=>{
        if(err) return res.status(500).send(err);

        const totalPostQuery = category 
        ? "SELECT COUNT(*) AS total FROM juanklzm_blog.posts WHERE category = ? AND id != ?" 
        : "SELECT COUNT(*) AS total FROM juanklzm_blog.posts";

        db.query(totalPostQuery, category ? [category, postId] : [], (err, countData)=>{
            if(err) return res.status(500).send(err);

            const totalPosts =  countData[0].total;
            const totalPages = Math.ceil(totalPosts / perPage);

            return res.status(200).json({posts: data, totalPages})
         })
    })
}


export const getPost = (req, res) => {
    const q = "SELECT `username`, `title`, `description` , p.id ,p.img, u.img AS userImg, `category`, `date` FROM juanklzm_blog.users u JOIN juanklzm_blog.posts p ON u.id=p.user_id WHERE p.id = ?";

    db.query(q, [req.params.id], (err, data)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json(data[0])
    })
}


export const addPost = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "chop_suey", (err, userInfo) => {
        if (err) return res.status(500).json("Token is not valid!");

        const q = "INSERT INTO juanklzm_blog.posts(title, description, img, date, category, user_id) VALUES (?)";

        const values = [[
            req.body.title,
            req.body.description,
            req.body.img,
            req.body.date,
            req.body.category,            
            userInfo.id,
        ]]

        db.query(q, values, (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("post has been created");
        })
    });
}


export const deletePost = (req, res) => {

    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "chop_suey", (err, userInfo) => {
        if (err) return res.status(500).json("Token is not valid!");

        const postId = req.params.id;
        const userId = userInfo.id;
        const userRole = userInfo.role;

        let q = "";
        
        if(userRole === 'admin'){
            q = "DELETE FROM juanklzm_blog.posts WHERE id = ?";
        }else{
            q = "DELETE FROM juanklzm_blog.posts WHERE id = ? AND user_id = ?";
        }

        db.query(q, [postId, userId], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json("Error deleting post from database");
            }
            if (data.affectedRows === 0) {
                return res.status(403).json("You can only delete your own posts");
            }
            return res.status(200).json("Post successfully deleted");
        });

    });
};


export const updatePost = (req, res) => {

    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "chop_suey", (err, userInfo) => {
        if (err) return res.status(500).json("Token is not valid!");

        const postId = req.params.id;

        let q = ""
        
        if(userInfo.role === "admin"){
            q = "UPDATE juanklzm_blog.posts SET `title`=? , `description`= ?, `img` = ?, `category` = ? WHERE `id` = ?";
        } else {
            q = "UPDATE juanklzm_blog.posts SET `title`=? , `description`= ?, `img` = ?, `category` = ? WHERE `id` = ? AND `user_id` = ?";
        }

        const values = [
            req.body.title,
            req.body.description,
            req.body.img,
            req.body.category,
        ]

        if(userInfo.role === 'admin'){
            db.query(q,[... values, postId], (err, data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json("post has been updated");
            })
        }else{
            db.query(q,[... values, postId, userInfo.id], (err, data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json("post has been updated");
            })
        }
    });
}