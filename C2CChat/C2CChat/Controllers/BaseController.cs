using C2CChat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace C2CChat.Controllers
{
    public class BaseController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (!User.Identity.IsAuthenticated)
            {
                filterContext.Result = new RedirectToRouteResult(
                       new RouteValueDictionary { { "controller", "Account" }, { "action", "Register" } });
                return;
            }

        }
	}
}