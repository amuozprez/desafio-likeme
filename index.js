import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",   
  host: "localhost",
  database: "likeme",
  password: "18211238-a3163486", 
  port: 3163,
  allowExitOnIdle: true,
});

// Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para agregar un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, imgSrc, descripcion } = req.body;
  const img = imgSrc;
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta PUT para aumentar los likes de un post
app.put('/posts/like/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta PUT para actualizar el título, imgSrc y descripción
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, imgSrc, descripcion } = req.body;

  const values = [];
  const columns = [];

  if (titulo) {
    values.push(titulo);
    columns.push(`titulo = $${values.length}`);
  }
  if (imgSrc) {
    values.push(imgSrc);
    columns.push(`imgSrc = $${values.length}`);
  }
  if (descripcion) {
    values.push(descripcion);
    columns.push(`descripcion = $${values.length}`);
  }

  if (columns.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
  }

  const query = `UPDATE posts SET ${columns.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  values.push(id);

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta DELETE para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
