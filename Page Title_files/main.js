const movePaddle = function () {
  console.log('state', 'ment');
  setInterval(function () {
    document.getElementById('paddle').style.marginLeft = "20%";
    console.log('hello', document.getElementById('paddle').style.width += "20px");
  }, 1000)
  console.log(document.getElementById('paddle').style);
};