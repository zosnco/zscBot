import axios from 'axios';
import sharp from 'sharp';

// 天气图标映射
const weatherIcons = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '雨': '🌧️',
  '雪': '❄️'
};

// 创建SVG文本
const createSVGText = (text, x, y, fontSize, fontWeight = 'normal', fill = '#000000', textAnchor = 'start') => {
  return `<text x="${x}" y="${y}" font-family="Microsoft YaHei" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}">${text}</text>`;
};

// 获取天气数据
export async function getWeather(city) {
  try {
    const response = await axios.get(`https://v2.api-m.com/api/weather?city=${encodeURIComponent(city)}`);
    if (response.data.code == '200' && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('获取天气数据失败:', error);
    return null;
  }
}

// 生成天气图片
export async function generateWeatherImage(weatherData) {
  if(!weatherData.data) return ''

  // 创建SVG内容
  let svgContent = `
    <svg width="900" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB"/>
          <stop offset="100%" style="stop-color:#E0F7FA"/>
        </linearGradient>
      </defs>
      <rect width="900" height="500" fill="url(#grad)"/>
      <rect x="20" y="20" width="860" height="460" rx="15" fill="rgba(255, 255, 255, 0.85)"/>
      ${createSVGText(`${weatherData.city} · 未来6天天气预报`, 450, 70, 32, 'bold', '#1A237E', 'middle')}
      <line x1="250" y1="85" x2="650" y2="85" stroke="#1A237E" stroke-width="2"/>
  `;

  // 添加天气信息
  weatherData.data.forEach((day, index) => {
    const y = 130 + index * 60;
    
    // 添加日期
    svgContent += createSVGText(day.date, 60, y, 22, 'bold', '#1A237E');
    
    // 添加温度
    svgContent += createSVGText(day.temperature + '℃', 240, y, 20, 'normal', '#E53935');
    
    // 添加天气图标和描述
    svgContent += createSVGText(weatherIcons[day.weather] || day.weather, 380, y, 24, 'normal', '#424242');
    
    // 添加风力
    svgContent += createSVGText(day.wind, 510, y, 20, 'normal', '#1976D2');
    
    // 添加空气质量
    svgContent += createSVGText('空气质量: ' + day.air_quality, 660, y, 20, 'normal', '#2E7D32');
    
    // 添加分隔线
    if (index < weatherData.data.length - 1) {
      svgContent += `<line x1="60" y1="${y + 20}" x2="840" y2="${y + 20}" stroke="rgba(0, 0, 0, 0.1)" stroke-width="1"/>`;
    }
  });

  svgContent += '</svg>';

  // 使用sharp将SVG转换为PNG
  const buffer = await sharp(Buffer.from(svgContent))
    .png()
    .toBuffer();

  return buffer;

}