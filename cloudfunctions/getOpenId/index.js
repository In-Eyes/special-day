const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const { openId } = event.userInfo;
  return { openId };
}