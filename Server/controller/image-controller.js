import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'http://localhost:8000';

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    try {
        gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'photos'
        });
        gfs = grid(conn.db, mongoose.mongo);
        gfs.collection('photos');
        console.log('GridFS initialized successfully');
    } catch (error) {
        console.error('Error initializing GridFS:', error);
    }
});

export const uploadImage = async (request, response) => {
    try {
        console.log('Upload request received');
        console.log('Headers:', request.headers);
        console.log('File:', request.file);
        
        if (!request.file) {
            console.log('No file in request');
            return response.status(400).json({ error: "No file uploaded" });
        }

        if (!gridfsBucket) {
            console.log('GridFS not initialized');
            return response.status(500).json({ error: "Storage not initialized" });
        }

        const imageUrl = `${url}/file/${request.file.filename}`;
        console.log('File saved successfully:', imageUrl);
        return response.status(200).json(imageUrl);

    } catch (error) {
        console.error('Upload error:', error);
        return response.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
};

export const getImage = async (request, response) => {
    try {
        if (!gfs) {
            return response.status(500).json({ error: "Storage not initialized" });
        }

        const file = await gfs.files.findOne({ filename: request.params.filename });
        if (!file) {
            return response.status(404).json({ error: "File not found" });
        }

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);
    } catch (error) {
        console.error('Get image error:', error);
        response.status(500).json({ error: error.message });
    }
};