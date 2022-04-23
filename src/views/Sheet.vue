<template>
  <div>
    <van-nav-bar title="歌单" left-arrow @click-left="$router.go(-1)" fixed placeholder/>
    <song-list :songs="songs"/>
      <!-- <van-cell-group>
        title歌曲名  lable作者 center垂直居中  right-icon右侧图标
        <van-cell
        v-for="song in songs"
        :key="song.id"
        :title="song.name"
        :label="song.ar[0].name"
        center>
          使用 right-icon 插槽来自定义右侧图标
          <template #right-icon>
            <van-icon name="play-circle-o" class="play-icon" />
          </template>
        </van-cell>
      </van-cell-group> -->
  </div>
</template>

<script>
export default {
   name: 'SheetName',
  data () {
    return {
      songs: [] // 通过歌单id获取的歌曲
    }
  },
  created () {
    this.getSongs()
  },
  methods: {
    // 根据id获取对应歌单的歌曲
    async getSongs () {
      var { data } = await this.$http.get('/playlist/detail', { params: { id: this.$route.params.id } })
      if (data.code === 200) {
        this.songs = data.playlist.tracks
      }
      console.log(this.songs)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
