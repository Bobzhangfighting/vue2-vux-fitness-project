
import Vue from 'vue'
import axios from "axios";
import stores from '../../store/store'
import {AlertPlugin } from 'vux'
Vue.use(AlertPlugin)
var HttpRequest = {
  getRequest({ url, data = {}, method = "GET" }) {
    return new Promise((resolve, reject) => {
      this._getRequest(url, resolve, reject, data, method);
    });
  },
  _getRequest: function(url, resolve, reject, data = {}, method = "GET") {
    let format = method.toLocaleLowerCase() ==='get'?'params':'data';
    stores.commit('UPDATE_LOADING', true);
    axios({
      url: url,
      method: method,
      [format]: data,
      header: {
        "content-type": "application/json"
      }
    }).then(res => {
        stores.commit('UPDATE_LOADING', false);
        resolve(res.data);
    }).catch((err) => {
        stores.commit('UPDATE_LOADING', false)
        reject(err);
    })
  }
};
export default HttpRequest;