$(document).ready(function(){
    console.log("Branch curso 1")
    // Load toggle button
    loadToggleBtn("body")
    // Load chatbot container
    loadChatbotContainer("body")
    
    // Toggle chatbot
    $(document).on("click", "#sofia-toggle-btn", function(){
        $("#sofia-chatbot-container").toggle("slow")
    })
    // Close chatbot
    $("#close-btn").on("click", function(){
        $("#sofia-chatbot-container").toggle("slow")
    })

    // Send message on submit
    $("#chat").on("submit", function(e){
        e.preventDefault()
        // Get message from input
        const userMessage = $("#message").val()
        // Not empty validation
        if(userMessage === "") return
        displayUserMessage(userMessage)
        sendMessageToBot(userMessage)
    })

    // Loading state
    $("#loading").on("load", function(){
        $(this).show()
        disableSendForm()
    })
})

// Load toggle button to the selected element
const loadToggleBtn = (element) => {
    let button = `
        <button id="sofia-toggle-btn">
            <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/sofia.png?updatedAt=1701196091122" alt="sofia-profile-picture">
        </button>`
    $(element).append(button)
}

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
                    <p>Hola, esta es la presentación inicial de sofIA. Aquí debo incluir en qué te puedo apoyar.</p>
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
        </div>`
    $(element).append(chatbotContainer)
}

// Display user message
const displayUserMessage = (message) => {
    let messageElement = `<div class="message">${message}</div>`
    $("#chat-content").append(messageElement)
    $("#message").val("")
}

// Send user message to API
const sendMessageToBot = (message) => {
    // API URL
    const SOFIA_API_URL = "https://llmcanvas-production.up.railway.app"
    // Show loading state
    $("#loading").trigger("load")
    // Format message
    question = { question: message }
    // Send message to API
    $.ajax({
        url: `${SOFIA_API_URL}/generate`,
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        type: "POST",
        data: JSON.stringify(question),
        dataType: "json",
        success: function(res){
            // Hide loading state
            $("#loading").hide()
            displayBotResponse(res.response)
            enableSendForm()
            // Focus textbox
            $("#message").focus()
        }
    })
}

// Display bot response element
const displayBotResponse = (response) => {
    let replyElement = `
        <div class="reply">
            <img src="https://ik.imagekit.io/taf6zzl9d/chatbot/sofia.png?updatedAt=1701196091122" alt="bot-profile-picture">
            <p>${response}</p>
        </div>`
    $("#chat-content").append(replyElement)
    // Scroll to bottom
    scrollToBottom(600)
}

// Enable send form
const enableSendForm = () => {
    // Disable button
    $("#message").prop("disabled", false)
    // Disable input
    $("#submit-btn").prop("disabled", false)
}

// Disable send form
const disableSendForm = () => {
    // Disable button
    $("#message").prop("disabled", true)
    // Disable input
    $("#submit-btn").prop("disabled", true)
}

const scrollToBottom = (duration) => {
    $("#chat-content").animate({
        scrollTop: $("#chat-content").prop('scrollHeight')
    }, duration);
}