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
import axios from 'axios';
import VueQrcode from 'vue-qrcode';

const qrCodeValue = ref('0');
let sessionId = '';
let requester = '';
let vcode = '';
const isShowPopView = ref(false);

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

const verifyAndPollSession = async () => {
  try {
    //Send a message to the server to check whether the session_id is valid
    const result = await verifySeesionId();
    if (result === 0) {
      //Step 2: If the session_id is valid, display the QR code
      //Use the third-party library vue-qrcode to generate a QR code
      const qrObject = {
        session_id: sessionId,
        requester: requester,
      };
      qrCodeValue.value = JSON.stringify(qrObject);
      //Step 3: Query the verification result from the server every 2 seconds
      asyncPollData();
    } else {
      console.error('sessionId is invalid');
    }
  } catch (e) {
    console.error('failed to get sessionId', e);
  }
};

const asyncPollData = async () => {
  try {
    //Send a message to the server to get the final result
    let result = await getPollData();
    if (result === 0) {
      //Get success result, polling ends
      console.log('Result is ' + vcode);
    } else if (result === 10013) {
      //Continue polling after 2 seconds
      setTimeout(asyncPollData, 2000);
    } else {
      //Verification failed. Please handle different error results according to the error code.
      console.error('verification failed with code ' + vcode);
    }
  } catch (e) {
    console.error('failed to get result', e);
    //Continue polling after 2 seconds
    setTimeout(asyncPollData, 2000);
  }
};

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

onMounted(async () => {
  //Assign the parameters with your information
  sessionId = 'your_session_id';
  requester = 'your_product';
  //Step 1: Verify the validity of the session_id.
  //The QR code will be displayed only after it is confirmed to be valid.
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
