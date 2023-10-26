const password = document.querySelector("[password-Data]");
const copyMsg = document.querySelector(".CopiedText");
const copyBtn = document.querySelector("[copyBtn]");
const num = document.querySelector("[numbers]");
const slider = document.querySelector("[slider-Data]");
const upper = document.querySelector("#uppercase");
const lower = document.querySelector("#lowercase");
const numb = document.querySelector("#numb");
const symbol = document.querySelector("#symbol");
const colour = document.querySelector(".colour");
const generatePassword = document.querySelector("[generateButton]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const s = " !\"#$%&'()*+,-./:;<=>?[\\]^_`{|}~";

let passwordLength = 10;
let passToprint = "";
let countCheck = 0;

handleSlider();

function handleSlider() {
  slider.value = passwordLength;
  num.textContent = passwordLength;
  const max = slider.max;
  const min = slider.min;
  slider.style.backgroundSize =
    ((passwordLength - min) / max - min) * 100 + "% 100%";
}

//set the colour of indiactor
// colVariable is selected from the passwordStrength function
function setColor(colVariable) {
  colour.style.backgroundColor = colVariable;
  colour.style.boxShadow = "1px 1px 0px 6px ${colVariable}";
}

function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function rndNum() {
  return rndInt(0, 9);
}

function rndUpper() {
  return String.fromCharCode(rndInt(65, 91));
}
function rndLower() {
  return String.fromCharCode(rndInt(97, 123));
}

function rndSym() {
  let size = s.length;
  let idx = rndInt(0, size);
  return s.charAt(idx);
}

function PassStrength() {
  let chNUm = false;
  let chLower = false;
  let chUpper = false;
  let chSym = false;

  if (uppercase.checked) chUpper = true;
  if (lowercase.checked) chLower = true;
  if (numb.checked) chNUm = true;
  if (symbol.checked) chSym = true;

  if (
    ((chNUm || chSym) && chLower && chUpper && passwordLength >= 5) ||
    (chNUm && chSym && chLower && chUpper && passwordLength >= 4)
  )
    setColor("#0f0");
  else if ((chLower || chUpper) && chNUm && chSym && passwordLength >= 6)
    setColor("#0ff0");
  else setColor("#f00");
}

async function CopyClipboard() {
  try {
    await navigator.clipboard.writeText(password.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Not Copied";
  }

  copyMsg.classList.add("activateCopiedText");
  // if we want to remove copied text after 1 sec we need to  setTimeout

  setTimeout(() => copyMsg.classList.remove("activateCopiedText"), 2000);
}

slider.addEventListener("input", function (e) {
  passwordLength = parseInt(e.target.value);

  handleSlider();
});

copyBtn.addEventListener("click", function (e) {
  if (password.value) CopyClipboard();
});

function handleCheckBoxChange() {
  countCheck = 0;

  allCheckBox.forEach(function (checkbox) {
    if (checkbox.checked) countCheck++;
  });

  if (passwordLength < countCheck) {
    passwordLength = countCheck;
    handleSlider();
  }
}

allCheckBox.forEach(function (checkbox) {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

//Fisher Yates Shuffle Method
function shufflePassowrd(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  let str = "";
  arr.forEach(function (element) {
    str += element;
  });

  return str;
}

generatePassword.addEventListener("click", function () {
  passToprint = "";
  if (countCheck == 0) return;

  if (countCheck > passwordLength) {
    passwordLength = countCheck;
    handleSlider();
  }

  //trying to get ne password so need to remve the old one

  let funarr = [];

  if (upper.checked) funarr.push(rndUpper());
  if (lower.checked) funarr.push(rndLower());
  if (numb.checked) funarr.push(rndNum());
  if (symbol.checked) funarr.push(rndSym());

  for (let i = 0; i < funarr.length; i++) {
    passToprint += funarr[i];
  }

  for (let i = 0; i < passwordLength - funarr.length; i++) {
    let rndIdx = rndInt(0, funarr.length);
    passToprint += funarr[rndIdx];
  }

  let arr = [...passToprint];
  passToprint = shufflePassowrd(arr);
  password.value = passToprint;
  PassStrength();
});
