<template>
  <div>
    <!-- tab栏 -->
    <van-nav-bar title="首页" fixed placeholder />
    <!-- 推荐歌单部分 -->
    <div class="title">推荐歌单</div>
    <div class="tjsongs">
      <!-- 列表渲染 歌单 -->
      <div
        class="tj"
        v-for="song in tjsongs"
        :key="song.id"
        @click="$router.push('/sheet/' + song.id)"
      >
        <!-- 图片 -->
        <van-image width="100%" :src="song.picUrl" />
        <!-- 歌单名 -->
        <p class="name">{{ song.name }}</p>
      </div>
    </div>
    <!-- 最新音乐部分 -->
    <div class="title">最新音乐</div>
    <van-cell-group>
      <van-cell
        v-for="song in newsongs"
        :key="song.id"
        :title="song.name"
        :label="song.song.artists[0].name"
        center
      >
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="play-circle-o" class="play-icon" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'HomeName',
  data() {
    return {
      tjsongs: [], // 推荐歌单
      newsongs: [], // 获取到最新音乐
    };
  },
  created() {
    this.getTjSongs(); // 调用获取推荐歌单
    this.getNewSongs(); // 调用获取最新歌单
  },
  methods: {
    // 获取推荐歌单
    async getTjSongs() {
      var { data } = await this.$http.get("/personalized", {
        params: { limit: 6 },
      }); // 获取的结果数量为6
      // 根据code码判断请求是否成功
      if (data.code === 200) {
        this.tjsongs = data.result;
      }
      // console.log(data)
    },
    // 获取最新音乐
    async getNewSongs() {
      var data = await this.$http.get("/personalized/newsong", {
        params: { type: 0 },
      }); // 获取最新音乐
      // console.log(data)
      if (data.data.code === 200) {
        this.newsongs = data.data.result;
      }
      console.log(this.newsongs);
    },
  },
};
</script>

<style scoped>
.title {
  height: 50px;
  background-color: #eeeeee; /*背景颜色*/
  color: black; /*字体颜色*/
  line-height: 50px; /*行高=容器高度实现文字居中 */
  padding-left: 15px;
  font-weight: 700; /**文本加粗 */
}
.tjsongs {
  display: flex;
  flex-wrap: wrap; /**换行 */
  justify-content: space-between;
}
.tj {
  width: 30%;
  display: flex;
  flex-direction: column;
}
.name {
  /**文本2行 多余部分省略号 */
  display: -webkit-box;
  text-overflow: ellipsis; /**超出部分省略号 */
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /**显示的行数 */
  overflow: hidden;
}
/* 歌曲列表中的 播放图标 */
.play-icon {
  font-size: 25px;
}
</style>
