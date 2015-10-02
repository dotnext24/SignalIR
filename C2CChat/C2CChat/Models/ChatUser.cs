using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace C2CChat.Models
{
    public class ChatUser
    {
        public int ID { get; set; }
        [Required]
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateTime Date { get; set; }

        public bool IsOnline { get; set; }
    }
}