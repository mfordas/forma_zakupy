export default (authObject) => {
    console.log(authObject);
    return authObject.currentUser.get().getAuthResponse().id_token
  };