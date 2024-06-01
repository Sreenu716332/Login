const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static('views'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
        res.send("User already exists.");
    } else {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            console.log('Salt:', salt);
            const hashedPassword = await bcrypt.hash(data.password, salt);
            console.log('Hashed Password:', hashedPassword);
            data.password = hashedPassword;

            const userdata = await collection.insertMany([data]); // Insert an array of documents
            console.log(userdata);
            res.send("User registered successfully.");
        } catch (error) {
            console.error('Error during hashing:', error);
            res.status(500).send('Internal server error');
        }
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            res.send("User not found.");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                res.render("home");
            } else {
                res.send("Wrong password.");
            }
        }
    } catch (error) {
        console.error(error);
        res.send("Wrong details.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});



