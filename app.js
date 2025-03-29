const userName = document.getElementById("user");
const loginButton = document.getElementById("loginBtn");

loginButton.addEventListener("click", (e) => {
  const userNameValue = userName.value;
  const password = document.getElementById("pass").value;

  if (!userNameValue) {
    alert("Enter your first name");
    return;
  }

  const convertPassword = parseInt(password);

  if (convertPassword !== 123456) {
    alert("Enter pin 123456");
    return;
  }

  Swal.fire({
    title: "Success!",
    text: "You have logged in successfully.",
    icon: "success",
    confirmButtonText: "Start learning",
  });

  document.getElementById("hero-toggle").classList.add("hidden");
  document.getElementById("words-toggle").classList.remove("hidden");
  document.getElementById("header").classList.remove("hidden");
});

const faqButton = document.getElementById("faq-btn");
const faqSection = document.getElementById("faq-section");

const learnButton = document.getElementById("learn-btn");
const learnSection = document.getElementById("learn-section");

faqButton.addEventListener("click", () => {
  faqSection.scrollIntoView({
    behavior: "smooth",
  });
});

learnButton.addEventListener("click", () => {
  learnSection.scrollIntoView({
    behavior: "smooth",
  });
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  document.getElementById("hero-toggle").classList.remove("hidden");
  document.getElementById("words-toggle").classList.add("hidden");
  document.getElementById("header").classList.add("hidden");
});

//Lessons API

const lessonButton = "https://openapi.programming-hero.com/api/levels/all";
fetch(lessonButton)
  .then((res) => res.json())
  .then((data) => {
    lessonsbtn(data.data);
  });

const lessonsbtn = (datas) => {
  const lessonSection = document.getElementById("lessons-section");
  for (const lesson of datas) {
    const div = document.createElement("div");
    div.innerHTML = `
    
    <button onclick="loadWordLevel(${lesson.level_no})" id="btn-${lesson.level_no}" class="btn btn-outline btn-primary font-['Poppins'] flex"><i class="fa-solid fa-book"></i>Lesson -${lesson.level_no}</button>
    `;

    lessonSection.appendChild(div);
  }
};

const removeActive = () => {
  const activeButtons = document.getElementsByClassName(
    "bg-[#3B25C1]",
    "text-white"
  );
  for (const btn of activeButtons) {
    btn.classList.remove("bg-[#3B25C1]", "text-white");
  }
};

const loadWordLevel = (id) => {
  // console.log(id);
  showLoader();
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickedBtn = document.getElementById(`btn-${id}`);
      clickedBtn.classList.add("bg-[#3B25C1]", "text-white");
      wordsInfo(data.data);
    });
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // Japanese
  window.speechSynthesis.speak(utterance);
}

const wordsInfo = (words) => {
 
  const wordSection = document.getElementById("word-section");
  wordSection.innerHTML = "";
  for (const word of words) {
    
    const div = document.createElement("div");
    div.classList.add("text-center");
    div.innerHTML = `
         <div class="bg-white w-[420px] text-center p-10 rounded-lg">
                <h1 class="text-[1.7rem] font-bold font-['Poppins'] text-center">${
                  word.word
                }</h1>
                <p class="mt-2">Meaning/Pronunciation</p>
                <p class="mt-3 text-[1.5rem] font-bold text-gray-700">${
                  word.meaning ? word.meaning : "No Word"
                } / ${word.pronunciation}</p>
                <div class="flex justify-between mt-10">
                    <i class="fa-solid fa-circle-info bg-[#e8f4ff] p-2 rounded-lg" onclick="loadWordDetails('${
                      word.id
                    }')"></i>
                    <i class="fa-solid fa-volume-high bg-[#e8f4ff] p-2 rounded-lg cursor-pointer" onclick="pronounceWord('${
                      word.word
                    }')" id="speak"></i>
                    
                </div>
            </div>
         
        `;

    wordSection.appendChild(div);
  }
  if (words.length === 0) {
    wordSection.innerHTML = `
        <div class="text-center w-full col-span-3 items-center justify-items-center">
        <img src="images/invalid.png">
        <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h3 class="text-[2rem] font-semibold text-gray-700">নেক্সট Lesson এ যান</h3>
        </div>
        `;
  }
  removeLoader();
};

const loadWordDetails = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      wordDetails(data.data);
    });
};

const wordDetails = (data) => {
  console.log(data);
  document.getElementById("word_details").showModal();
  const detailContainer = document.getElementById("details-container");

  const synonyms = data.synonyms
    .map((s) => `<p class="bg-[#edf7ff] p-2 rounded-lg gap-2">${s}</p>`)
    .join("");
  console.log(synonyms);

  detailContainer.innerHTML = `
  <h1 class="text-[2rem] font-bold">${data.word} (${data.pronunciation})</h1>
  <p class="text[1.3rem] font-bold mt-3">Meaning</p>
  <p>${data.meaning ? data.meaning : "No Word found"}</p>
  <p class="text[1.3rem] font-bold mt-3">Example</p>
  <p>${data.sentence}</p>
  <p class="my-3 text-[1rem] font-bold">সমার্থক শব্দ গুলো</p>
  <div class="flex gap-2">
   ${synonyms ? synonyms : "No synonyms"}
   
  </div>
  
  
  `;
};

const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("word-section").classList.add("hidden");
};

const removeLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("word-section").classList.remove("hidden");
};
