import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
        setLoading(false); // Set loading to false when data is loaded
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="single">
      {loading ? (
        // Render a loading indicator while data is being fetched
        <p>Loading...</p>
      ) : (
        <div className="content">
          {post?.postImg && (
            <img src={`/images/${post?.postImg}`} alt="" />
          )}
          <div className="user">
            {post.user && post.user.name && ( // Check if user object and name are defined
              <div>
                {post.userImg && (
                  <img src={post.userImg} alt="" />
                )}
                <div className="info">
                  <span>{post.user.name}</span>
                  <p>Posted {moment(post.date).fromNow()}</p>
                </div>
              </div>
            )}
            {currentUser.id === post.user.id && (
              <div className="edit">
                <Link to={`/write?edit=2`} state={post}>
                  <img src={Edit} alt="" />
                </Link>
                <img onClick={handleDelete} src={Delete} alt="" />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.desc),
            }}
          ></p>
        </div>
      )}
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
