import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res1 = await sendApiRequest(`http://music.xn--q35am7h.site/?api=search_with_source&key=${data.msg}&pn=1&source=酷狗音乐`)
  const res2 = await sendApiRequest(`http://music.xn--q35am7h.site/?api=get_song_with_source&id=${res1.data.songs[data.n].rid}&source=酷狗音乐`)
  return res2
}

export async function speechSynthesis(data) {
  const res = await sendApiRequest(`https://api.lolimi.cn/API/tryyhc/api?key=sk-82dee5057a994142a6efd2260e963a11&msg=${data.msg}&sp=${data.sp}`)
  return res
}