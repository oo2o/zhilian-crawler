import axios from 'axios'
import _ from 'lodash'
import fs from 'fs'

let paras = {
	'jl': '西安',                // 搜索城市
	'kw': 'web前端',        // 搜索关键词
	'isadv': 0,                 // 是否打开更详细搜索选项
	'isfilter': 1,              // 是否对结果过滤
	'p': 1,                     // 页数
	're': 2368                  // region的缩写，地区，2005代表海淀
}

let url = 'https://sou.zhaopin.com/jobs/searchresult.ashx'
axios.get(url,{params: paras}).then( res => {
	debugger
	// let reg = /<a style=.*? target=\"_blank\">(.*?)<\/a>.*?/i
	let reg2 = /(<td class=\"gsmc\"><a href=\"(.*?)\" target=\"_blank\">(.*?)<\/a>)|(<td class="zwyx">(.*?)<\/td>)|(<td class="gzdd">(.*?)<\/td>)|(<li class="newlist_deatil_two">(.*?))<\/li>/ig
	// let reg2 = /a?(.*?)/ig;
	let reg = /<a style=.*? target=\"_blank\">(.*?)<\/a>.*?<td class=\"gsmc\"><a href=\"(.*?)\" target=\"_blank\">(.*?)<\/a>.*?<td class=\"zwyx\">(.*?)<\/td>/i
	let result = res.data.match(reg2)
	let datas = _.chunk(result, 4)
	let csvData = '公司,薪资水平,工作地址,要求\n'
	datas.forEach( item => {
		let data4 = item[3].replace(/(<li class="newlist_deatil_two">)|(<\/li>)|(<li class="newlist_deatil_last">)|(<span>)/g, '')

		csvData += item[0].replace(/(<td class="gsmc"><a href="(.*?)" target="_blank">)|(<\/a>)/g, '') + ',' +
		item[1].replace(/(<td class="zwyx">)|(<\/td>)/g, '') + ',' +
		item[2].replace(/(<td class="gzdd">)|(<\/td>)/g, '') + ',' +
		data4.replace(/<\/span>/g, '	') + '\n'
	})
	fs.appendFile('F://test.csv',csvData,res => {
		console.log(res)
	})
	console.log(res.data)
	// let re = reg2.exec(res.data);
	// console.log(re)
	console.log(datas)
})
console.log('服务已启动')
