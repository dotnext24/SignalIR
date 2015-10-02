using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalIR.Models
{
    public class MessageLog
    {
        public string Name { get; set; }

        public int EventID { get; set; }

        public string LogLevelName { get; set; }

        public string OperationCodeName { get; set; }

        public string ServerName { get; set; }

        public string ComponentName { get; set; }

        public string SubComponentName { get; set; }
    }
}