import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Connection = async () => {
    const USERNAME = process.env.DB_USERNAME;
    const PASSWORD = process.env.DB_PASSWORD;
    
    // Make sure password is properly encoded
    const encodedPassword = encodeURIComponent(PASSWORD);
    
    // Use the exact connection string from MongoDB Atlas
    const URL = `mongodb+srv://${USERNAME}:${encodedPassword}@articleaura.ssqdj.mongodb.net/?retryWrites=true&w=majority&appName=ArticleAura`;
    
    try {
        await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error while connecting to the database:', error.message);
        // Add more detailed error logging
        console.error('Connection URL:', URL.replace(encodedPassword, '****'));
    }
};

export default Connection;