<template>
  <div class="text-sm leading-none robot-bold py-4">
    <section class="mb-4">
      <h3 class="text-[#9567D1] robot-medium mb-2">
        {{ $t('VFAQ.gameId') }}
      </h3>
      <div class="text-[#333]">{{ userId }}</div>
    </section>
    <section class="mb-4">
      <h3 class="text-[#9567D1] robot-medium mb-2">
        * {{ $t('VFAQ.contactEmail') }}
      </h3>
      <input
        type="text"
        v-model="form.email"
        maxlength="200"
        class="rounded-md bg-white h-10 block w-full box-border border border-[#F1E8FF] p-2"
      />
    </section>
    <section class="mb-4">
      <h3 class="text-[#9567D1] robot-medium mb-2">
        {{ $t('VFAQ.gameSecne') }}
      </h3>
      <input
        type="text"
        v-model="form.scene"
        maxlength="255"
        class="rounded-md bg-white h-10 block w-full box-border border border-[#F1E8FF] p-2"
      />
    </section>
    <section class="mb-4">
      <h3 class="text-[#9567D1] robot-medium mb-2">
        * {{ $t('VFAQ.errorDesc') }} (8-511)
      </h3>
      <textarea
        type="text"
        v-model="form.description"
        maxlength="511"
        class="rounded-md bg-white h-20 block w-full box-border border border-[#F1E8FF] p-2"
      ></textarea>
    </section>
    <section class="mb-4">
      <h3 class="text-[#9567D1] robot-medium mb-2">
        {{ $t('VFAQ.capture') }}
      </h3>
      <Uploader
        v-model="fileList"
        multiple
        accept="image/*"
        :max-size="maxSize"
        :max-count="maxCount"
        @oversize="onOversize"
        :after-read="afterRead"
      >
        <div
          class="w-[60px] h-[60px] border border-[#F1E8FF] rounded-md text-[#9567D1] flex items-center justify-center bg-white"
        >
          <div class="iconfont icon-plus font-bold"></div>
        </div>
      </Uploader>
    </section>
    <section class="pt-4 flex flex-col justify-center items-center">
      <div class="robot-regular text-[#9567D1] text-center mb-4">
        {{ $t('VFAQ.contactYouIn3Day') }}
      </div>
      <button
        class="vbutton font-rubik w-full h-12"
        :class="{ 'active:scale-95': canSubmit }"
        :style="{ filter: canSubmit ? '' : 'grayscale(0.7)' }"
        @click="onSubmitForm"
      >
        {{ $t('VFAQ.submit') }}
      </button>
    </section>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Toast, Uploader } from 'vant';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { uploadFile } from './UploadFile.api';
import { noop, trim } from 'lodash-es';
import ButtonLockController from '@/controller/ButtonLockController';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';

import {
  showLoading_bridge,
  dismissLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import { saveGameUserFeedbackGameHallController } from '@/vservices/client/GameHallController';
type IFileItem = {
  file: File;
  content: string;
  message: string;
  status: 'uploading' | 'done' | 'failed';
  url: string;
};
@Component({
  components: { Uploader },
})
export default class VFeedbackPanel extends mixins(
  BindEventMixinDefault,
  VUserAccountMixin
) {
  useInited(_isMount: boolean) {
    this.refreshVUserAccount().then(() => {
      const email = this.UserAccount?.userInfo?.email;
      if (email) {
        this.form.email = email;
      }
    });
    return noop;
  }
  get userId() {
    return this.$ss.state.user.userId;
  }

  form: Omit<API.GameFeedbackAO, 'pics'> = {
    scene: '',
    description: '',
    email: '',
  };

  fileList: IFileItem[] = [];

  get maxSize() {
    return 2 * 1024 * 1024;
  }

  get maxCount() {
    return 5;
  }

  onOversize() {
    Toast(this.$t('VFAQ.overSizeLimit'));
  }
  async afterRead(file: IFileItem) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      //                
      console.log('[Debug] afterRead', file, this.fileList);
    }
    file.status = 'uploading';
    file.message = this.$t('VFAQ.uploading') as string;
    const res = await uploadFile(file.file);
    if (res.success) {
      file.status = 'done';
      file.message = '';
      this.$set(file, 'url', res.data);
    } else {
      Toast(res.Reason);
      file.status = 'failed';
      file.message = this.$t('VFAQ.uploadFail') as string;
    }
  }

  get sForm() {
    const form = this.form;
    return {
      description: trim(form.description),
      email: trim(form.email),
      scene: trim(form.scene),
      pics: this.fileList.filter((item) => !!item.url).map((item) => item.url),
    };
  }

  get canSubmit() {
    const form = this.sForm;
    return form.description && form.email && form.description.length >= 8;
  }

  async onSubmitForm() {
    if (!this.canSubmit) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetNormalLock(0.2)) {
      return;
    }

    const sForm = this.sForm;
    this.$tracev('click_gamehall_submit_feedback', {
      email: sForm.email,
      game_scene: sForm.scene,
      game_error_describe: sForm.description,
    });
    showLoading_bridge();
    const res = await saveGameUserFeedbackGameHallController(sForm);
    dismissLoading_bridge();
    if (res.success) {
      Toast(this.$t('Base.SubmitSuccess'));
      this.form.description = '';
      // this.form.email = '';
      this.form.scene = '';
      this.fileList = [];
    } else {
      Toast(res.message);
    }
  }
}
</script>
