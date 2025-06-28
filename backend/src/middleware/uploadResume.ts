import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../utils/cloudinary'

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "resumes",
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw'
    } as any
})

export const uploadResume = multer({ storage })