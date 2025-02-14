import multer from 'multer';
import { getNewUID } from './helpers.js';
import * as mime from 'mime-types';

export const reviewStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/reviews')
    },
    filename: function (req, file, cb) {
        
        let newFileName = getNewUID() + '.' + mime.extension(file.mimetype)
        let ext = mime.extension(file.mimetype)
        cb(null, newFileName);

    }
});

export const stayStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/stays')
    },
    filename: function (req, file, cb) {
        
        let newFileName = getNewUID() + '.' + mime.extension(file.mimetype)
        let ext = mime.extension(file.mimetype)
        cb(null, newFileName);

    }
});

export const activityStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/activities')
    },
    filename: function (req, file, cb) {
        
        let newFileName = getNewUID() + '.' + mime.extension(file.mimetype)
        let ext = mime.extension(file.mimetype)
        cb(null, newFileName);

    }
});