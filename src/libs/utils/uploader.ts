// Start 1
import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto"; // uuid paketi o'rniga Node'ning o'z built-in generatori

function getTargetImageStorage(address: string) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = `./uploads/${address}`;
      fs.mkdirSync(dest, { recursive: true }); // uploads/ .gitignore'da, repo bilan kelmaydi — papka yo'q bo'lsa shu yerda yaratiladi
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = randomUUID() + extension; // fayl nomlari to'qnashmasligi uchun tasodifiy nom
      cb(null, random_name);
    },
  });
}

const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

export default makeUploader;
// End 1
