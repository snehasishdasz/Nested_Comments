const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "das_sneha@123",
    database: "comments_db",
});

// Connect to DB
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
    } else {
        console.log("Connected to MySQL database.");
    }
});

// Get all comments ordered by newest first
app.get("/comments", (req, res) => {
    db.query("SELECT * FROM comments ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Add a comment
app.post("/comments", (req, res) => {
    const { content, parent_id } = req.body;
    db.query(
        "INSERT INTO comments (content, parent_id) VALUES (?, ?)",
        [content, parent_id || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            console.log("Insert success:", res);
            res.status(201).json({ id: result.insertId, content, parent_id });
        }
    );
});

app.delete("/comments/:id", (req, res) => {
    const { id } = req.params;
    console.log("Delete request for id:", id);  // Add this

    db.query("DELETE FROM comments WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Delete error:", err); // Add this
            return res.status(500).json({ error: err.message });
        }
        console.log("Delete success:", result);
        res.json({ message: "Comment deleted successfully." });
    });
});


// Start server
app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});
