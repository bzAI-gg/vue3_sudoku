const dateTime = {
	format(date, format = 'YYYY-MM-DD') {
		const d = new Date(date)
		const pad = num => String(num).padStart(2, '0')

		return format
			.replace(/YYYY/g, d.getFullYear())
			.replace(/MM/g, pad(d.getMonth() + 1))
			.replace(/DD/g, pad(d.getDate()))
			.replace(/HH/g, pad(d.getHours()))
			.replace(/mm/g, pad(d.getMinutes()))
			.replace(/ss/g, pad(d.getSeconds()))
			.replace(/ms/g, pad(Math.floor(d.getMilliseconds() / 10)))
	},

	dateDiff(date1, date2) {
		const diff = Math.abs(date1 - date2)
		return {
			days: Math.floor(diff / (1000 * 60 * 60 * 24)),
			hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
			seconds: Math.floor((diff % (1000 * 60)) / 1000),
			milliseconds: Math.floor(diff % 1000)
		}
	},

}
const data = {
	deepClone(obj) {
		if (obj === null || typeof obj !== 'object') return obj
		if (obj instanceof Date) return new Date(obj.getTime())
		if (obj instanceof RegExp) return new RegExp(obj)

		const clone = Array.isArray(obj) ? [] : {}
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				clone[key] = this.deepClone(obj[key])
			}
		}
		return clone
	},

	deepMerge(targetsources) {
		if (!sources.length) return target
		const source = sources.shift()

		if (typeof target !== 'object' || typeof source !== 'object') {
			return source
		}

		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
					target[key] = this.deepMerge(target[key] || {}, source[key])
				} else {
					target[key] = this.deepClone(source[key])
				}
			}
		}

		return this.deepMerge(targetsources)
	}
}
const string = {
	truncate(str, length, ellipsis = '...') {
		return str.length > length ?
			str.slice(0, length) + ellipsis :
			str
	},

	capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
}
const browser = {
	getQueryParam(name) {
		const params = new URLSearchParams(window.location.search)
		return params.get(name)
	},

	setCookie(name, value, days) {
		const date = new Date()
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
		document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`
	},

	getCookie(name) {
		const cookies = document.cookie.split(';')
		for (const cookie of cookies) {
			const [cookieName, cookieValue] = cookie.trim().split('=')
			if (cookieName === name) {
				return decodeURIComponent(cookieValue)
			}
		}
		return null
	}
}
const validate = {
	isEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	},

	isPhone(phone) {
		return /^1[3-9]\d{9}$/.test(phone)
	}
}

const sudoku_tool = {
	/**
	 * 将81个数字的字符串或压缩字符串转换为9x9二维数组
	 * @param {string} sudokuStr - 81个数字组成的字符串（0表示空格），或者压缩字符串×[0-9za-z](3-38个0)
	 * @returns {number[][]} 9x9二维数组
	 */
	stringToSudokuArray(sudokuStr) {
		let arrstr = this.decompressSudokuStr(this.formatSudokuStr(sudokuStr))

		const grid = [];
		for (let i = 0; i < 9; i++) {
			const row = [];
			for (let j = 0; j < 9; j++) {
				// 获取当前字符并转换为数字
				const num = parseInt(arrstr.charAt(i * 9 + j), 10);
				row.push(num);
			}
			grid.push(row);
		}
		return grid;
	},

	/**
	 * 将9x9二维数组转换为81个数字的字符串
	 * @param {number[][]} sudokuArray - 9x9二维数组
	 * @returns {string} 81个数字组成的字符串
	 */
	sudokuArrayToString(sudokuArray) {
		// 验证输入
		if (!Array.isArray(sudokuArray) || sudokuArray.length !== 9) {
			throw new Error('输入必须是9x9的二维数组');
		}

		let result = '';
		for (let i = 0; i < 9; i++) {
			if (!Array.isArray(sudokuArray[i]) || sudokuArray[i].length !== 9) {
				throw new Error('每行必须是包含9个数字的数组');
			}

			for (let j = 0; j < 9; j++) {
				const num = sudokuArray[i][j];
				// 验证每个元素是否是数字
				if (typeof num !== 'number' || num < 0 || num > 9 || !Number.isInteger(num)) {
					throw new Error('数组元素必须是0-9的整数');
				}
				result += num.toString();
			}
		}
		return result;
	},
	lvName(lv) {
		switch (Number(lv)) {
			case 0:
				return '见习学者'
			case 1:
				return '逻辑学士'
			case 2:
				return '推理硕士'
			case 3:
				return '数理博士'
			case 4:
				return '智慧院士'
		}
		return ''
	},
	normalised(arr) {
		return arr.map((rt) => {
			return rt.map((c) => {
				return {
					value: c,
					fixed: c != 0,
					error: false,
					notes: []
				}
			})
		})
	},
	area(narr) {
		let rls = []
		for (var i = 0; i < 9; i++) {
			rls[i] = []
			for (var j = 0; j < 9; j++) {
				rls[i].push(narr[i][j])
			}
		}
		let cls = []
		for (var i = 0; i < 9; i++) {
			cls[i] = []
			for (var j = 0; j < 9; j++) {
				cls[i].push(narr[j][i])
			}
		}
		let gls = []
		var index = 0
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				gls[index] = []
				for (var m = 0; m < 3; m++) {
					for (var n = 0; n < 3; n++) {
						gls[index].push(narr[i * 3 + m][j * 3 + n])
					}
				}
				index++;
			}
		}
		return [...rls, ...cls, ...gls]
	},
	cError(areas) {
		areas.forEach(item => item.forEach(cell => cell.error = false))
		areas.forEach(item => {
			let xs = Array(10).fill(0)
			item.forEach(cell => {
				xs[cell.value]++;
			})
			item.forEach(cell => {
				if (cell.value != 0 && xs[cell.value] > 1) {
					cell.error = true
				}
			})
		})
	},
	removeNotes(areas) {
		areas.forEach(item => {
			let xs = Array(10).fill(0)
			item.forEach(cell => {
				if (!cell.error && cell.value != 0) {
					xs[cell.value] = 1;
				}
			})
			item.forEach(cell => {
				if (cell.value == 0) {
					for (var i = 1; i <= 9; i++) {
						if (xs[i] == 1) {

							cell.notes = cell.notes.filter(n => n != i);
						}
					}
				}
			})
		})
	},
	isComplete(areas) {
		return areas.every(item => {
			return item.every(cell => {
				return cell.value && !cell.error
			})
		})
	},
	//破解数独（81位数字）
	pojie(arrstr) {
		let arrnew = this.stringToSudokuArray(arrstr);

		let nomarr = arrnew.map((item, r) => item.map((cell, c) => ({
			value: cell,
			x: c,
			y: r,
			possibility: Array(9).fill(true) // 1~9的可能性，初始都为true
		})));

		let areas = this.area(nomarr); // 将数独拆分成27个区域（9行+9列+9宫）
		let step = []; // 记录步骤 {x, y, value, test}

		// 更新所有单元格的可能性   
		let updatePossibilities = (nomarr, areas) => {
			// 重置所有可能性
			nomarr.forEach(item => {
				item.forEach(cell => {
					if (cell.value === 0) {
						cell.possibility.fill(true);
					} else {
						cell.possibility.fill(false)
						cell.possibility[cell.value - 1] = true
					}
				});
			});

			// 根据已填数字更新可能性
			areas.forEach(area => {
				const usedNumbers = new Set();
				// 收集已使用的数字
				area.forEach(cell => {
					if (cell.value !== 0) {
						usedNumbers.add(cell.value);
					}
				});

				// 更新可能性
				area.forEach(cell => {
					if (cell.value === 0) {
						for (let num = 1; num <= 9; num++) {
							if (usedNumbers.has(num)) {
								cell.possibility[num - 1] = false;
							}
						}
					}
				});
			});
		}
		// 填充确定性单元格（只有一个可能值的单元格）   
		let fillDeterminedCells = (nomarr, areas, step) => {
			let filled = false;

			for (let y = 0; y < 9; y++) {
				for (let x = 0; x < 9; x++) {
					const cell = nomarr[y][x];
					if (cell.value !== 0) continue;

					const possibleValues = [];
					for (let num = 1; num <= 9; num++) {
						if (cell.possibility[num - 1]) {
							possibleValues.push(num);
						}
					}

					if (possibleValues.length === 1) {
						// 唯一可能的值
						cell.value = possibleValues[0];
						step.push({
							x,
							y,
							value: cell.value,
							test: false,
							txt: '单',
							rt: rt
						});
						filled = true;
					}
				}
			}

			return filled;
		}

		// 填充隐式唯一候选（行/列/宫中唯一可能的数字）   
		let fillHiddenSingles = (nomarr, areas, step) => {
			let filled = false;

			// 检查每个区域
			for (const area of areas) {
				// 统计每个数字在该区域可能出现的单元格
				const numCounts = Array(10).fill().map(() => []);

				for (const cell of area) {
					for (let num = 1; num <= 9; num++) {
						if (cell.possibility[num - 1]) {
							numCounts[num].push(cell);
						}
					}
				}

				// 检查是否有数字只有一个可能位置
				for (let num = 1; num <= 9; num++) {
					if (numCounts[num].length === 1) {
						const cell = numCounts[num][0];
						if (cell.value) continue
						cell.value = num;
						step.push({
							x: cell.x,
							y: cell.y,
							value: num,
							test: false,
							txt: '区',
							rt: rt
						});
						filled = true;
					}
				}
			}

			return filled;
		}

		// 寻找最小可能单元一个，并列出和可行的数字
		let findmin = (nomarr) => {
			// 找到可能性最少的未填单元格
			let minPossibilities = 10;
			let bestCell = null;

			for (let y = 0; y < 9; y++) {
				for (let x = 0; x < 9; x++) {
					const cell = nomarr[y][x];
					if (cell.value != 0) continue;

					const count = cell.possibility.reduce((sum, p) => sum + (p ? 1 : 0), 0);
					if (count < minPossibilities) {
						minPossibilities = count;
						bestCell = cell;
					}
				}
			}
			return bestCell;
		}

		// 进行猜测  
		let makeGuess = (cell, preNum, step) => {
			let ps = []
			for (let num = preNum + 1; num <= 9; num++) {
				if (cell.possibility[num - 1]) {
					ps.push(num)
				}
			}
			if (ps.length === 0) return false // 已经没有可能再猜了

			cell.value = ps[0];
			step.push({
				x: cell.x,
				y: cell.y,
				value: ps[0],
				test: true,
				txt: '试',
				rt: rt,
				ps
			});
			return true
		}

		// 回溯（当猜测导致矛盾时）   
		let backtrack = (step, nomarr) => {
			while (step.length > 0) {
				const lastStep = step.pop();
				const cell = nomarr[lastStep.y][lastStep.x];

				if (lastStep.test) {
					// 这是一个猜测步骤
					let num = cell.value
					cell.value = 0
					if (step.length > 0) {
						rt = lastStep.rt
					}else{
						rt = 0
					}
					return {
						cell,
						num
					}
				} else {
					// 这是一个确定性填充步骤，只需重置
					cell.value = 0;
				}
			}

			return false;
		}

		// 检查数独是否已解决   
		let isSolved = (nomarr) => {
			for (let y = 0; y < 9; y++) {
				for (let x = 0; x < 9; x++) {
					if (nomarr[y][x].value === 0) {
						return false;
					}
				}
			}
			return true;
		}

		let isError = (areas) => {
			return areas.some(area => {
				let numb = Array(9).fill(0)
				area.forEach(cell => {
					if (cell.value !== 0) {
						numb[cell.value - 1]++;
					}
				})
				return numb.some(num => num > 1)
			})
		}

		// 将数独数组转换为字符串（假设这是你已经实现的方法）   
		let sudokuArrayToString2 = (nomarr) => {
			return nomarr.flat().map(cell => cell.value).join('');
		}

		let rt = 0

		// 主循环
		while (true) {
			rt++;
			if (isError(areas)) {
				// 回溯
				let su = false
				let flag = true
				while (!su) {
					let pre = backtrack(step, nomarr)
					if (pre) {
						updatePossibilities(nomarr, areas)
						su = makeGuess(pre.cell, pre.num, step)
					} else {
						flag = false
						break;
					}
				}
				if (!flag) {
					// 回溯失败，数独无解
					return null;
				}
				continue
			}

			// 5. 检查是否完成
			if (isSolved(nomarr)) {
				break;
			}

			// 1. 更新所有单元格的可能性
			updatePossibilities(nomarr, areas);

			// 2. 尝试确定性填充（唯一可能的值）
			let filled1 = fillDeterminedCells(nomarr, areas, step);

			// 3. 如果没有确定性填充，尝试寻找唯一候选（隐式唯一候选）
			let filled2 = fillHiddenSingles(nomarr, areas, step);
			if (filled1 || filled2) continue;

			// 4. 如果既没有显式也没有隐式唯一候选，开始猜测
			let cell = findmin(nomarr)
			if (cell) {
				makeGuess(cell, 0, step)
			}
		}

		return {
			arrstr: sudokuArrayToString2(nomarr),
			step
		};
	},
	fill_sudoku(nomarr, step) {
		step.forEach(item => {
			nomarr[item.y][item.x].value = item.value
		})
	},
	//格式化数独字符串，提取数字和压缩算法格式的数独字符串
	formatSudokuStr(str) {
		// 0. 预处理：移除空格+非法字符（只保留数字、字母、×）
		const cleanedStr = str.replace(/[^0-9a-z×]/g, "");
		// 1. 检查是否是压缩字符串（包含×且格式正确）
		const isCompressed = /×[0-9a-z]/.test(cleanedStr);
		if (isCompressed) {
			// 验证压缩格式是否合法
			let isValid = true;
			let i = 0;
			while (i < cleanedStr.length) {
				if (cleanedStr[i] === "×") {
					if (i + 1 >= cleanedStr.length || !/[0-9a-z]/.test(cleanedStr[i + 1])) {
						isValid = false;
						break;
					}
					i += 2; // 跳过×和后面的编码
				} else if (/[^0-9]/.test(cleanedStr[i])) {
					isValid = false;
					break;
				} else {
					i++;
				}
			}
			if (isValid) {
				// 是合法的压缩字符串
				let dstr = this.decompressSudokuStr(cleanedStr);
				return this.formatSudokuStr(dstr);
			}
			// 如果不是合法压缩字符串，回退到普通处理
		}
		// 2. 普通数字字符串处理
		const digitsOnly = cleanedStr.replace(/\D/g, "");
		if (digitsOnly.length < 81) {
			return digitsOnly.padEnd(81, "0");
		} else if (digitsOnly.length > 81) {
			return digitsOnly.slice(0, 81);
		}
		return digitsOnly;
	},
	//数独字符串压缩
	compressSudokuStr(str) {
		if (!/^\d{81}$/.test(str)) throw new Error("Invalid Sudoku string");
		let result = "";
		let i = 0;
		while (i < str.length) {
			if (str[i] !== "0") {
				result += str[i];
				i++;
			} else {
				let zeroCount = 0;
				while (i < str.length && str[i] === "0") {
					zeroCount++;
					i++;
				}
				if (zeroCount >= 3) {
					const code = zeroCount - 3;
					if (code <= 9) {
						result += `×${code}`; // ×0-×9 → 3-12个0
					} else if (code < 36) {
						result += `×${String.fromCharCode(97 + (code - 10))}`; // ×a-×z → 13-38个0
					} else {
						// 超过38个0，拆分成多个×z
						const fullChunks = Math.floor(zeroCount / 38);
						const remainder = zeroCount % 38;
						result += "×z".repeat(fullChunks);
						if (remainder >= 3) {
							const remainderCode = remainder - 3;
							result += remainderCode <= 9 ?
								`×${remainderCode}` :
								`×${String.fromCharCode(97 + (remainderCode - 10))}`;
						} else {
							result += "0".repeat(remainder);
						}
					}
				} else {
					result += "0".repeat(zeroCount);
				}
			}
		}
		return result;
	},
	//数独字符串解压缩
	decompressSudokuStr(compressedStr) {
		let result = "";
		let i = 0;
		while (i < compressedStr.length) {
			if (compressedStr[i] !== "×") {
				result += compressedStr[i];
				i++;
			} else {
				if (i + 1 >= compressedStr.length) throw new Error("Invalid compressed format");
				const code = compressedStr[i + 1];
				let zeroCount;
				if (/[0-9]/.test(code)) {
					zeroCount = parseInt(code, 10) + 3; // ×0 → 3, ×9 → 12
				} else if (/[a-z]/.test(code)) {
					zeroCount = code.charCodeAt(0) - 97 + 13; // ×a → 13, ×z → 38
				} else {
					throw new Error("Invalid compression code");
				}
				result += "0".repeat(zeroCount);
				i += 2;
			}
		}
		return result;
	}
}

const loadLevel = {
	async load(lv) {
		try {
			const response = await fetch('@/../levels/sudoku.json');
			if (!response.ok) {
				throw new Error('关卡数据加载失败');
			}
			const data = await response.json();

			// 查找对应难度的所有数独
			const levelData = data.levels.find(level => level.difficulty == lv);

			if (!levelData) {
				console.warn(`没有找到难度 ${lv} 的关卡`);
				return [];
			}

			return levelData.puzzles;
		} catch (error) {
			console.error('加载关卡时出错:', error);
			return [];
		}
	}
}
export default {
	dateTime,
	data,
	string,
	browser,
	validate,
	sudoku_tool,
	loadLevel
}
export {
	dateTime,
	data,
	string,
	browser,
	validate,
	sudoku_tool,
	loadLevel
}