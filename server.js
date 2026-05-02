const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

// Connect to MongoDB
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log('Database connected successfully');
});

