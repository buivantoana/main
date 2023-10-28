let blocktext = document.querySelector(".blocktext");
let lever = 1;
let speed;
let checklose = 0;
let checkstart = 0;
let checkcontinue = 0;

let arrfilter = [];

async function renderText() {
  let res = await fetch(`http://localhost:3000/game?lever=${lever}`);
  let data = await res.json();

  let html = "";
  data[0].text.map((item) => {
    return (html += `<div class="text">${item}</div>`);
  });
  speed = data[0].speed;
  return (blocktext.innerHTML = html);
}
renderText();
async function render() {
  let indexs = 0;
  await renderText();
  let blockbulet = document.querySelector(".blockbulet");
  let text = document.querySelectorAll(".text");
  let title = document.querySelector(".title");
  let start = document.querySelector(".start");
  let spaceship = document.querySelector(".spaceship");
  let win = document.querySelector(".win");
  let lose = document.querySelector(".lose");
  let playagain = document.querySelector(".playagain");
  let play = document.querySelector(".play");
  let again = document.querySelector(".again");
  let continueevent = document.querySelector(".continue");
  let winp = document.querySelector(".win p");
  let pause = document.querySelector(".pause");
  let containerpause = document.querySelector(".container-pause");
  let pausecontinue = document.querySelector(".pause-continue");
  let check = 0;
  let topCoordinate = 0;
  let leftCoordinate = 0;
  let ispause = false;

  let count = 0;
  let countbulet = 0;

  for (let i = 0; i < text.length; i++) {
    text[i].style.left = `${Math.random() * (80 - 1 + 1) + 1}%`;
  }

  function renderbulet(number, bulet) {
    let html = "";
    for (let i = 0; i <= number; i++) {
      html += `<img class="bulet bulet${i}" src="./image/Ohb8MN.png" alt="" />`;
    }
    return (bulet.innerHTML = html);
  }

  function arrone(key) {
    text.forEach((item, index) => {
      if (item.textContent.split("")[0] == key) {
        indexs = index;
        return arrfilter.push(item);
      }
    });
  }

  function moveKey(check) {
    let texts = document.querySelectorAll(".text");
    let top;

    if (ispause) {
      return;
    }

    for (let i = 0; i < texts.length; i++) {
      top = parseFloat(texts[i].style.top) || -200;
      texts[i].style.top = top + speed + "px";
    }

    topCoordinate = text[indexs].offsetTop;
    leftCoordinate = text[indexs].offsetLeft;

    if (!texts[0]) {
      return;
    } else {
      if (top > 500) {
        if (texts[0]) {
          lose.classList.add("hiddenlose");
          blocktext.style.display = "none";
          pause.style.opacity = "0";
          spaceship.style.bottom = "80px";
          blockbulet.style.display = "none";
          lever = 1;
          checklose = 1;
          arrfilter = [];

          return;
        } else {
          pause.style.opacity = "0";
          return;
        }
      }
    }
    if (check == true) {
    } else {
      requestAnimationFrame(moveKey);
    }
  }

  pausecontinue.onclick = function () {
    ispause = false;
    moveKey(false);
    pause.style.opacity = "1";
    containerpause.classList.remove("hidden-container-pause");
  };
  pause.onclick = function () {
    pause.style.opacity = "0";
    ispause = true;
    containerpause.classList.add("hidden-container-pause");
  };
  if (checkcontinue == 1) {
    moveKey(false);
  }
  if (checklose == 1 && checkcontinue == 0) {
    moveKey(false);
  }

  again.onclick = function () {
    play.classList.remove("hiddenplay");
    title.classList.remove("nonetitle");
  };
  playagain.onclick = async function () {
    blocktext.style.display = "block";
    lose.classList.remove("hiddenlose");
    pause.style.opacity = "1";
    spaceship.style.bottom = "20px";
    checkcontinue = 0;
    checkstart = 0;

    await render();
    check = 0;

    window.removeEventListener("keydown", onkeyDown);
    setTimeout(() => {
      blockbulet.style.display = "block";
    }, 500);
  };
  continueevent.onclick = async function () {
    win.classList.remove("hiddenwin");
    spaceship.style.bottom = "20px";
    pause.style.opacity = "1";
    checkstart = 0;
    check = 0;
    await render();

    window.removeEventListener("keydown", onkeyDown);
    setTimeout(() => {
      blockbulet.style.display = "block";
    }, 500);
  };

  if (checkstart == 1 && checkcontinue == 0) {
    moveKey(false);
  }
  start.onclick = async function () {
    title.classList.add("nonetitle");
    pause.style.opacity = "1";
    spaceship.style.bottom = "20px";
    checklose = 0;
    if (checkstart == 1) {
      check = 0;
      await render();
      window.removeEventListener("keydown", onkeyDown);
    } else {
      moveKey(false);
    }
  };
  async function onkeyDown(e) {
    if (!arrfilter[0] || check == 0) {
      check++;
      arrone(e.key);
      renderbulet(arrfilter[0].textContent.split("").length, blockbulet);
      countbulet = 0;
      moveKey(true);
    }

    if (arrfilter[0]) {
      text[indexs].style.color = "red";
      let arr = arrfilter[0].textContent.split("");

      if (count >= arrfilter[0].textContent.length) {
      } else {
        if (arr[count] == e.key) {
          let bulet = document.querySelector(`.bulet${countbulet}`);
          console.log(countbulet);

          bulet.style.top = `${topCoordinate + 25}px`;
          bulet.style.left = `${leftCoordinate - 5}px`;
          bulet.style.transition = ".5s";

          countbulet++;

          setTimeout(() => {
            bulet.src = "./image/png_explosion_80725.png";
            setTimeout(() => {
              bulet.remove();
            }, 200);
          }, 500);
          arr.splice(0, 1);
          let innertext = arr.join("");
          text[indexs].innerHTML = innertext;

          if (text[indexs].textContent == "") {
            arrfilter = [];

            text[indexs].remove();
            let textblock = document.querySelectorAll(".text");

            if (!textblock[0]) {
              let data = await fetch(
                `http://localhost:3000/game?lever=${lever + 1}`
              );
              let res = await data.json();
              if (res[0]) {
                setTimeout(() => {
                  pause.style.opacity = "0";
                  win.classList.add("hiddenwin");
                  winp.innerHTML = `Lever ${lever}`;
                  blockbulet.style.display = "none";
                  spaceship.style.bottom = "80px";
                  checkcontinue = 1;
                  lever++;
                  checkrender = true;
                }, 500);
              } else {
                pause.style.opacity = "0";
                play.classList.add("hiddenplay");
                spaceship.style.bottom = "60px";
                lever = 1;
                checkcontinue = 0;
                checkstart = 1;
                blockbulet.innerHTML = "";
              }
            }
          }
        }
      }
    }
  }
  window.addEventListener("keydown", onkeyDown);
}

render();
