import { initializeApp } from "firebase/app";
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {v4} from 'uuid'

const firebaseConfig = {
  apiKey: "AIzaSyDR6w-iTdME2EJ_kd_jEIVg-PYI9YwipBA",
  authDomain: "react-blog-b29eb.firebaseapp.com",
  projectId: "react-blog-b29eb",
  storageBucket: "react-blog-b29eb.appspot.com",
  messagingSenderId: "506307783824",
  appId: "1:506307783824:web:dcfc74a86409728ef07c15"
};

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