import axios from 'axios';
/**
 * 发送API请求
 * @param {string} url - 请求URL
 * @param {string} method - 请求方法 (GET, POST, PUT, DELETE等)
 * @param {object} data - 请求数据
 * @param {object} headers - 请求头
 */
export async function sendApiRequest(url, method = 'GET', data = null, headers = {}, isArrayBuffer = false) {
  try {
    // 添加默认的Authorization Bearer token
    const defaultHeaders = {
      'Authorization': 'Bearer zosnco51857',
      ...headers
    };

    const response = await axios({
      method: method.toLowerCase(),
      url: url,
      data: data,
      headers: defaultHeaders,
      ...(isArrayBuffer ? { responseType: 'arraybuffer' } : {})
    });
    return response.data;
  } catch (error) {
    console.error('API请求失败:', error.message);
    return { error: error.message };
  }
}