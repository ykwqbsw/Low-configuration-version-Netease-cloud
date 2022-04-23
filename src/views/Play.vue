<template>
  <div id="play">
    <van-nav-bar
      left-arrow
      @click-left="$router.go(-1)"
      fixed
      :border="false"
      style="background-color: rgba(255, 255, 255, 0)"
    />
    <div class="content">
      <!-- 背景图片 -->
      <img :src="songInfo.cover" alt="" class="bgImg" />
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" :show-indicators="false">
        <van-swipe-item>
          <!-- cd 旋转cd盘部分 注意三目加括号-->
          <div
            class="cd-wrapper"
            :style="
              'animation-play-state: ' + (playState ? 'running' : 'paused')
            "
          >
            <img :src="songInfo.cover" alt="" class="cd" />
          </div>
        </van-swipe-item>
        <!-- 歌词部分 -->
        <van-swipe-item>
          <div class="title">{{ songInfo.songname }}</div>
          <!-- 歌词部分 -->
          <div class="lyrics">
            <p
              v-for="(lyric, index) in lyricResult"
              :key="index"
              :class="{ lryic: true, active: index === currentIndex }"
            >
              {{ lyric[1] }}
            </p>
          </div>
        </van-swipe-item>
      </van-swipe>
      <!-- 滑块-->
      <div class="slide">
        <div class="start">{{start}}</div>
        <van-slider v-model="step"/>
        <div class="end">{{end}}</div>
      </div>
      <!-- footer 控制按钮 -->
      <div class="footer">
        <img src="/img/prev.png" alt="" />
        <!-- 点击播放状态改变
        1. cd盘停止旋转
        2. 图片切换 play/pause
        -->
        <img
          :src="playState ? '/img/pause.png' : '/img/play.png'"
          alt=""
          @click="playState = !playState"
        />
        <img src="/img/next.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayName",
  data() {
    return {
      songid: "",
      songInfo: {
        songname: "",
        cover: "",
      }, // 歌曲信息 歌名 封面
      playState: true, // 播放状态
      lyricResult: [], // 歌词结果
      currentIndex: 0, // 当前歌词下标
      lyricDom: null, // 歌词部分dom结构
      step: 0, // 滑块步长
      start: '00:00', // 当前进度条时间
      end: '00:00' ,// 歌曲总时长
      ids:[]
    };
  },
  created () {
    // 获取本地缓存
    var ids = JSON.parse(localStorage.getItem('ids'))
    this.ids = ids
    // 获取歌曲id
    this.songid = this.$route.params.id
    this.getSongInfo()
    this.getLyric()
  },
  mounted() {
    const that = this;
    // 获取音频资源并赋值给播放器
    this.$audio.src ="https://music.163.com/song/media/outer/url?id=" + this.songid + ".mp3";
    this.$audio.addEventListener("timeupdate", function () {
      // 可以获取当前歌曲播放时间
      // console.log(that.$audio.currentTime)
      // 调用查找歌词下标函数
      that.findLyricIndex(that.$audio.currentTime);
      //设置slide部分
     that.start = that.setTime(that.$audio.currentTime)
    });
    this.$audio.play()
    // 获取歌词容器dom
    this.lyricDom = document.querySelector('.lyrics')
  },
  methods: {
    //点击播放下首歌
    next() {
      console.log(this.ids)
      console.log(this.songid)
      var index=this.ids.findIndex(item => item === parseInt(this.songid))
      var nextId = 0
      if (index + 1 === this.ids.length) {
        nextId = this.ids[0]
      } else {
        nextId = this.ids[index + 1]
      }
      // replace跳转页面不会生成记录
      this.$router.replace('/play/' + nextId)
    },
    dragSlide () {
      // 拖动改变的是step值
      // console.log(this.step)
      // 拿到结尾时间
      var endTime = this.lyricResult[this.lyricResult.length - 1][0]
      // 获取拖动到的位置
      var currentTime = this.step * endTime / 100
      this.$audio.currentTime = currentTime
    },
    // 设置滑块slide进度 time就是当前时间
    setSlide (time) {
      // 拿到结尾时间
      var endTime = this.lyricResult[this.lyricResult.length - 1][0]
      this.step = parseInt(time * 100 / endTime)
    },
    setTime(time) {
      //strat根据当前时间转换来的
      var minute = parseInt(time / 60)
      var second = parseInt(time % 60)
      return (minute > 9 ? minute : '0' + minute)+ ':' +((second >9 ? second : ':' + second))
    },
    // 根据播放时间找到对应的下标
    findLyricIndex (currentTime) {
      if (currentTime > this.lyricResult[this.lyricResult.length - 1][0]) {
        this.currentIndex = this.lyricResult.length - 1
      } else {
        // 寻找对应歌词下标   当前歌词开始时间<当前时间<下一句歌词开始时间
        const index = this.lyricResult.findIndex((item, index) =>
          item[0] < currentTime &&
       this.lyricResult[index + 1][0] > currentTime)
        // console.log(index)
        // 找到对应下标后赋值
        this.currentIndex = index
      }
    },
    // 获取当前歌曲信息
    async getSongInfo() {
      var { data } = await this.$http.get("/song/detail", {params: { ids: this.songid },});
      if (data.code === 200) {
        // 获取歌曲名字
        this.songInfo.songname = data.songs[0].al.name;
        // 获取图片
        this.songInfo.cover = data.songs[0].al.picUrl;
      }
      // console.log(this.songInfo)
    },
    // 获取当前歌曲歌词
    async getLyric() {
      var { data } = await this.$http.get("/lyric", {params: { id: this.songid },});
      if (data.code === 200) {
        this.parseLyric(data.lrc.lyric);
      }
    },
    // 解析歌词,将传递过来的歌词解析成需要的样子 [xx:xx.xxx]xxxxx\n[xx:xx.xxx]xxxxx\n[xx:xx.xxx]xxxxx\n
    parseLyric(lyric) {
      // console.log(lyric)
      // 以换行符 \n 来分割数组 [[xx:xx.xxx]xxxxx,[xx:xx.xxx]xxxxx,[xx:xx.xxx]xxxxx,[xx:xx.xxx]xxxxx]
      // \[ 代表[   \d{2} 代表两个数字  \.代表.  \]代表 ]
      // 正则来获取时间 匹配 [xx:xx.xxx]
      var pattern = /\[\d{2}:\d{2}\.\d{2,3}\]/;
      var lyricArray = lyric.split("\n");
      lyricArray.forEach((item) => {
        // 获取时间
        var result = item.match(pattern);
        if (result) {
          // 获取result[0] 转化成s为单位 [xx:xx.xxx]
          // [02:03.00]-->  02:03.00  -->  02*60+03.00
          var timeArray = result[0].slice(1, -1).split(":");
          var realTime = parseInt(timeArray[0]) * 60 + parseFloat(timeArray[1]);
          // console.log(realTime)
        }
        // 获取歌词 [xx:xx.xxx]xxxxx---> xxxxxx
        var realLyric = item.replace(pattern, "");
        // 将时间与歌词 一起加入 lyricResult数组中 [[1,xxxxx],[2,xxxxx]]
         if (realTime && realLyric) {
          this.lyricResult.push([realTime, realLyric])
        }
      })
      console.log(this.lyricResult)
      this.end = this.setTime(this.lyricResult[this.lyricResult.length - 1][0])
    }
  },
  watch: {
    // 当播放状态改变的时候触发 判断音频是否播放
    playState: function () {
      this.playState ? this.$audio.play() : this.$audio.pause();
    },
     currentIndex: function () {
      this.lyricDom.scrollTop = (this.currentIndex - 7) * 30
    },
    $route: function () {
      // 更改 songid
      this.songid = this.$route.params.id
      // 重新调用函数 获取数据
      this.getSongInfo()
      this.getLyric()
      // 改变歌曲资源
      this.$audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.songid + '.mp3'
      this.$audio.play()
    }
  },
  beforeDestroy() {
    this.$audio.pause();
  },
};
</script>

