import { observable, action } from 'mobx';

class UserStore {
  userInfo = observable({
    userName: '',
  })

  getUserInfo = action(() => {
    this.userInfo = {
      userName: localStorage.getItem('userName'),
    };
  })

  setUserInfo = action((userInfo) => {
    this.userInfo = userInfo;
  })
}

export default new UserStore();
