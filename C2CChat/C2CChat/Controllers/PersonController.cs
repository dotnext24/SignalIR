using System.Web.Mvc;

namespace C2CChat.Controllers
{
    [Authorize]
    public class PersonController : Controller
    {
        //
        // GET: /Person/

        public ActionResult Index()
        {
            return View();
        }
    }
}
