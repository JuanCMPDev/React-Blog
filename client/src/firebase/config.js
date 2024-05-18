import { initializeApp } from "firebase/app";
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {v4} from 'uuid'

// firebase config here:

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage);
const postImgRef = ref(storageRef, 'post_imgs')


export const uploadFile = async (file) => {
    try {
        const uploadRef = ref(postImgRef, v4());
        await uploadBytes(uploadRef, file);
        const url = await getDownloadURL(uploadRef);
        return url;
    } catch (error) {
        return { error };
    }
}