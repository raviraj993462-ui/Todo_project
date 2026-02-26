const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.query(
    "SELECT * FROM todos WHERE user_id = ?",
    [req.user.id],
    (err, result) => res.json(result)
  );
});

router.post("/", auth, (req, res) => {
  db.query(
    "INSERT INTO todos (user_id, title) VALUES (?, ?)",
    [req.user.id, req.body.title],
    () => res.json({ message: "Todo added" })
  );
});

router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM todos WHERE id = ?",
    [req.params.id],
    () => res.json({ message: "Deleted" })
  );
});

router.put("/:id", auth, (req, res) => {
  const { title } = req.body;
  db.query(
    "UPDATE todos SET title = ? WHERE id = ? AND user_id = ?",
    [title, req.params.id, req.user.id],
    () => res.json({ message: "Todo updated" })
  );
});

module.exports = router;