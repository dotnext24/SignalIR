using C2CChat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace C2CChat.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        public ActionResult Index()
        {
            ChatMessage model = new ChatMessage();
            var chatUser = db.Users.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            ViewBag.UserId = 1;
            model.RepliedBy = User.Identity.Name;

            List<ChatUser> usersOnline = db.ChatUsers.Where(u => u.IsOnline == true).ToList();
            ViewBag.OnlineUsers = usersOnline;
            return View(model);
        }

        public ActionResult Support(int chatUserId)
        {
            ChatMessage model = new ChatMessage();
            if (User.Identity.IsAuthenticated)
            {
                var chatUser = db.ChatUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
                ViewBag.RepliedBy = User.Identity.Name;
                model.ChatUserID = chatUserId;
            }
            return View(model);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}