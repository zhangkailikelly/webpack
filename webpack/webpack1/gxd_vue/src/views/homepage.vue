<template>
  <div class="homepage-wrapper">
  <header class="bar bar-nav home-header">
      <span class="icon icon-left pull-left" @click="goback()"></span>
    <h1>个人主页</h1>
  </header>

  <section class="home-wrapper" :style="{backgroundImage: 'url('+homepage.profile_back_url +')'}">
    <div class="clearfix home-content">
      <img :src="homepage.profile_image_url" alt="" class="home-avatar pull-left">
      <div class="home-info">{{homepage.name}}<br><span class="home-school">{{homepage.school}}</span></div>
    </div>
  </section>

  <section id="cd-timeline" class="cd-container"  v-if="feeds.length">


    <div class="cd-timeline-block" v-for ="feed in feeds">
      <div class="cd-timeline-img cd-picture">
      </div> <!-- cd-timeline-img -->

      <div class="cd-timeline-content">
        <p>

          <div>{{{feed.text}}}</div>

          <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe>
          <div id="columns">
            <figure class="pin" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"  v-for="album in feed.pics" >
              <a :href="album.original_url" itemprop="contentUrl" data-size="{{album.width}}x{{album.height}}">
                  <img :src="album.thumb_url" itemprop="thumbnail" :alt="album.text" />
              </a>
              <figcaption itemprop="caption description">{{album.text}} </figcaption>
              <p class="pull-right">{{{album.created_at}}} </p>
            </figure>
          </div>
          </div>

          <div style="background-color: #F3F3F3;padding: .5rem;" v-if="feed.retweeted.text || feed.retweeted.pics.length">
            <div>{{{feed.retweeted.text}}}</div>
            <div>转发自:{{{feed.retweeted.user.name}}}</div>
            <div itemscope itemtype="http://schema.org/ImageGallery" v-photo-swipe v-if="feed.retweeted.pics.length">
              <div id="columns">
                <figure class="pin" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"  v-for="album in feed.retweeted.pics" >
                  <a :href="album.original_url" itemprop="contentUrl" data-size="{{album.width}}x{{album.height}}">
                      <img :src="album.thumb_url" itemprop="thumbnail" :alt="album.text" />
                  </a>
                  <figcaption itemprop="caption description">{{album.text}} </figcaption>
                  <p class="pull-right">{{{album.created_at}}} </p>
                </figure>
              </div>
            </div>
          </div>

        </p>
        <span class="cd-date" v-if="$index==0 || ($index>0 && feed.created_at !==feeds[$index-1].created_at)">{{feed.created_at.split('-').splice(1,2).join('-')}}</span>



      </div> <!-- cd-timeline-content -->
    </div> <!-- cd-timeline-block -->


  </div>
</template>


