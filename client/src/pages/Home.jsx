import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import {LazyLoadImage} from "react-lazy-load-image-component"
import 'react-loading-skeleton/dist/skeleton.css'

import loading from "../img/loading.webp"

const Home = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get("page")) || 1;

        let url = "";

        if(location.search.substring(1)){
          url = `${BACKEND_URL}posts?${location.search.substring(1)}&page=${page}`;
        } else {
          url =`${BACKEND_URL}posts?page=${page}`;
        }
        
        const res = await axios.get(url);
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [location.search]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const imprimirHastaPrimerPunto = (cadena) =>
    cadena.substring(0, cadena.indexOf("."));

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate(`?${searchParams.toString()}`);

    window.scrollTo(0, 0);
  };

  const searchParams = new URLSearchParams(location.search);

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <LazyLoadImage src={post.img} threshold={2000} loading="lazy" alt="post-photo" placeholderSrc={loading}/>
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{imprimirHastaPrimerPunto(getText(post.description))}</p>
              <Link to={`/post/${post.id}`}>
                <button>Read more</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
        <Pagination
          currentPage={parseInt(searchParams.get("page")) || 1}
          totalPages={totalPages}
          onChangePage={handlePageChange}
          displayRange={3}
          prevLabel={"<"}
          nextLabel={">"}
        />
    </div>
  );
};

export default Home;
