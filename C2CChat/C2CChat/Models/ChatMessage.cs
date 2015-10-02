using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace C2CChat.Models
{
    public class ChatMessage
    {
        public int ID { get; set; }
        [Required]
        public string Message { get; set; }
        public string RepliedBy { get; set; }

        [Required]
        public int ChatUserID { get; set; }
        public DateTime Date { get; set; }

        public ChatUser ChatUser { get; set; }
    }
}