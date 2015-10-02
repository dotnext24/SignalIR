using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace C2CChat.ViewModels
{
    public class ChatRoomViewModel
    {
       
        public string Message { get; set; }
        public string RepliedBy { get; set; }
        public string ChatUserName { get; set; } 
    }
}