<template>
  <div class="main">
    <img class="logo" src="@/assets/image/logo.png" alt="" />
    <div class="content">
      <div class="space"></div>
      <div class="qr">
        <vue-qrcode class="qr-img" :value="qrCodeValue" width="200"></vue-qrcode>
        <div class="qr-txt">Open the HumanCode app and click the palm logo at the bottom to scan QR code.</div>
      </div>
      <div class="tip">
        <img class="tip-img" src="../assets/image/scan_tip.png" alt="" />
      </div>
    </div>
    <div class="tip-download">
      <div class="tip-txt">First time user?</div>
      <div class="download-btn" @click="showDownloadPop">Download HumanCode App</div>
    </div>
  </div>
  <div v-show="isShowPopView" class="pop">
    <div class="download">
      <div class="close" @click="closePop">
        <img src="" alt="" />
      </div>
      <div class="pop-txt">Download HumanCode App in App Store</div>
      <div class="pop-btn" @click="showAppleDownload"></div>
      <div class="pop-btn2" @click="showGoogleDownload"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import VueQrcode from 'vue-qrcode';
import { showDialog } from 'vant';

const qrCodeValue = ref('111');
let sessionId = '';
let callback_url = '';
let requester = '';
let vcode = '';
const isShowPopView = ref(false);
const route = useRoute();

async function closePop() {
  isShowPopView.value = false;
}

async function showDownloadPop() {
  isShowPopView.value = true;
}

async function showAppleDownload() {
  window.open('https://apps.apple.com/app/human-code/id6479334502');
}

async function showGoogleDownload() {
  window.open('https://play.google.com/store/apps/details?id=xyz.humanid.app');
}

// 轮询函数
const asyncPollData = async () => {
  try {
    let result = await getPollData();
    console.log(result);
    if (result === 0) {
      //轮询结束
      showPollyResult();
    } else if (result === 10013) {
      //继续轮询
      setTimeout(asyncPollData, 2000);
    } else {
      //出错了
      jumpNextPage('', result);
    }
  } catch (e) {
    console.error('failed to get sessionId', e);
    // showDialog({
    //   message: '无法获取sessionId, 请检查网络。',
    // }).then(() => {
    //   // on close
    // });
    //继续轮询
    setTimeout(asyncPollData, 2000);
  }
};

function showPollyResult() {
  //显示vcode
  //跳转到callbackurl
  jumpNextPage(vcode, 0);
}

function getSessionIdFromUrl(url: string) {
  let result = '';
  // if (url.includes('session_id')) {
  //   let tstr = url.substring(url.indexOf('?') + 1).split('&'); //先截取url的?后面的参数部分，在根据&分割成参数数组
  //   for (let str of tstr) {
  //     if (str.includes('session_id')) {
  //       result = str.replace('session_id=', '');
  //       if (result.length > 0) {
  //         return result;
  //       }
  //     }
  //   }
  // } else {
  //   return result;
  // }
  const urlObj = new URL(url);
  result = urlObj.searchParams.get('session_id') || (route.query.session_id as string) || '';

  return result;
}

function getRequesterFromUrl(url: string) {
  let result = '';
  // if (url.includes('requester')) {
  //   let tstr = url.substring(url.indexOf('?') + 1).split('&'); //先截取url的?后面的参数部分，在根据&分割成参数数组
  //   for (let str of tstr) {
  //     if (str.includes('requester')) {
  //       result = str.replace('requester=', '');
  //       if (result.length > 0) {
  //         return result;
  //       }
  //     }
  //   }
  // } else {
  //   return result;
  // }
  const urlObj = new URL(url);
  result = urlObj.searchParams.get('requester') || (route.query.requester as string) || '';

  return result;
}

function getCallbackUrlFromUrl(url: string) {
  let result = '';
  // if (url.includes('callback_url')) {
  //   let tstr = url.substring(url.indexOf('?') + 1).split('&'); //先截取url的?后面的参数部分，在根据&分割成参数数组
  //   for (let str of tstr) {
  //     if (str.includes('callback_url')) {
  //       result = str.replace('callback_url=', '');
  //       if (result.length > 0) {
  //         return result;
  //       }
  //     }
  //   }
  // } else {
  //   return result;
  // }
  const urlObj = new URL(url);
  result = urlObj.searchParams.get('callback_url') || (route.query.callback_url as string) || '';

  return result;
}

