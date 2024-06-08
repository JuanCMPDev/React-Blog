import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'

const Menu = ({category, postId}) => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      const page = 1;

      let url = "";

      if(category){
        url = `${BACKEND_URL}posts?category=${category}&page=${page}`;
      } else {
        url =`${BACKEND_URL}posts?page=${page}`;
      }

      try {
        const res = await axios.get(url);
        const originalPosts = res.data.posts;
        console.log(originalPosts);
        console.log(postId);
        const filteredPosts = originalPosts.filter(post => post.id !== parseInt(postId)).slice(0, 3);
        console.log(filteredPosts);
        console.log(filteredPosts);
        setPosts(filteredPosts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [category, postId]);

  return (
    <div className="menu">
        <div className="sugerencies">
          <h1>Related posts</h1>
        </div>
        <div className="posts">
          {posts.map(post => (
              <div className="post" key={post.id}>
                  <img src={post.img} alt="" />
                  <h2>{post.title}</h2>
                  <Link to={`/post/${post.id}`}>
                    <button>Read More</button>
                  </Link>
                  <hr />
              </div>
          ))}
        </div>
    </div>
  )
}

export default Menu