import { useEffect, useState } from "react";
// import initialPosts from '../src/db/db.js';
import "./App.css";
import api from "./api/api";
import AddPosts from "./components/AddPosts";
import EditPost from "./components/EditPost";
import Posts from "./components/Posts";



export default function App() {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null); // post I am editing
    const [error, setError] = useState(null);

    const handleAddPost = async (newPost) => {
        try {
            const id = posts.length
                ? Number(posts[posts.length - 1].id) + 1
                : 1;

            const finalPost = {
                id: id.toString(),
                ...newPost,
            };

            // const response = await api.post("/posts", finalPost);
            const response = await api.post('/posts', finalPost);

            setPosts([...posts, response.data]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeletePost = async (postId) => {
        if (confirm("Are you sure you want to delete the post?")) {
            try {
                // await api.delete(`/posts/${postId}`);
                await api.delete(`/posts/${postId}`);
                const newPosts = posts.filter((post) => post.id !== postId);
                setPosts(newPosts);
            } catch (err) {
                setError(err.message);
            }
        } else {
            console.log("You chose not to delete the post!");
        }
    };

    const handleEditPost = async (updatedPost) => {
        try {
            // const response = await api.patch(
            //     `/posts/${updatedPost.id}`,
            //     updatedPost
            // );
            const response = await api.patch(
                `/posts/${updatedPost.id}`,
                updatedPost
            );
            // console.log(response)

            const updatedPosts = posts.map((post) =>
                post.id === response.data.id ? response.data : post
            );

            setPosts(updatedPosts);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // const response = await api.get("/posts");
                const response = await api.get("/posts");
               

                if (response && response.data) {
                    setPosts(response.data);
                }
            } catch (err) {
              if(err.response){
                setError(`Error from server status :${err.response.status}-Message: ${err.response.data}`)
              }
              else{
                setError(err.message);
              }
               
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <div>
                <h1>API Request with api</h1>
                <hr />

                <div>
                    <Posts
                        posts={posts}
                        onDeletePost={handleDeletePost}
                        onEditClick={setPost}
                    />

                    <hr />

                    {!post ? (
                        <AddPosts onAddPost={handleAddPost} />
                    ) : (
                        <EditPost post={post} onEditPost={handleEditPost} />
                    )}

                    {error && (
                        <>
                            <hr />
                            <div className="error">{error}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}