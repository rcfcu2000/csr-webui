const OSS = require('ali-oss');
let client = new OSS({
    region: 'oss-cn-hangzhou',
    accessKeyId: 'LTAI5t8W9w6KAcDJetS2ehaZ',
    accessKeySecret: 'qrof4zbUfwfAFWQf5WffIlOQhEMwip',
    bucket: 'csr-pictures'
});
export async function upload(file, address, suffix) {
    try {
        let fileName = `${address}${suffix}`
        try {
            await client.getObjectMeta(fileName);
            // 文件存在，返回在线地址
            return client.signatureUrl(fileName);
        } catch (e) {
            if (e.code === 'NoSuchKey') {
                // 文件不存在，上传文件
                let result = await client.put(fileName, file);
                if (result.res.status === 200) {
                    // 文件上传成功，返回在线地址
                    return client.signatureUrl(fileName);
                } else {
                    // 文件上传失败
                    console.log("上传失败");
                }
            } else {
                throw e;
            }
        }
    } catch (e) {
        console.log("上传失败", e);
    }
}