<style scoped>
.slide{
  width: 100%;
  position: absolute;
  bottom: 80px;
  display: flex;
  align-items: center;
}
.slide,.end{
  text-align: center;
  widows: 100px;
  color: #fff;
}
/* 歌词部分 */
.title {
  color: #fff;
  font-size: 25px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
}
.lyrics {
  height: 450px;
  overflow: scroll;
}
.lryic {
  height: 30px;
  line-height: 30px;
  color: #666;
  font-size: 18px;
  text-align: center;
  line-height: 30px;
}
.active {
  color: #fff;
}
#play {
  height: 100%;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #222;
}
.bgImg {
  width: 100%;
  height: 100%;
  opacity: 0.3;
}
/* 轮播图 */
.my-swipe {
  position: absolute;
  top: 50px;
  width: 100%;
  height: 500px;
}
/* cd 盘样式 */
.cd-wrapper {
  position: absolute; /**定位居中 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 250px;
  height: 250px;
  padding: 20px;
  background-color: black;
  border-radius: 50%; /**变成圆形 */
  /** rotate 自定义动画名 5s 一次动画时间 linner线性运动  infinite无限一直运动下去*/
  animation: rotate 5s linear infinite;
  /* animation-play-state: running; */
}
.cd {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
/* 自定义旋转动画 */
@keyframes rotate {
  from {
  }
  to {
    transform: rotate(720deg);
  }
}

/* footer样式 */
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
