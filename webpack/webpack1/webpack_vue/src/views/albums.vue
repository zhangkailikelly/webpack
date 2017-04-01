<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" v-link="{path: '/about', replace: true}">
      <span class="icon icon-left"></span>
    </a>
    <h1 class="title">我的相册</h1>
  </header>
  <div id="wrapper"  v-infinite-scroll="loadMore">
    <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
    <div id="columns">
      <figure class="pin" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"  v-for="album in albums" >
        <a :href="album.img_original_url" itemprop="contentUrl" data-size="{{album.width}}x{{album.height}}">
            <img :src="album.img_thumb_url" itemprop="thumbnail" :alt="album.text" class="my-thumb"/>
        </a>
        <figcaption itemprop="caption description">{{{album.text}}} </figcaption>
        <p class="pull-right">{{{album.created_at}}} </p>
      </figure>
    </div>
    </div>
  </div>

  <pswb></pswb>
</template>

<style>

  body {
    background: url(http://subtlepatterns.com/patterns/scribble_light.png);
  }

  h1 {
    margin-left: 10px;
  }

  #wrapper {
    width: 100%;
    margin: 50px auto;
    height: 100%;
    overflow: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  #columns {
    -webkit-column-count: 2;
    -webkit-column-gap: 10px;
    -webkit-column-fill: auto;
    -moz-column-count: 2;
    -moz-column-gap: 10px;
    -moz-column-fill: auto;
    column-count: 2;
    column-gap: 1rem;
    column-fill: auto;
    margin-bottom: 2rem;
  }

  .pin {
    display: inline-block;
    background: #FEFEFE;
    border: 2px solid #FAFAFA;
    box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4);
    margin: 0 2px 15px;
    -webkit-column-break-inside: avoid;
    -moz-column-break-inside: avoid;
    column-break-inside: avoid;
    padding: 15px;
    padding-bottom: 5px;
    background: -webkit-linear-gradient(45deg, #FFF, #F9F9F9);
    opacity: 1;
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    transition: all .2s ease;
  }

  .pin .my-thumb {
    width: 6rem;
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    margin-bottom: 5px;
  }

  .pin p,
  .pin figcaption {
    color: #333;
    margin: 0;
    font-size: .7rem;
  }

</style>

<script>

  import {loader} from '../util/util'
  import Pswb from '../components/Pswb'
  import $ from 'zepto'

  export default {
    route: {
      data ({to, next}) {
        this.isRequest = false
        this.loading = false
        this.cur_page = 1
        return this.$http.get('albums', { page: 1, per_page: this.per_page}).then(({data}) => {
          console.log(data.data)
          this.$set('albums', data.data)
          this.$set('total_count', data.total_count)
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        albums: [],
        total_count: 0,
        cur_page: 1,
        per_page: 10,
        isRequest: false
      }
    },
    methods: {
      loadMore () {
        if (this.loading || this.isRequest) {
          return
        }
        if (Math.ceil(this.total_count / this.per_page) <= this.cur_page) {
          $.toast('已经是最后一页了', 500)
          this.loading = true
          return
        }
        this.loading = true
        let scroller = $('#wrapper')
        var that = this
        loader.show()
        setTimeout(() => {
          that.isRequest = true
          that.$http.get('albums', {page: that.cur_page + 1, per_page: that.per_page})
          .then(function (data) {
            that.albums = [...that.albums, ...data.data.data]
            that.cur_page = that.cur_page + 1
            that.isRequest = false
            let scrollTop = scroller[0].scrollHeight - scroller.height() - 20
            scroller.scrollTop(scrollTop)
            that.loading = false
            loader.hide()
          })
        }, 1500)
      }
    },
    components: {
      Pswb
    }
  }
</script>
