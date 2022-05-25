//Get id parameter from url
function getID() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

//
function redirect(url) {
  window.location.href = url;
}
