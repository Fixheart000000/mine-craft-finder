export const title = '联合创作平台';
export const description = '';
export const primaryColor = '#a6e3a1';

export const imageMaxSize = 1024 * 1024 * 10; // 10MB

// 版权 等 信息
// icp备案
export const icp = process.env.ICP || '冀ICP备2025123950号-1';
// https://beian.miit.gov.cn
export const icpUrl = process.env.ICP_URL || 'https://beian.miit.gov.cn';
export const icpImg = process.env.ICP_IMG_URL || '/icp.png';
// https://联合创作平台.cn
const owner = '菲克斯哈尔特重构交互网络（保定）有限公司'; // 版权所属公司或个人
// 保定市高开区恒滨路88号荣御商务中心3号楼514号
const currentYear = new Date().getFullYear();
export const copyright = `© 2025-${currentYear} ${owner} 版权所有`;
// 公网安备案
export const publicRecord =
	process.env.PUBLIC_RECORD || '冀公网安备13065202000591号';
export const publicRecordUrl =
	process.env.PUBLIC_RECORD_URL ||
	'https://beian.mps.gov.cn/#/query/webSearch?code=13065202000591';
// <a href="https://beian.mps.gov.cn/#/query/webSearch?code=13065202000591" rel="noreferrer" target="_blank">冀公网安备13065202000591号</a>
export const publicRecordImg =
	process.env.PUBLIC_RECORD_IMG_URL || '/public_record.png';
// 冀公网安备13065202000591号

// icp 许可证
// TODO

// 营业执照
// 统一社会信用代码: 91440101MA9XWNRN0L
// 130625199609193413
// 企业对公账户
// 开户行: 保定银行光华支行
// 账户: 60101072010336400
// 开户地点: 河北省, 保定市, 河北省保定市竞秀区百花东路689号
