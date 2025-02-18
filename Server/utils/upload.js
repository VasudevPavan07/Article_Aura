import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const encodedPassword = encodeURIComponent(password);

const storage = new GridFsStorage({
  url: `mongodb+srv://${username}:${encodedPassword}@articleaura.ssqdj.mongodb.net/?retryWrites=true&w=majority&appName=ArticleAura`,
  options: { useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const match = ["image/png", "image/jpg", "image/jpeg"]; // Allowed file types

      if (match.indexOf(file.mimetype) === -1) {
        return reject('Invalid file type');
      }

      try {
        const filename = `${Date.now()}-blog-${file.originalname}`;
        const fileInfo = {
          filename: filename,
          bucketName: 'photos'
        };
        resolve(fileInfo);
      } catch (error) {
        reject(error);
      }
    });
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;