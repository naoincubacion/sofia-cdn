$(document).ready(function () {
  //console.log("IDS  - current");
  // Load toggle button
  loadToggleBtn("body");
  // Load chatbot container
  loadChatbotContainer("body");
  // Load cta dialog after 5 seconds
  /*setTimeout(function () {
    loadSofiaDialog($("body"));
  }, 2000);*/

  // Toggle chatbot
  $(document).on("click", "#sofia-toggle-btn", function () {
    $("#sofia-chatbot-container").toggle("slow");
    $("#sofia-dialog").hide("slow"); // Close dialog
  });
  // Close chatbot
  $("#close-btn").on("click", function () {
    $("#sofia-chatbot-container").toggle("slow");
  });

  // Send message on submit
  $("#chat").on("submit", function (e) {
    e.preventDefault();
    // Get message from input
    const userMessage = $("#message").val();
    // Not empty validation
    if (userMessage === "") return;
    displayUserMessage(userMessage);
    sendMessageToBot(userMessage);
  });

  // Loading state
  $("#loading").on("load", function () {
    $(this).show();
    disableSendForm();
  });

  // Check and set user ID in cookies
  setUserId();
});

// Generate a random ID
const generateRandomId = () => {
  return "tbo-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );
};

// Check and set user ID
const setUserId = () => {
  let userId = localStorage.getItem("userId");
  //console.log(`Retrieved userId from localStorage: ${userId}`);

  if (!userId) {
    userId = generateRandomId();
    localStorage.setItem("userId", userId);
    //console.log(`Generated and set new userId: ${userId}`);
  }
};

// Get user ID
const getUserId = () => {
  return localStorage.getItem("userId");
};

// Load toggle button to the selected element
const loadToggleBtn = (element) => {
  let button = `
        <button id="sofia-toggle-btn">
            <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/sofia.png?updatedAt=1701196091122" alt="sofia-profile-picture">
        </button>`;
  $(element).append(button);
};

// Load chatbot container to the selected element
const loadChatbotContainer = (element) => {
  let chatbotContainer = `
        <div id="sofia-chatbot-container">
            <div class="header">
                <h6>sofIA</h6>
                <button id="close-btn" class="close-btn">
                    <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/close.png?updatedAt=1701196924568" alt="close-btn-image">
                </button>
            </div>
            <div id="chat-content" class="content">
                <div class="reply">
                    <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/sofia.png?updatedAt=1701196091122" alt="bot-profile-picture">
                    <p>Soy sofIA, tu asistente especializada en Tecmilenio. Estoy aquí para simplificar tus procesos, desde conocer los eventos de la Universidad, hasta conocer las diferentes carreras y servicios que les podemos dar a los estudiantes, estoy aquí para apoyarte.</p>
                </div>
                <div id="loading" class="loading">
                    <div class="dot first"></div>
                    <div class="dot middle"></div>
                    <div class="dot last"></div>
                </div>
            </div>
            <form id="chat">
                <input type="text" name="message" id="message" placeholder="Escribe...">
                <button id="submit-btn" class="send-btn" type="submit">
                    <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/chevron.png?updatedAt=1701195945915" alt="chevron">
                </button>
            </form>
        </div>`;
  $(element).append(chatbotContainer);
};

// Load cta dialog to encourage usage
const loadSofiaDialog = (element) => {
  let dialog = `
        <div id="sofia-dialog">
            <p>Soy SofIA, estoy aquí para apoyarte y acompañarte.</p>
            <button id="close-sofia-dialog">
                <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/close.png?updatedAt=1701196924568" alt="close-btn-image">
            </button>
        </div>`;
  $(element).append(dialog);
  // Close dialog
  $("#close-sofia-dialog").on("click", function () {
    $("#sofia-dialog").toggle("slow");
  });
};

// Display user message
const displayUserMessage = (message) => {
  let messageElement = `<div class="message">${message}</div>`;
  $("#chat-content").append(messageElement);
  $("#message").val("");
};

// Send user message to API
const sendMessageToBot = (message) => {
  // Show loading state
  $("#loading").trigger("load");
  // Format message
  // Format message
  const data = {
    message: message,
    user_id: getUserId(),
  };

  /* console.log("data");
  console.log(data); */

  // Send message to API
  $.ajax({
    url: "https://sofiaadmisiones.nowisnao.com/alex-api/mentor",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    type: "POST",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (res) {
      // Hide loading state
      $("#loading").hide();
      displayBotResponse(res.response);
      enableSendForm();
      // Focus textbox
      $("#message").focus();
    },
  });
};

// Display bot response element
const displayBotResponse = (response) => {
  let replyElement = `
        <div class="reply">
            <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/sofia.png?updatedAt=1701196091122" alt="bot-profile-picture">
            <p>${response}</p>
        </div>`;
  $("#chat-content").append(replyElement);
  // Scroll to bottom
  scrollToBottom(600);
};

// Enable send form
const enableSendForm = () => {
  // Disable button
  $("#message").prop("disabled", false);
  // Disable input
  $("#submit-btn").prop("disabled", false);
};

// Disable send form
const disableSendForm = () => {
  // Disable button
  $("#message").prop("disabled", true);
  // Disable input
  $("#submit-btn").prop("disabled", true);
};

const scrollToBottom = (duration) => {
  $("#chat-content").animate(
    {
      scrollTop: $("#chat-content").prop("scrollHeight"),
    },
    duration,
  );
};
