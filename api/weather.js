import axios from 'axios';
import sharp from 'sharp';

// 天气图标映射
const weatherIcons = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '⛈️',
  '雪': '❄️',
  '多云转小雨': '🌦️',
  '晴转多云': '⛅',
  '多云转阴': '☁️',
  '晴转阴': '☁️',
  '阴转多云': '⛅',
  '阴转晴': '🌤️'
};

// 空气质量颜色映射
const airQualityColors = {
  '优': '#00E400',
  '良': '#FFFF00',
  '轻度污染': '#FF7E00',
  '中度污染': '#FF0000',
  '重度污染': '#8F3F97',
  '严重污染': '#7E0023'
};

// 创建SVG文本
const createSVGText = (text, x, y, fontSize, fontWeight = 'normal', fill = '#000000', textAnchor = 'start') => {
  return `<text x="${x}" y="${y}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}">${text}</text>`;
};

// 创建圆角矩形
const createRoundedRect = (x, y, width, height, rx, fill, stroke = 'none', strokeWidth = 0) => {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
};

// 获取天气数据
export async function getWeather(city) {
  try {
    const response = await axios.get(`https://api.cenguigui.cn/api/WeatherInfo/?city=${encodeURIComponent(city)}`);
    if (response.data.code === 200 && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('获取天气数据失败:', error);
    return null;
  }
}

// 格式化日期显示
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}/${day} ${weekday}`;
};

// 生成天气图片
export async function generateWeatherImage(weatherData) {
  if (!weatherData) return '';

  const { city, today, seven_day, tips, quality_level, tomorrow_condition, tomorrow_high_temperature, tomorrow_low_temperature, update_time } = weatherData;

  // 创建SVG内容
  let svgContent = `
    <svg width="1000" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#4FC3F7"/>
          <stop offset="50%" style="stop-color:#81C784"/>
          <stop offset="100%" style="stop-color:#AED581"/>
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.95)"/>
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.85)"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="1000" height="800" fill="url(#skyGrad)"/>
      
      <!-- 主卡片 -->
      ${createRoundedRect(0, 0, 1000, 800, 0, 'url(#cardGrad)')}
      
      <!-- 标题 -->
      ${createSVGText(`${city} 天气预报`, 500, 60, 40, 'bold', '#1565C0', 'middle')}
      ${createSVGText(`更新时间: ${update_time}`, 500, 90, 18, 'normal', '#666', 'middle')}
      
      <!-- 温馨提示 -->
      ${createRoundedRect(40, 110, 920, 50, 10, 'rgba(255,193,7,0.1)', '#FFC107', 2)}
      ${createSVGText('💡 ' + tips, 60, 140, 20, 'normal', '#F57C00')}
  `;

  // 当前天气卡片
  svgContent += `
    <!-- 当前天气 -->
    ${createRoundedRect(40, 180, 440, 180, 15, 'rgba(33,150,243,0.1)', '#2196F3', 2)}
    ${createSVGText('今 日 天 气', 60, 210, 26, 'bold', '#1565C0')}
    ${createSVGText(weatherIcons[today.current_cond] || '☀️', 60, 260, 52)}
    ${createSVGText(today.current_temp, 140, 260, 46, 'bold', '#E53935')}
    ${createSVGText(today.current_cond, 280, 260, 22, 'normal', '#424242')}
    ${createSVGText(`最低: ${today.low}`, 60, 300, 20, 'normal', '#1976D2')}
    ${createSVGText(`空气质量: ${today.quality}`, 60, 330, 20, 'normal', airQualityColors[today.quality] || '#666')}
    ${createSVGText(`夜间: ${today.night_condition}`, 280, 300, 20, 'normal', '#666')}
  `;

  // 明日天气卡片
  svgContent += `
    <!-- 明日天气 -->
    ${createRoundedRect(520, 180, 440, 180, 15, 'rgba(76,175,80,0.1)', '#4CAF50', 2)}
    ${createSVGText('明 日 天 气', 540, 210, 26, 'bold', '#2E7D32')}
    ${createSVGText(weatherIcons[tomorrow_condition] || '☀️', 540, 260, 52)}
    ${createSVGText(`${tomorrow_high_temperature}℃`, 620, 260, 46, 'bold', '#E53935')}
    ${createSVGText(tomorrow_condition, 760, 260, 22, 'normal', '#424242')}
    ${createSVGText(`最低: ${tomorrow_low_temperature}℃`, 540, 300, 20, 'normal', '#1976D2')}
    ${createSVGText(`空气质量: ${weatherData.tomorrow_quality_level}`, 540, 330, 20, 'normal', airQualityColors[weatherData.tomorrow_quality_level] || '#666')}
    ${createSVGText(`AQI: ${weatherData.tomorrow_aqi}`, 760, 300, 20, 'normal', '#666')}
  `;

  // 7天预报标题
  svgContent += `
    ${createSVGText('未 来 7 天 预 报', 500, 400, 30, 'bold', '#1565C0', 'middle')}
    <line x1="200" y1="415" x2="800" y2="415" stroke="#1565C0" stroke-width="2"/>
  `;

  // 7天预报
  const itemWidth = 120;
  const startX = 70;
  const startY = 450;
  
  seven_day.slice(0, 7).forEach((day, index) => {
    const x = startX + index * itemWidth;
    const y = startY;
    
    // 背景卡片
    svgContent += createRoundedRect(x, y, 110, 240, 10, 'rgba(255,255,255,0.8)', 'rgba(0,0,0,0.1)', 1);
    
    // 日期
    svgContent += createSVGText(formatDate(day.date), x + 55, y + 30, 16, 'bold', '#1565C0', 'middle');
    
    // 天气图标
    svgContent += createSVGText(weatherIcons[day.cond] || '☀️', x + 55, y + 70, 36, 'normal', '#424242', 'middle');
    
    // 天气描述
    svgContent += createSVGText(day.cond, x + 55, y + 105, 14, 'normal', '#666', 'middle');
    
    // 高温
    svgContent += createSVGText(day.high, x + 55, y + 140, 20, 'bold', '#E53935', 'middle');
    
    // 低温
    svgContent += createSVGText(day.low, x + 55, y + 170, 18, 'normal', '#1976D2', 'middle');
    
    // 温度条
    const tempBarY = y + 190;
    const tempBarWidth = 80;
    const tempBarX = x + 15;
    
    // 温度条背景
    svgContent += createRoundedRect(tempBarX, tempBarY, tempBarWidth, 8, 4, 'rgba(0,0,0,0.1)');
    
    // 温度条填充（根据温度高低调整颜色）
    const highTemp = parseInt(day.high.replace('℃', ''));
    const tempColor = highTemp > 25 ? '#FF5722' : highTemp > 15 ? '#FF9800' : '#2196F3';
    const fillWidth = Math.max(20, Math.min(tempBarWidth, (highTemp + 10) * 2));
    svgContent += createRoundedRect(tempBarX, tempBarY, fillWidth, 8, 4, tempColor);
  });

  // 底部信息
  svgContent += `
    <line x1="40" y1="750" x2="960" y2="750" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
    ${createSVGText('🌡️ 温度单位: 摄氏度', 200, 775, 16, 'normal', '#999')}
    ${createSVGText('🌪️ 实时更新', 600, 775, 16, 'normal', '#999')}
  `;

  svgContent += '</svg>';

  // 使用sharp将SVG转换为PNG
  const buffer = await sharp(Buffer.from(svgContent))
    .png()
    .toBuffer();

  return buffer;
}