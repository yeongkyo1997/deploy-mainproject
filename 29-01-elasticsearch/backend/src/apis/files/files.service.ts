import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async upload({ files }) {
    // 파일을 구글 스토리지에 업로드하는 로직
    // console.log(files);
    // const aaa = await files[0];
    // const bbb = await files[1];

    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles); // [file, file]

    const bucket = process.env.BUCKET_NAME;
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEY_FILE_NAME,
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () =>
                resolve(
                  `https://storage.googleapis.com/${bucket}/${el.filename}`,
                ),
              )
              .on('error', () => reject('실패'));
          }),
      ),
    );

    return results;
  }
}
