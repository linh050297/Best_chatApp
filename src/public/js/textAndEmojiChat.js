
function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        let currentEmojioneArea = $(this);

        if(element.which === 13){ //nút enter 13
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if(!targetId.length && !messageVal.length){
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            }
            if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
                dataTextEmojiForSend.isChatGroup = true;
            }

            //call send message
            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
                let dataToEmit = {
                    message: data.message,
                };
                //success
                //xử lý dữ liệu trước khi hiển thị
                let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                let convertEmojiMessage = emojione.toImage(messageOfMe.html());

                if(dataTextEmojiForSend.isChatGroup){
                    let senderAvatar = `<img src="${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" alt="" />`;
                    messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else{
                    dataToEmit.contactId = targetId;
                    messageOfMe.html(convertEmojiMessage);
                    // increaseNumberMessageGroup(divId);
                }

                //append meesage data to screen
                
                $(`.right .chat[data-chat=${ divId }]`).append(messageOfMe);
                nineScrollRight(divId);

                //xóa data input trên thanh nhập
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                //thay đổi data preview và time left side
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());

                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // move conversation to top sử dụng jquery namespace
                $(`.person[data-chat=${divId}]`).on('vanlinh.moveConversationToTheTop', function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off('vanlinh.moveConversationToTheTop');
                });
                $(`.person[data-chat=${divId}]`).trigger("vanlinh.moveConversationToTheTop"); 

                //emit realtime
                socket.emit("chat-text-emoji", dataToEmit)

                //emit remove typing real-time
                typingOff(divId);

                //if this has typing remove that imediately
                let checkTyping = $(`.chat[data-chat=${response.divId}]`).find("div.bubble-typing-gif");
                if(checkTyping.length){
                    checkTyping.remove();
                }

            }).fail(function(res){
                console.log('res: ', res);
                alertify.notify(res.responseText, "error", 7)

            });
        }
    })
}

$(document).ready(function(){
    socket.on("response-chat-text-emoji", function(response){
        console.log('response: ', response);
        let divId = "";
        //xử lý dữ liệu trước khi hiển thị
        let messageOfYou = $(`<div class="bubble you data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfYou.html());

        if(response.currentGroupId){
            divId = response.currentGroupId;
            let senderAvatar = `<img src="${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" alt="" />`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

            if(response.currentUserId !== $("#dropdown-navbar-user").data("uid") ){
                increaseNumberMessageGroup(divId);
            }
            
        }else{
            messageOfYou.html(convertEmojiMessage);
            divId = response.currentUserId;
            // increaseNumberMessageGroup(divId);
        }

        //append mesage data to screen
        //khi chat group thì gửi về cùng tin nhắn vs cùng id nên bị trùng gây double tin nhắn, cần check lại trùng
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid") ){
            $(`.right .chat[data-chat=${ divId }]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
        };
        

        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale('vi').startOf('seconds').fromNow());

        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));
    
        // move conversation to top sử dụng jquery namespace
        $(`.person[data-chat=${divId}]`).on('vanlinh.moveConversationToTheTop', function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off('vanlinh.moveConversationToTheTop');
        });
        $(`.person[data-chat=${divId}]`).trigger("vanlinh.moveConversationToTheTop"); 
    })
});