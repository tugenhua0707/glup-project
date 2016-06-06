//登录
function login(){
  if (window.urlproxy) {  //安卓
    urlproxy.userlogin();
  } else {     //ios
    $.ajax({
      url: "xx",
      type: 'post',
      dataType: 'json',
      timeout: 5000
    });
  }
};
module.exports = login;