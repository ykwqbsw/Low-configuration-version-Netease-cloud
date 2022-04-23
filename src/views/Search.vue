<template>
  <div>
    <!-- tab栏 fixed固定在顶部 placeholder创建等高元素-->
    <van-nav-bar title="搜索" fixed placeholder />
    <!-- 搜索框 -->
    <van-search v-model="keywords" placeholder="输入想要搜索歌曲信息" shape="round"/>
    <!-- 获取热门搜索 -->
    <div class="hots" v-if="!keywords">
      <!-- plain 空心   round 圆角样式 color颜色 size 标签大小
      v-for 列表渲染hots-->
      <van-tag type="primary"
      v-for="hot in hots" :key="hot.searchWord"
      @click="keywords=hot.searchWord"
      plain round color="#666" size="medium" class="hot" >{{hot.searchWord}}</van-tag>
    </div>
    <!-- 搜索结果展示 -->
    <div class="songs" v-else>
      <!-- 最新音乐列表 -->
      <song-list :songs="songs"/>
      <!-- <van-cell-group>
        title歌曲名  lable作者 center垂直居中  right-icon右侧图标
        <van-cell
        v-for="song in songs"
        :key="song.id"
        :title="song.name"
        :label="song.artists[0].name"
        center>
          使用 right-icon 插槽来自定义右侧图标
          <template #right-icon>
            <van-icon name="play-circle-o" class="play-icon" />
          </template>
        </van-cell>
      </van-cell-group> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchName',
  data () {
    return {
      keywords: '', // 搜索的关键字
      hots: [], // 热门搜索数组
      songs: [] // 搜索结果歌曲数组
    }
  },
  created () {
    this.getHots() // 调用函数
  },
  methods: {
    // 获取热搜
    async getHots () {
      var { data } = await this.$http.get('/search/hot/detail')
      if (data.code === 200) {
        this.hots = data.data
      }
      // console.log(this.hots)
    },
    // 获取搜索结果数组
    async getSongs () {
      var { data } = await this.$http.get('/search', { params: { keywords: this.keywords } })
      if (data.code === 200) {
        this.songs = data.result.songs
      }
      console.log(this.songs)
    }
  },
  watch: {
    keywords: function () {
      // 不管我是输入改变还是 点击热搜改变都会触发这个函数
      // 因为存在一定延迟 所以当我们keywords改变时 可以将this.songs先设为[] 这样就不会显示上一次记录
      this.songs = []
      this.getSongs()
    }
  }
}
</script>

<style scoped>
.hots,.songs{
  padding: 10px;
}
.hot{
  margin: 5px;
}
</style>
