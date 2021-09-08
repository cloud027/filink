
export function flat(buffer) {
  let lData = null,
      rData = new Float32Array(0);    // 右声道默认为0

  // 创建存放数据的容器
  lData = new Float32Array(buffer.length);

  var lBuffer = [new Float32Array(buffer)];

  // 合并
  let offset = 0; // 偏移量计算

  // 将二维数据，转成一维数据
  // 左声道
  for (let i = 0; i < lBuffer.length; i++) {
      lData.set(lBuffer[i], offset);
      offset += lBuffer[i].length;
  }

  return {
      left: lData,
      right: rData
  };
}

/**
 * 数据压缩
 * @param {*} data 输入音频流
 * @param {*} inputSampleRate 输入采样率
 * @param {*} outputSampleRate 输出采样率
 */
export function compress(data, inputSampleRate, outputSampleRate) {
  // 压缩，根据采样率进行压缩
  let rate = inputSampleRate / outputSampleRate,
      compression = Math.max(rate, 1),
      lData = data.left,
      rData = data.right,
      length = Math.floor(( lData.length + rData.length ) / rate),
      result = new Float32Array(length),
      index = 0,
      j = 0;

  // 循环间隔 compression 位取一位数据
  while (index < length) {
      // 取整是因为存在比例不是整数的情况
      let temp = Math.floor(j);

      result[index] = lData[temp];
      index++;

      if (rData.length) {
          /*
          * 双声道处理
          * e.inputBuffer.getChannelData(0)得到了左声道4096个样本数据，1是右声道的数据，
          * 此处需要组和成LRLRLR这种格式，才能正常播放，所以要处理下
          */
          result[index] = rData[temp];
          index++;
      }

      j += compression;
  }
  // 返回压缩后的一维数据
  return result;
}

export function encodePCM(bytes, sampleBits, littleEdian) {
  let offset = 0,
      dataLength = bytes.length * (sampleBits / 8),
      buffer = new ArrayBuffer(dataLength),
      data = new DataView(buffer);

  // 写入采样数据
  if (sampleBits === 8) {
      for (let i = 0; i < bytes.length; i++, offset++) {
          // 范围[-1, 1]
          let s = Math.max(-1, Math.min(1, bytes[i]));
          // 8位采样位划分成2^8=256份，它的范围是0-255;
          // 对于8位的话，负数*128，正数*127，然后整体向上平移128(+128)，即可得到[0,255]范围的数据。
          let val = s < 0 ? s * 128 : s * 127;
          val = +val + 128;
          data.setInt8(offset, val);
      }
  } else {
      for (let i = 0; i < bytes.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, bytes[i]));
          // 16位的划分的是2^16=65536份，范围是-32768到32767
          // 因为我们收集的数据范围在[-1,1]，那么你想转换成16位的话，只需要对负数*32768,对正数*32767,即可得到范围在[-32768,32767]的数据。
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, littleEdian);
      }
  }

  return data;
}
