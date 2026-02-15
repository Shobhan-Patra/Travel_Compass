import {v2 as cloudinary} from "cloudinary";

class CloudinaryService {
    private cloudName: string = process.env.CLOUDINARY_CLOUD_NAME!;
    private apiKey: string = process.env.CLOUDINARY_API_KEY!;
    private apiSecret: string = process.env.CLOUDINARY_API_SECRET!;
    private folder: string = process.env.CLOUDINARY_UPLOAD_FOLDER!;

    constructor() {
        cloudinary.config({
            cloud_name: this.cloudName,
            api_key: this.apiKey,
            api_secret: this.apiSecret,
            secure: true
        });
    }

    async getSignedUploadURL() {
        const paramsToSign = {
            timestamp: Math.floor(new Date().getTime() / 1000),
            folder: this.folder
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            this.apiSecret,
        );

        return {
            signature: signature,
            apiKey: this.apiKey,
            cloudName: this.cloudName,
            timeStamp: paramsToSign.timestamp,
            folder: paramsToSign.folder,
        }
    }


    // async getImageInfo(publicId: string)  {
    //     try {
    //         const result = await cloudinary.api.resource(publicId, {});
    //         return result;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}

export default CloudinaryService;