import React, { useContext, useEffect, useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdLogin } from "react-icons/md";
import Menu from '../components/Menu';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import { AuthContext } from '../context/authContext';
import parse from 'html-react-parser';
import { toast } from 'sonner';


moment.locale('es');


const Single = () => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [post, setPost] = useState({});

  const location = useLocation().pathname;
  const postId = location.split('/').pop();

  const {currentUser, logout} = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);


  let description = "";

  description = post.description;

  const isAdminOrOwner = currentUser && (currentUser.role === 'admin' || currentUser.role === 'writer' && currentUser.username === post.username)

  const handleDelete = async () => {
    if(currentUser && isAdminOrOwner){
      try {
        await axios.delete(`${BACKEND_URL}posts/${postId}`, { withCredentials: true });
        navigate("/");
        toast.success("Post eliminado con exito.")
      } catch (err) {
        if(err.response.status === 401){
          logout();
          toast.error("Se ha excedido el tiempo de tu sesión, inicia sesión nuvamente")
          return;
        };
      }
    } else {
      return
    }
  }

  return (
    <div className='single'>
      <div className="content">
        <div className="img-container">
          <img src={post?.img} alt="post-image" />
        </div>
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="post=profile-photo" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posteado {moment(post.date).fromNow()}</p>
          </div>
          {currentUser !== null && isAdminOrOwner &&  <div className="edit">
            <Link to={`/write?edit=${postId}`} state={post}>
              <div className="edit-icon">
                <FaEdit/>
              </div>
            </Link>
            <div onClick={handleDelete} className="delete-icon">
              <MdDelete/>
            </div>
          </div>}
        </div>
        <h1>{post.title}</h1>
        {          
          typeof description === 'string' && parse(description)
        }
      </div>
      <Menu category = {post.category} postId={postId}/>
    </div>
  )
}

export default Single