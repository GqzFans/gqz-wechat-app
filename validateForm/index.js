function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function checkUser(val, msg) {
  if (val === '' || val === null || val === undefined) {
    wx.showToast({
      title: msg,
      icon: 'none'
    });
    return false;
  } else {
    return true;
  }
}

function feedbackContent(val, msg) {
  val = Trim(val);
  if (val === '' || val === null || val === undefined) {
    wx.showToast({
      title: msg,
      icon: 'none'
    });
    return false;
  } else {
    if (val.length < 5) {
      wx.showToast({
        title: '至少输入五个字符',
        icon: 'none'
      });
      return false;
    } else if (val.length > 500) {
      wx.showToast({
        title: '最多输入500个字符',
        icon: 'none'
      });
      return false;
    } else {
      return true;
    }
  }
}

module.exports = {
  feedbackContent: feedbackContent,
  checkUser: checkUser
};