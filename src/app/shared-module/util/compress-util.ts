import Compressor from 'compressorjs';
import {BINARY_SYSTEM_CONST} from '../../core-module/const/common.const';

export class CompressUtil {

  /**
   * 压缩文件
   * @param file 文件对象
   */
  public static compressImg(file: any): Promise<File> {
    return new Promise((resolve, reject) => {
      new Compressor(
        file,
        {
          quality: BINARY_SYSTEM_CONST * BINARY_SYSTEM_CONST / file.size,
          convertSize: BINARY_SYSTEM_CONST * BINARY_SYSTEM_CONST,
          success: (result: File) => {
            resolve(result);
          },
          error(error: Error) {
            reject(error);
          }
        }
      );
    });
  }
}