<style scoped>

  .homepage-wrapper{
    background: #e9f0f5;
  }
  .home-header {
    text-align: center;
    height: 2rem;
    background: #1cbd9d;
    color: #fff;
  }
  .home-header::after {
    height: 0;
  }
  .home-header .l-icon-prev {
    color: #fff;
  }
  .home-header h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 2.2rem;
  }
  .home-header a {
    color: #fff;
    line-height: 2.2rem;
  }
  .home-avatar {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
  }

  .home-wrapper {
    position: relative;
    background-color: #e9f0f5;
    color:#fff;
    height: 10rem;
    margin-top: -.1rem;
  }
  .home-info {
    height: 3rem;
    line-height: 1.5rem;
  }
  .home-school {
    color: #3d4145;
  }
  .home-content {
    position: absolute;
    bottom: -1.5rem;
    left: 1.5rem;
    width: 100%;
  }

  /* --------------------------------

Modules - reusable parts of our design

-------------------------------- */
  .cd-container {
    /* this class is used to give a max-width to the element it is applied to, and center it horizontally when it reaches that max-width */
    width: 100%;
    max-width: 1170px;
    margin: 0 auto;
  }
  .cd-container::after {
    /* clearfix */
    content: '';
    display: table;
    clear: both;
  }

  /* --------------------------------

  Main components

  -------------------------------- */
  header {
    height: 200px;
    line-height: 200px;
    text-align: center;
    background: #303e49;
  }
  header h1 {
    color: white;
    font-size: 18px;
    font-size: 1.125rem;
  }
  @media only screen and (min-width: 1170px) {
    header {
      height: 300px;
      line-height: 300px;
    }
    header h1 {
      font-size: 24px;
      font-size: 1.5rem;
    }
  }

  #cd-timeline {
    position: relative;
    padding: 2em 0;
    margin-bottom: 12em;
    margin-top: 3rem;
    height: 15rem;
    overflow: auto;

  }
  #cd-timeline::before {
    /* this is the vertical line */
    content: '';
    position: absolute;
    top: 0;
    left: 2.38rem;
    height: 100%;
    width: 4px;
    background: #d7e4ed;
  }
  @media only screen and (min-width: 1170px) {
    #cd-timeline {
      margin-top: 3em;
      margin-bottom: 3em;
    }
    #cd-timeline::before {
      left: 50%;
      margin-left: -2px;
    }
  }

  .cd-timeline-block {
    position: relative;
    padding-bottom: 2em;
  }
  .cd-timeline-block::before {
    content: '';
    position: absolute;
    top: 0;
    left: 2.38rem;
    height: 100%;
    width: 4px;
    background: #d7e4ed;
  }
  .cd-timeline-block:after {
    content: "";
    display: table;
    clear: both;
  }
  .cd-timeline-block:first-child {
    margin-top: 0;
  }
  .cd-timeline-block:last-child {
    margin-bottom: 0;
  }
  @media only screen and (min-width: 1170px) {
    .cd-timeline-block {
      margin: 4em 0;
    }
    .cd-timeline-block:first-child {
      margin-top: 0;
    }
    .cd-timeline-block:last-child {
      margin-bottom: 0;
    }
  }

  .cd-timeline-img {
    position: absolute;
    top: 0;
    left: 2rem;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0 0 0 4px white, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
  }
  .cd-timeline-img img {
    display: block;
    width: 24px;
    height: 24px;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -12px;
    margin-top: -12px;
  }
  .cd-timeline-img.cd-picture {
    background: #75ce66;
  }
  .cd-timeline-img.cd-movie {
    background: #c03b44;
  }
  .cd-timeline-img.cd-location {
    background: #f0ca45;
  }
  @media only screen and (min-width: 1170px) {
    .cd-timeline-img {
      width: 60px;
      height: 60px;
      left: 50%;
      margin-left: -30px;
      /* Force Hardware Acceleration in WebKit */
      -webkit-transform: translateZ(0);
      -webkit-backface-visibility: hidden;
    }
    .cssanimations .cd-timeline-img.is-hidden {
      visibility: hidden;
    }
    .cssanimations .cd-timeline-img.bounce-in {
      visibility: visible;
      -webkit-animation: cd-bounce-1 0.6s;
      -moz-animation: cd-bounce-1 0.6s;
      animation: cd-bounce-1 0.6s;
    }
  }

  @-webkit-keyframes cd-bounce-1 {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.5);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale(1.2);
    }

    100% {
      -webkit-transform: scale(1);
    }
  }
  @-moz-keyframes cd-bounce-1 {
    0% {
      opacity: 0;
      -moz-transform: scale(0.5);
    }

    60% {
      opacity: 1;
      -moz-transform: scale(1.2);
    }

    100% {
      -moz-transform: scale(1);
    }
  }
  @keyframes cd-bounce-1 {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.5);
      -moz-transform: scale(0.5);
      -ms-transform: scale(0.5);
      -o-transform: scale(0.5);
      transform: scale(0.5);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      -moz-transform: scale(1.2);
      -ms-transform: scale(1.2);
      -o-transform: scale(1.2);
      transform: scale(1.2);
    }

    100% {
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
  }
  .cd-timeline-content {
    position: relative;
    margin-left: 60px;
    background: white;
    border-radius: 0.25em;
    padding: 1em;
    box-shadow: 0 3px 0 #d7e4ed;
    margin-left: 4rem;
    margin-right:1rem;
    top: -.5rem
  }
  .cd-timeline-content:after {
    content: "";
    display: table;
    clear: both;
  }
  .cd-timeline-content h2 {
    color: #303e49;
  }
  .cd-timeline-content p, .cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
    font-size: 13px;
    font-size: 0.8125rem;
  }
  .cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
    display: inline-block;
  }
  .cd-timeline-content p {
    margin: 1em 0;
    line-height: 1.6;
  }
  .cd-timeline-content .cd-read-more {
    float: right;
    padding: .8em 1em;
    background: #acb7c0;
    color: white;
    border-radius: 0.25em;
  }
  .no-touch .cd-timeline-content .cd-read-more:hover {
    background-color: #bac4cb;
  }
  .cd-timeline-content .cd-date {
    /*float: left;*/
    padding: .8em 0;
    opacity: .7;
    position: absolute;
    left: -5.8rem;
    top: 0;

  }
  .cd-timeline-content::before {
    content: '';
    position: absolute;
    top: 16px;
    right: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-right: 7px solid white;
  }
  @media only screen and (min-width: 768px) {
    .cd-timeline-content h2 {
      font-size: 20px;
      font-size: 1.25rem;
    }
    .cd-timeline-content p {
      font-size: 16px;
      font-size: 1rem;
    }
    .cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
      font-size: 14px;
      font-size: 0.875rem;
    }
  }
  @media only screen and (min-width: 1170px) {
    .cd-timeline-content {
      margin-left: 0;
      padding: 1.6em;
      width: 45%;
    }
    .cd-timeline-content::before {
      top: 24px;
      left: 100%;
      border-color: transparent;
      border-left-color: white;
    }
    .cd-timeline-content .cd-read-more {
      float: left;
    }
    .cd-timeline-content .cd-date {
      position: absolute;
      width: 100%;
      left: 122%;
      top: 6px;
      font-size: 16px;
      font-size: 1rem;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content {
      float: right;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content::before {
      top: 24px;
      left: auto;
      right: 100%;
      border-color: transparent;
      border-right-color: white;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-read-more {
      float: right;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-date {
      left: auto;
      right: 122%;
      text-align: right;
    }
    .cssanimations .cd-timeline-content.is-hidden {
      visibility: hidden;
    }
    .cssanimations .cd-timeline-content.bounce-in {
      visibility: visible;
      -webkit-animation: cd-bounce-2 0.6s;
      -moz-animation: cd-bounce-2 0.6s;
      animation: cd-bounce-2 0.6s;
    }
  }

  @media only screen and (min-width: 1170px) {
    /* inverse bounce effect on even content blocks */
    .cssanimations .cd-timeline-block:nth-child(even) .cd-timeline-content.bounce-in {
      -webkit-animation: cd-bounce-2-inverse 0.6s;
      -moz-animation: cd-bounce-2-inverse 0.6s;
      animation: cd-bounce-2-inverse 0.6s;
    }
  }
  @-webkit-keyframes cd-bounce-2 {
    0% {
      opacity: 0;
      -webkit-transform: translateX(-100px);
    }

    60% {
      opacity: 1;
      -webkit-transform: translateX(20px);
    }

    100% {
      -webkit-transform: translateX(0);
    }
  }
  @-moz-keyframes cd-bounce-2 {
    0% {
      opacity: 0;
      -moz-transform: translateX(-100px);
    }

    60% {
      opacity: 1;
      -moz-transform: translateX(20px);
    }

    100% {
      -moz-transform: translateX(0);
    }
  }
  @keyframes cd-bounce-2 {
    0% {
      opacity: 0;
      -webkit-transform: translateX(-100px);
      -moz-transform: translateX(-100px);
      -ms-transform: translateX(-100px);
      -o-transform: translateX(-100px);
      transform: translateX(-100px);
    }

    60% {
      opacity: 1;
      -webkit-transform: translateX(20px);
      -moz-transform: translateX(20px);
      -ms-transform: translateX(20px);
      -o-transform: translateX(20px);
      transform: translateX(20px);
    }

    100% {
      -webkit-transform: translateX(0);
      -moz-transform: translateX(0);
      -ms-transform: translateX(0);
      -o-transform: translateX(0);
      transform: translateX(0);
    }
  }
  @-webkit-keyframes cd-bounce-2-inverse {
    0% {
      opacity: 0;
      -webkit-transform: translateX(100px);
    }

    60% {
      opacity: 1;
      -webkit-transform: translateX(-20px);
    }

    100% {
      -webkit-transform: translateX(0);
    }
  }
  @-moz-keyframes cd-bounce-2-inverse {
    0% {
      opacity: 0;
      -moz-transform: translateX(100px);
    }

    60% {
      opacity: 1;
      -moz-transform: translateX(-20px);
    }

    100% {
      -moz-transform: translateX(0);
    }
  }
  @keyframes cd-bounce-2-inverse {
    0% {
      opacity: 0;
      -webkit-transform: translateX(100px);
      -moz-transform: translateX(100px);
      -ms-transform: translateX(100px);
      -o-transform: translateX(100px);
      transform: translateX(100px);
    }

    60% {
      opacity: 1;
      -webkit-transform: translateX(-20px);
      -moz-transform: translateX(-20px);
      -ms-transform: translateX(-20px);
      -o-transform: translateX(-20px);
      transform: translateX(-20px);
    }

    100% {
      -webkit-transform: translateX(0);
      -moz-transform: translateX(0);
      -ms-transform: translateX(0);
      -o-transform: translateX(0);
      transform: translateX(0);
    }
  }

  .cd-container {
    color: #7f8c97;
    background-color: #e9f0f5;
  }

  .cd-container a {
    color: #acb7c0;
  }

  .cd-timeline-content img {
    width: 4rem;
  }
  figure {
    display: inline-block;
    margin-top: .5rem;
    margin-right: .2rem;
  }

</style>

<script>

  import $ from 'zepto'
  import Pswb from '../components/Pswb'
  export default {
    route: {
      data ({to, next}) {

        console.log(to)
        return this.$http.get('homepage/' + to.params.id).then(({data}) => {
          this.$set('homepage', data)
          this.$set('feeds', data.feeds.data)
        })
      }
    },
    ready () {
      $.init()
    },
    data () {
      return {
        homepage: {},
        feeds: []
      }
    },
    methods: {
      goback () {
        console.log(2222)
        this.$route.router.go(window.history.back())
      }
    },
    components: {
      Pswb
    }
  }
</script>

