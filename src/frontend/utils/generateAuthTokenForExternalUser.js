export default (authObject) => {
    return authObject.currentUser.get().getAuthResponse().id_token
  };