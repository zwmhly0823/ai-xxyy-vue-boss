const OSS = require('ali-oss')

export function client(data) {
  return new OSS({
    accessKeyId: data.accessKeyId,
    accessKeySecret: data.accessKeySecret,
    stsToken: data.securityToken,
    region: data.region, // oss地区
    bucket: data.bucket
  })
}
