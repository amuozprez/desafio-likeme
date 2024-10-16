import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";

const urlBaseServer = "http://localhost:3000";

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await fetch(urlBaseServer + "/posts");
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      console.error("Error al obtener los posts:", error);
    }
  };

  const agregarPost = async (e) => {
    e.preventDefault();
    
    const post = {
      titulo,
      imgSrc,
      descripcion,
    };
  
    try {
      const response = await fetch(urlBaseServer + "/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
  
      if (response.ok) {
        getPosts();
      } else {
        console.error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al agregar el post:", error);
    }
  };

  const like = async (id) => {
    try {
      await fetch(urlBaseServer + `/posts/like/${id}`, {
        method: "PUT",
      });
      getPosts();
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const eliminarPost = async (id) => {
    try {
      await fetch(urlBaseServer + `/posts/${id}`, {
        method: "DELETE",
      });
      getPosts();
    } catch (error) {
      console.error("Error al eliminar el post:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post
              key={i}
              post={post}
              like={like}
              eliminarPost={eliminarPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;