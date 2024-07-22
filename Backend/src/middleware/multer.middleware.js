import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
     filename: function (req, file, cb) {
        const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
        cb(null, `${sanitizedFilename}-${Date.now()}`);
    }
});

export const upload = multer({
    storage: storage
});
