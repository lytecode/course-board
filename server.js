const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


// 1. Create a student or register
// 2. update student 
// 3. deolete student
// 4. display student info 
// 5. Register course 
// 6. withdraw course 
// 7. Logout (exit) 

// store student cousese in an Array
// Each course will have (id, name, hours)
//after each operation return a successful message to the user

app.get("/", (req, res) => {
  res.send("Welcome to student portal");
});

app.()

app.listen(port, () => console.log(`app started on port ${port}`));
