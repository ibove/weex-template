<template>
  <div>
    <router-view />
  </div>
</template>

 <script>


const globalEvent = weex.requireModule("globalEvent");
const dom = weex.requireModule("dom");
export default {
  name: "App",
  provide() {
    return {
      closeBool: false
    };
  },
  beforeCreate() {
    const platform = weex.config.env.platform.toLowerCase();
    let url = "url('/src/assets/font/iconfont.ttf')";
    if (platform !== "web") {
      url = "url('local:///iconfont.ttf')";
    }

    dom.addRule("fontFace", {
      fontFamily: "iconfont5",
      src: url
    });
  },
  created() {
    const that = this;
    if (globalEvent) {
      globalEvent.addEventListener("androidback", function(e) {
        // 返回上一页或退出应用
        if (that.$route.path === "/" || that.$route.path === "/login") {
          if (that.closeBool) {
            const event = weex.requireModule("event");
            event.closeApp();
          } else {
            that.closeBool = true;
            modal.toast({
              message: "再按一次退出程序",
              duration: 2
            });
            setTimeout(function() {
              that.closeBool = false;
            }, 2000);
          }
        } else {
          that.$router.back();
          const Weexpda = weex.requireModule("Weexpda");
          Weexpda.stopRead();
        }
      });
    }
  },
  data() {
    return {};
  }
};
</script>
<style>
.title5 {
  font-family: iconfont5;
}
</style>

</style>
<style scoped>
.wrapper {
  justify-content: center;
  align-items: center;
}

.greeting {
  text-align: center;
  margin-top: 70px;
  font-size: 50px;
  color: #41b883;
}
.message {
  margin: 30px;
  font-size: 32px;
  color: #727272;
}
</style>
