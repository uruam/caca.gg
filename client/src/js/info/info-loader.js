const infoLoader = () => {
  const someText = document.getElementById("someText");
  someText.innerText = "INFO";

  const contentContainer = document.getElementById("contentContainer");
  contentContainer.innerText = "...";
};

export default infoLoader;
