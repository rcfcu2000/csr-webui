import CryptoJS from 'crypto-js'
import * as CryptoJS1 from 'crypto-js'
// 加密
const keyStr = 'q5e6w6w9f4q497te' // 解密用的key
export function encrypt(word) {
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const srcs = CryptoJS.enc.Utf8.parse(word) // 加密方式: 时间戳 + 密文
    const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
}
// 计算文件的SHA-256哈希值
export function calculateHash(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = function () {
            let wordArray = CryptoJS1.lib.WordArray.create(reader.result)
            let hash = CryptoJS1.SHA256(wordArray)
            resolve(hash.toString(CryptoJS1.enc.Hex))
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}