async function verifySeesionId() {
  const url = `${import.meta.env.VITE_BASE_URL}/api/session/v2/check`;
  const response = await axios({
    method: 'get',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      session_id: sessionId,
    },
    data: {
      session_id: sessionId,
    },
    timeout: 10000,
  });

  // if (response.data.code === 0) {
  //   return response.data.code;
  // }

  return response.data.code;
}

async function getPollData() {
  const url = `${import.meta.env.VITE_BASE_URL}/api/session/v2/result`;

  const response = await axios({
    method: 'get',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      session_id: sessionId,
    },
    data: {
      session_id: sessionId,
    },
    timeout: 10000,
  });

  if (response.data.code === 0) {
    vcode = response.data.result.vcode;
  }

  return response.data.code;
}

const verifyAndPollSession = async () => {
  try {
    const result = await verifySeesionId();
    console.log(result);
    if (result === 0) {
      //显示二维码
      const qrObject = {
        session_id: sessionId,
        requester: requester,
      };
      qrCodeValue.value = JSON.stringify(qrObject);
      //开始轮询，如果后台返回结果，进行跳转
      asyncPollData();
    } else {
      //往callback url中传出错误码
      jumpNextPage('', result);
    }
  } catch (e) {
    console.error('failed to get sessionId', e);
    showDialog({
      message: '无法验证sessionId, 请检查网络。',
    }).then(() => {
      // on close
    });
  }
};

function jumpNextPage(vcode: string, errorcode: number) {
  let path = callback_url + '?session_id=' + sessionId + '&vcode=' + vcode + '&error_code=' + errorcode;
  console.log(path);
  window.location.href = path;
}

onMounted(async () => {
  let url = window.location.href; //获取请求进来的完整url
  //url = 'http://www.humancode.app/test_api/index.html?session_id=0e2a03608e9f40daa3bc0d9a998e601a&callback_url=https://www.humancode.app/test_other_3/index.html&hash_id=22222&requester=ton';
  sessionId = getSessionIdFromUrl(url);
  callback_url = getCallbackUrlFromUrl(url);
  requester = getRequesterFromUrl(url);
  // let call = queryParams.callback_url+''
  // console.log('call----' + call);
  // callback_url = decodeURIComponent(call);
  console.log(sessionId, callback_url, requester);

  //验证sessionid有效性，确认有效才会显示二维码
  verifyAndPollSession();
});
</script>

<style lang="less" scoped>
.main {
  background-image: url('@/assets/image/pc_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  position: absolute;
  z-index: 1;

  .logo {
    margin-top: 5vh;
    width: 15vw;
    align-self: flex-start;
    margin-left: 15vw;
    // height: 84px;
  }

  .qr {
    width: 48vh;
    height: 55vh;
    margin-top: 10vh;
    background-color: white;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    flex-direction: column;
  }

  .qr-txt {
    font-size: 4.5px;
    text-align: center;
    margin-left: 15%;
    margin-right: 15%;
    margin-top: 5%;
  }

  .qr-img {
    width: 80%;
    margin-top: 5%;
    align-self: center;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .space {
    width: 30vw;
  }

  .tip {
    width: 30vw;
  }
  .tip-img {
    width: 15vw;
    margin-left: 3vw;
    margin-top: 13vh;
  }

  .tip-download {
    margin-top: 10px;
    align-self: center;
    display: flex;
    flex-direction: column;
  }

  .tip-txt {
    color: #4a4a4a;
    font-size: 4px;
    text-align: center;
  }
  .download-btn {
    width: 20vw;
    height: 4.5vw;
    background-image: url('@/assets/image/download_bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5px;
    cursor: pointer;
  }
}

.pop {
  position: absolute;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/image/pop_bg.png');
  display: flex;
  justify-content: center;
}

.download {
  width: 100px;
  height: 80px;
  background-color: #fff;
  align-self: center;
  border-radius: 4px 4px 4px 4px;

  display: flex;
  flex-direction: column;
}

.close {
  width: 7px;
  height: 7px;
  margin-top: 5%;
  align-self: flex-end;
  margin-right: 5%;
  background-image: url('@/assets/image/close_icon.png');
  background-size: cover;
  cursor: pointer;
}

.pop-txt {
  font-size: 5px;
  color: #000;
  text-align: center;
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 3%;
}

.pop-btn {
  background-image: url('@/assets/image/apple_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 50%;
  height: 18%;
  margin-top: 5px;
  align-self: center;
  cursor: pointer;
}

.pop-btn2 {
  background-image: url('@/assets/image/google_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 50%;
  height: 18%;
  margin-top: 5px;
  align-self: center;
  cursor: pointer;
}
</style>
