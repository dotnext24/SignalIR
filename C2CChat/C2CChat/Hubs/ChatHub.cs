using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using C2CChat.Models;
using Microsoft.AspNet.Identity;

namespace C2CChat.Hubs
{
    public class ChatHub : Hub
    {
        public void GetAll()
        {
            using (var context = new ApplicationDbContext())
            {
                var message = context.ChatMessages.ToArray();
                Clients.Caller.chatMessageRetrieved(message);
            }
        }

        public void GetOnline()
        {
            using (var context = new ApplicationDbContext())
            {
                var users = context.ChatUsers.Where(o=>o.IsOnline).ToArray();
                Clients.Caller.onlineUserRetrieved(users);
            }
        }

        public bool Add(ChatMessage newChatMessage)
        {
            bool result = false;

            try
            {
                using (var context = new ApplicationDbContext())
                {
                    
                        var message = context.ChatMessages.Create();
                        message.Message = newChatMessage.Message;
                        message.ChatUserID = newChatMessage.ChatUserID;
                        message.RepliedBy = newChatMessage.RepliedBy;
                        message.Date = DateTime.Now;
                        context.ChatMessages.Add(message);
                        context.SaveChanges();
                        Clients.All.messageCreated(message);
                        result = true;
                    
                }
            }
            catch (Exception)
            {
                Clients.Caller.raiseError("Unable to create a new Person.");
            }

            return result;
        }

        public bool Update(ChatMessage updatedChatMessage)
        {
            bool result = false;

            try
            {
                using (var context = new ApplicationDbContext())
                {
                    var existingChatMessage = context.ChatMessages.FirstOrDefault(x => x.ID == updatedChatMessage.ID);

                    if (existingChatMessage != null)
                    {
                        existingChatMessage.Message = updatedChatMessage.Message;
                        existingChatMessage.ChatUserID = updatedChatMessage.ChatUserID;
                        existingChatMessage.RepliedBy = updatedChatMessage.RepliedBy;
                        
                        context.SaveChanges();
                        Clients.All.chatMessageUpdated(existingChatMessage);
                        result = true;
                    }
                }
            }
            catch (Exception)
            {
                Clients.Caller.raiseError("Unable to update the Person.");
            }

            return result;
        }

        public bool Delete(int id)
        {
            bool result = false;

            try
            {
                using (var context = new ApplicationDbContext())
                {
                    var existingChatMessage = context.ChatMessages.FirstOrDefault(x => x.ID == id);

                    if (existingChatMessage != null)
                    {
                        context.ChatMessages.Remove(existingChatMessage);
                        context.SaveChanges();
                        Clients.All.messageRemoved(id);
                        result = true;
                    }
                }
            }
            catch (Exception)
            {
                Clients.Caller.raiseError("Unable to update the Person.");
            }

            return result;
        }
    }

    public class CustomUserIdProvider : IUserIdProvider
    {
        public string GetUserId(IRequest request)
        {
            // your logic to fetch a user identifier goes here.

            // for example:

            var userId = "";
            return userId.ToString();
        }
    }
}