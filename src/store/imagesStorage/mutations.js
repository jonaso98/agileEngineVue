// add the mutation to save the token access

export function setUserDetails(state, payload) {
  state.userDetails = payload;
  sessionStorage.setItem("userDetails", payload);
}
//add mutation seting images
export function setImagesMutation(state, payload) {
  state.images = payload;
}
