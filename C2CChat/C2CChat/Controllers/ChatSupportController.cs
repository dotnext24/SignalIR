using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using C2CChat.ViewModels;
using C2CChat.Models;
namespace C2CChat.Controllers
{
  

    public class ChatSupportController : Controller
    {
       
        private ApplicationDbContext db = new ApplicationDbContext();
        public ActionResult Index()
        {

            ChatMessage model = new ChatMessage();
            if (User.Identity.IsAuthenticated)
            {
                var chatUser = db.ChatUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
                ViewBag.ChatUserID = chatUser.ID;
                model.ChatUserID = chatUser.ID;
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