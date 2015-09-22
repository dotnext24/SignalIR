using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SignalIR.Startup))]
namespace SignalIR
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
