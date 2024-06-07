<template>
  <div class="main" v-if="ifShowView">
    <img class="logo" src="@/assets/image/logo_m.png" alt="" />
    <div class="btn" @click="jumpToApp">{{ appText.qr_show_btn1 }}</div>
    <div class="btn2" @click="downloadApp">{{ appText.qr_show_btn2 }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getOSType } from '@/util';
import useLanguage from '../hooks/language-hook.ts';

let sessionId = '';
let requester = '';
let vcode = '';
const appScheme = 'humancode://h5/hc/qrcode';
const { appText } = useLanguage();
const ifShowView = ref(false);
const BASE_URL= 'https://humancodeai.com'

const handleRedirect = (url: string) => {
  console.log('urlscheme' + url);
  window.location.href = url;
};

async function jumpToApp() {
  if (typeof window !== 'undefined') {
    try {
      //Step 3: Query the verification result from the server every 2 seconds
      //and jump to the app
      asyncPollData();
      let scheme = appScheme + '?session_id=' + sessionId + '&requester=' + requester;
      handleRedirect(scheme);
    } catch (error) {
      console.error('can not open app', error);
    }
  }
}

async function downloadApp() {
  const os = getOSType();
  console.log('os type', os);
  if (os === 0) {
    window.open('https://play.google.com/store/apps/details?id=xyz.humanid.app');
  } else if (os === 1) {
    window.open('https://apps.apple.com/app/human-code/id6479334502');
  }
}

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
  const url =  BASE_URL +'/api/session/v2/check';
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
  const url = BASE_URL + '/api/session/v2/result';

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
    //Send a message to the server to check whether the session_id is valid
    const result = await verifySeesionId();
    if (result === 0) {
      //Step 2: If the session_id is valid, display the view
      ifShowView.value = true;
    } else {
      console.error('sessionId is invalid');
    }
  } catch (e) {
    console.error('failed to get sessionId', e);
  }
};

onMounted(async () => {
  //Assign the parameters with your information
  sessionId = 'your_session_id';
  requester = 'your_product';
  //Step 1: Verify the validity of the session_id.
  //The view will be displayed only after it is confirmed to be valid.
  verifyAndPollSession();
});
</script>

<style lang="less" scoped>
.main {
  background-image: url('@/assets/image/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #fff;
  height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;

  .logo {
    margin-top: 20vh;
    width: 127px;
    align-self: center;
  }

  .qr {
    width: 288px;
    height: 288px;
    margin-top: 4vh;
    background-color: white;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    border: 7px solid #e6e6e6;
    justify-content: center;
  }

  .qr-txt {
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    margin-top: 50px;
  }

  .qr-img {
    width: 80%;
    align-self: center;
  }

  .btn {
    width: 290px;
    height: 50px;
    margin-top: 100px;
    background-color: #000;
    border-radius: 20px;
    text-align: center;
    color: white;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn2 {
    width: 290px;
    height: 50px;
    margin-top: 30px;
    background-color: #fff;
    border-radius: 20px;
    text-align: center;
    color: black;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000000;
  }
}
</style>
