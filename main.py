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

import webapp2
import jinja2
import os
import datetime

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
        Please log in to use our site! <br>
        <a href="%s">Sign in</a>''' % (
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
        self.response.write(content.render())


class InputHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/input.html')
        params={"pizza": 2, "name": 5}
        self.response.write(content.render(params))

    def post(self):
        heat_usage = self.request.get('heating_usage')
        print(heat_usage)
        cold_usage = self.request.get('cooling_usage')
        print(cold_usage)
        light_usage = self.request.get('lighting_usage')
        print(light_usage)
        appliance_usage = self.request.get('appliance_usage')
        print(appliance_usage)

        self.response.write("Your total heat usage for this month is: " + str(heat_usage) + "\n" +
        "The kw of energy you used this month for cooling is: " + str(cold_usage) + "\n" +
        "The kw of energy you used this month for light is: " + str(light_usage) + "\n" +
        "The kw of energy you used this month for appliances is: " + str(appliance_usage))




class LeaderboardHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/leaderboard.html')
        self.response.write(content.render())


app = webapp2.WSGIApplication([
  ('/', LoginHandler),
  ('/main', MainHandler),
  ('/input', InputHandler),
  ('/leaderboard', LeaderboardHandler),
  ('/logout', LogoutHandler)
], debug=True)
