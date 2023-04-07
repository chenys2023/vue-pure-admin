<template>
  <el-dialog
    center
    v-model="dialogVisible"
    title="选择访问的平台"
    class="dialog-width"
    :show-close="false"
  >
    <el-form :model="form">
      <!-- <div
        class="flex flex-wrap justify-center w-full px-10 overflow-auto h-80"
      > -->
      <div class="flex flex-col w-full px-10 mb-8 overflow-auto h-80">
        <div
          class="flex items-center justify-center w-full h-16 py-6 mt-6 border-2 border-gray-300 rounded hover:bg-gray-100"
          v-for="(item, index) in props.tenantList"
          :key="index"
          :class="{ select: clickIndex === index }"
          @click="onSelect(item, index)"
        >
          {{ item.tenantName }}
        </div>
      </div>
      <!-- <el-form-item> -->

      <!-- </el-form-item> -->
    </el-form>

    <!-- footer -->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="w-2/3"
          size="default"
          type="primary"
          @click="onSubmit"
          :loading="loading"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { watch } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
// import { initRouter } from "@/router/utils";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
const router = useRouter();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    default: () => ({})
  },
  tenantList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});
const dialogVisible = ref(false);
const loading = ref(false);
const clickIndex = ref(0);
const selectForm = reactive({
  account: "",
  password: "",
  tenantCode: ""
});
watch(
  () => props.modelValue,
  val => {
    dialogVisible.value = val;
  },
  { deep: true, immediate: true }
);

const onSelect = (item, index) => {
  clickIndex.value = index;
};
const onSubmit = () => {
  loading.value = true;
  selectForm.account = props.form.username;
  selectForm.password = props.form.password;
  selectForm.tenantCode = props.tenantList[clickIndex.value].tenantCode;
  useUserStoreHook()
    .loginByUsername(selectForm)
    .then(res => {
      if (!res.data.tenantCode) {
        loading.value = false;
        // 显示多平台选择
        message("平台不可用", { type: "error" });
      } else {
        // 获取后端路由
        router.push("/");
        // initRouter().then(() => {
        //   router.push("/");
        //   message("登录成功", { type: "success" });
        // });
      }
    });
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
}

.select {
  border-radius: 5px;
  border: 2px solid #4ba0fc;
  position: relative;
}

.select::after {
  content: " ";
  position: absolute;
  display: inline-block;
  width: 1.75rem;
  height: 0.75rem;
  border-width: 0 0 2px 2px;
  overflow: hidden;
  border-color: #4ba0fc;
  border-style: solid;
  transform: rotate(-50deg);
  right: 1rem;
  top: 1.25rem;
}
</style>
