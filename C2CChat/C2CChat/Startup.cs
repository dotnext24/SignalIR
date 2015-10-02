using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(C2CChat.Startup))]
namespace C2CChat
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            ConfigureAuth(app);
        }
    }
}
