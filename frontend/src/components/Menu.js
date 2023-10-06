import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data);
        setLoading(false); // Set loading to false when data is loaded
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  // Logging for debugging
  useEffect(() => {
    posts.forEach((post) => {
      if (!post.postImg) {
        console.log("Post with missing image URL:", post);
      }
    });
  }, [posts]);

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {loading ? (
        // Render a loading indicator while data is being fetched
        <p>Loading...</p>
      ) : (
        posts.map((post) => (
          <div className="post" key={post.id}>
            {post.postImg && (
              <img src={`/images/${post.postImg}`} alt="" />
            )}
            <h2>{post.title}</h2>
            <Link className="link" to={`/post/${post.id}`}>
              <button>Read More</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Menu;