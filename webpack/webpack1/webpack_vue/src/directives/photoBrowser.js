/**
 * @file photoBrowser.js
 * @author @huhb
 * 图片浏览器,点击弹出图片集浏览,左滑右滑啥的
 * // type 默认为 standalone 可选 standalone, popup,caption
 */

import $ from 'zepto'

export default {
  params: ['type'],

  bind () {
    console.log(99999)
    let el = $(this.el)
    let type = this.params.type
    let photos
    console.log(type)
    if (type === 'caption') {
      photos = $.map(el.find('.thumb-img'), function (item) {
        return {np
          url: $(item).data('originUrl'),
          caption: $(item).attr('alt')
        }
      })

      console.log(111111)
      console.log(photos)
      console.log(222222)
      // "http://192.168.5.206:8080/jssq/resource/view/img_src/4554539"
      // http://192.168.5.206:8080/jssq/resource/view/img_src/4554539
      // http://192.168.5.206:8080/jssq/resource/view/img_src/4553287
    }
    else if (type === 'popup') {

    }
    else {

    }

    var myPhotoBrowserCaptions = $.photoBrowser({
      photos: photos,
      theme: 'dark',
      type: 'standalone'
    })
    $(document).on('click', '.' + $(this.el).attr('class'), function () {
      myPhotoBrowserCaptions.open()
    })

  }
}
