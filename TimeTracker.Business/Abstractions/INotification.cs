﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Business.Abstractions
{
    public interface INotification
    {
        Task SendMessage(string to, string title, string message);
    }
}
