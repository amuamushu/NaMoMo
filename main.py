"""Simple example app to demonstrate storing info for users.

CSSI-ers!  If you want to have users log in to your site and store
info about them, here is a simple AppEngine app demonstrating
how to do that.  The typical usage is:

- First, user visits the site, and sees a message to log in.
- The user follows the link to the Google login page, and logs in.
- The user is redirected back to your app's signup page to sign
  up.
- The user then gets a page thanking them for signup.

- In the future, whenever the user is logged in, they'll see a
  message greeting them by name.

Try logging out and logging back in with a fake email address
to create a different account (when you "log in" running your
local server, it doesn't ask for a password, and you can make
up whatever email you like).

The key piece that makes all of this work is tying the datastore
entity to the AppEngine user id, by passing the special property
id when creating the datastore entity.

cssi_user = CssiUser(..., id=user.user_id())
cssi_user.put()

and then, looking it up later by doing

cssi_user = CssiUser.get_by_id(user.user_id())
"""
import json
import webapp2
import jinja2
import os
import datetime
import logging

from google.appengine.api import users
from google.appengine.ext import ndb

JINJA_ENV = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions = ['jinja2.ext.autoescape'],
    autoescape = True
)

class CssiUser(ndb.Model):
  first_name = ndb.StringProperty()
  last_name = ndb.StringProperty()

 # usage_date = ndb.dictionary
class Entry(ndb.Model):
    date = ndb.DateProperty()
    heating_usage = ndb.IntegerProperty()
    cooling_usage = ndb.IntegerProperty()
    lighting_usage = ndb.IntegerProperty()
    appliance_usage = ndb.IntegerProperty()
    user_id = ndb.StringProperty()


class LoginHandler(webapp2.RequestHandler):
  def get(self):
    user = users.get_current_user()
    # If the user is logged in...
    if user:
      email_address = user.nickname()
      cssi_user = CssiUser.get_by_id(user.user_id())
      self.response.write(user.user_id())
      signout_link_html = '<a href="%s">sign out</a>' % (
          users.create_logout_url('/logout'))
      # If the user has previously been to our site, we greet them!
      if cssi_user:
        self.response.write('''
            Welcome %s %s (%s)! <br> %s <br>''' % (
                cssi_user.first_name,
                cssi_user.last_name,
                email_address,
                signout_link_html))
        self.redirect("/main")
      # If the user hasn't been to our site, we ask them to sign up
      else:
        self.response.write('''
            Welcome to our site, %s!  Please sign up! <br>
            <form method="post" action="/">
            <label>First name: &nbsp</label>
            <input type="text" name="first_name">
            <label>Last name: &nbsp</label>
            <input type="text" name="last_name">
            <input type="submit">
            </form><br> %s <br>
            ''' % (email_address, signout_link_html))
    # Otherwise, the user isn't logged in!
    else:
      self.response.write('''
      <head><link rel = "stylesheet" type = "text/css" href = "css/login.css"></head>
        <h1>Please log in to use our site!</h1> <br>
        <button><a href="%s">Sign in</a></button><img src = "/css/welcome.gif">''' % (
          users.create_login_url('/')))

  def post(self):
    user = users.get_current_user()
    if not user:
      # You shouldn't be able to get here without being logged in
      self.error(500)
      return
    cssi_user = CssiUser(
        first_name=self.request.get('first_name'),
        last_name=self.request.get('last_name'),
        id=user.user_id())
    cssi_user.put()
    self.response.write('Thanks for signing up, %s!' %
        cssi_user.first_name)


class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            signout_link_html = users.create_logout_url('/')
            email_address = user.nickname()
            cssi_user = CssiUser.get_by_id(user.user_id())
            self.redirect(signout_link_html)



class MainHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/main.html')
        entries = Entry.query().filter(Entry.user_id == users.get_current_user().user_id()).fetch()
        heat = ""
        for i in entries:
            heat += "   " +str(i.heating_usage)
        self.response.write(content.render(heat = heat))


class InputHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/input.html')
        self.response.write(content.render())

    def post(self):
        button = False
        entry = Entry(
        heating_usage = int(self.request.get('heating_usage')),
        cooling_usage = int(self.request.get('cooling_usage')),
        lighting_usage = int(self.request.get('lighting_usage')),
        appliance_usage = int(self.request.get('appliance_usage')),
        date = datetime.datetime.strptime("07/24/2018", "%m/%d/%Y").date(),
        user_id = users.get_current_user().user_id()
        )
        entry.put()

        content = JINJA_ENV.get_template('templates/input.html')
        self.response.write(content.render(button = True))


class JSONHandler(webapp2.RequestHandler):
    def get(self):
        entries = Entry.query().filter(Entry.user_id == users.get_current_user().user_id()).fetch()
        resultlist = []
        for entry in entries:
            monthly_results = {
            'month': entry.date.month,
            'Heating':entry.heating_usage,
            'WaterHeating':0,
            'Cooling':entry.cooling_usage,
            'Lights':entry.lighting_usage,
            'Appliance':entry.appliance_usage,
            'Electronics':0
            }
            resultlist.append(monthly_results)


class LeaderboardHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/leaderboard.html')
        self.response.write(content.render())


app = webapp2.WSGIApplication([
  ('/', LoginHandler),
  ('/main', MainHandler),
  ('/input', InputHandler),
  ('/leaderboard', LeaderboardHandler),
  ('/logout', LogoutHandler),
  ('/JSON', JSONHandler)
], debug=True)
