<template>
  <van-cell-group>
    <!-- title歌曲名  lable作者 center垂直居中  right-icon右侧图标 -->
    <van-cell
      v-for="song in songs"
      :key="song.ids"
      :title="song.name"
      :label="song.song?song.song.artists[0].name:song.artists[0].name"
      center>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="play-circle-o" class="play-icon" />
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script>
export default {
  props: ['songs'],
  //在组件生命周期中，updated获取
  updated() {
     //用ids数组存储 当前歌曲列表的 id号
     var ids=[]
     this.songs.forEach(item => {
       ids.push(item.id)
       console.log(ids)
     })
     console.log(ids)
     localStorage.setItem('ids',JSON.stringify(ids))
  },
}
</script>

<style scoped>
/* 歌曲列表中的 播放图标 */
.play-icon{
  font-size: 25px;
}
</style>
